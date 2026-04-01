import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { celebrities } from '../lib/celebrities';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [selected, setSelected] = useState(null); // { celeb, imgIdx }
  const [ratings, setRatings] = useState({}); // { imageId: rating }
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [progress, setProgress] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [imgError, setImgError] = useState({});

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!t || !u) { router.push('/'); return; }
    setToken(t);
    setUser(JSON.parse(u));
    fetchRatings(t);
  }, []);

  const fetchRatings = async (t) => {
    const res = await fetch('/api/ratings', {
      headers: { Authorization: `Bearer ${t}` },
    });
    const data = await res.json();
    const map = {};
    data.ratings?.forEach(r => { map[r.imageId] = r.rating; });
    setRatings(map);
    setProgress(data.ratings?.length || 0);
  };

  const imageId = (celebId, imgIdx) => `${celebId}_${imgIdx + 1}`;

  const rateImage = async (rating) => {
    if (!selected) return;
    const { celeb, imgIdx } = selected;
    const id = imageId(celeb.id, imgIdx);
    setSaving(true);
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageId: id,
          celebrityId: celeb.id,
          celebrityName: celeb.name,
          imageNumber: imgIdx + 1,
          rating,
        }),
      });
      const isNew = !ratings[id];
      setRatings(prev => ({ ...prev, [id]: rating }));
      if (isNew) setProgress(p => p + 1);
      setSaved('Rated!');
      setTimeout(() => setSaved(''), 1500);

      // Auto advance
      const nextIdx = imgIdx + 1;
      if (nextIdx < celeb.images.length) {
        setTimeout(() => setSelected({ celeb, imgIdx: nextIdx }), 600);
      } else {
        setTimeout(() => setSelected(null), 600);
      }
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = (type) => {
    window.location.href = `/api/export?type=${type}&t=${token}`;
  };

  const logout = () => {
    localStorage.clear();
    router.push('/');
  };

  const categories = ['All', ...new Set(celebrities.map(c => c.category))];
  const filtered = filterCat === 'All' ? celebrities : celebrities.filter(c => c.category === filterCat);

  const totalImages = 100;
  const pct = Math.round((progress / totalImages) * 100);

  const getCelebProgress = (celeb) => {
    let count = 0;
    celeb.images.forEach((_, i) => {
      if (ratings[imageId(celeb.id, i)]) count++;
    });
    return count;
  };

  if (!user) return null;

  return (
    <>
      <Head><title>Dashboard — BD Celebrity Rater</title></Head>
      <div className="page-wrapper">
        {/* Header */}
        <header style={s.header}>
          <div style={s.headerInner}>
            <div style={s.headerLeft}>
              <span style={s.headerLogo}>★</span>
              <span style={s.headerTitle}>BD Celebrity Rater</span>
            </div>
            <div style={s.headerRight}>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: `${pct}%` }} />
              </div>
              <span style={s.progressLabel}>{progress}/{totalImages} rated</span>
              <div style={s.userBadge}>{user.name?.charAt(0).toUpperCase()}</div>
              <span style={s.userName}>{user.name}</span>
              <button onClick={logout} style={s.logoutBtn}>Logout</button>
            </div>
          </div>
        </header>

        <main style={s.main}>
          {/* Controls */}
          <div style={s.controls}>
            <div style={s.catFilters}>
              {categories.map(cat => (
                <button
                  key={cat}
                  style={{ ...s.catBtn, ...(filterCat === cat ? s.catBtnActive : {}) }}
                  onClick={() => setFilterCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={s.exportBtns}>
              <button onClick={() => exportExcel('dataset')} style={s.exportBtn}>
                ↓ Dataset Excel
              </button>
              <button onClick={() => exportExcel('ratings')} style={s.exportBtn}>
                ↓ Ratings Excel
              </button>
            </div>
          </div>

          {/* Celebrity Grid */}
          <div style={s.grid}>
            {filtered.map(celeb => {
              const done = getCelebProgress(celeb);
              return (
                <div key={celeb.id} style={s.celebCard}>
                  <div style={s.celebHeader}>
                    <div>
                      <h3 style={s.celebName}>{celeb.name}</h3>
                      <span style={s.celebCat}>{celeb.category}</span>
                    </div>
                    <div style={s.miniProgress}>
                      {celeb.images.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            ...s.miniDot,
                            background: ratings[imageId(celeb.id, i)]
                              ? '#e8b84b'
                              : 'rgba(255,255,255,0.1)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={s.imgGrid}>
                    {celeb.images.map((url, imgIdx) => {
                      const id = imageId(celeb.id, imgIdx);
                      const rated = ratings[id];
                      const errKey = `${celeb.id}_${imgIdx}`;
                      return (
                        <div
                          key={imgIdx}
                          style={{
                            ...s.imgThumb,
                            ...(selected?.celeb?.id === celeb.id && selected?.imgIdx === imgIdx
                              ? s.imgSelected : {}),
                            ...(rated ? s.imgRated : {}),
                          }}
                          onClick={() => setSelected({ celeb, imgIdx })}
                        >
                          {imgError[errKey] ? (
                            <div style={s.imgPlaceholder}>
                              <span style={{ fontSize: '18px' }}>🎬</span>
                              <span style={{ fontSize: '10px', color: '#7a7888', marginTop: '2px' }}>
                                Image {imgIdx + 1}
                              </span>
                            </div>
                          ) : (
                            <img
                              src={url}
                              alt={`${celeb.name} ${imgIdx + 1}`}
                              style={s.img}
                              onError={() => setImgError(prev => ({ ...prev, [errKey]: true }))}
                            />
                          )}
                          {rated && (
                            <div style={s.ratedOverlay}>
                              {'★'.repeat(rated)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={s.celebFooter}>
                    <span style={s.doneLabel}>{done}/5 rated</span>
                    {done === 5 && <span style={s.doneCheck}>✓ Complete</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Rating Modal */}
        {selected && (
          <div style={s.overlay} onClick={() => setSelected(null)}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>
              <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>

              <div style={s.modalTop}>
                <h2 style={s.modalName}>{selected.celeb.name}</h2>
                <span style={s.modalMeta}>Image {selected.imgIdx + 1} of 5 · {selected.celeb.category}</span>
              </div>

              <div style={s.modalImgWrap}>
                {imgError[`${selected.celeb.id}_${selected.imgIdx}`] ? (
                  <div style={{ ...s.imgPlaceholder, width: '100%', height: '340px', borderRadius: '12px' }}>
                    <span style={{ fontSize: '48px' }}>🎬</span>
                    <span style={{ color: '#7a7888', marginTop: '8px' }}>
                      {selected.celeb.name} — Image {selected.imgIdx + 1}
                    </span>
                    <span style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>
                      Replace placeholder URL in celebrities.js with real image
                    </span>
                  </div>
                ) : (
                  <img
                    src={selected.celeb.images[selected.imgIdx]}
                    alt={selected.celeb.name}
                    style={s.modalImg}
                    onError={() => setImgError(prev => ({
                      ...prev,
                      [`${selected.celeb.id}_${selected.imgIdx}`]: true
                    }))}
                  />
                )}
              </div>

              <div style={s.ratingSection}>
                <p style={s.ratingLabel}>Rate this image</p>
                <div style={s.stars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      style={{
                        ...s.star,
                        color: star <= (hoverRating || ratings[imageId(selected.celeb.id, selected.imgIdx)] || 0)
                          ? '#e8b84b' : 'rgba(255,255,255,0.15)',
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => rateImage(star)}
                      disabled={saving}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {saved && <div style={s.savedMsg}>{saved}</div>}
                {ratings[imageId(selected.celeb.id, selected.imgIdx)] && (
                  <p style={s.currentRating}>
                    Current rating: {ratings[imageId(selected.celeb.id, selected.imgIdx)]} / 5
                  </p>
                )}
              </div>

              <div style={s.modalNav}>
                <button
                  style={{ ...s.navBtn, opacity: selected.imgIdx === 0 ? 0.3 : 1 }}
                  disabled={selected.imgIdx === 0}
                  onClick={() => setSelected({ ...selected, imgIdx: selected.imgIdx - 1 })}
                >
                  ← Prev
                </button>
                <div style={s.imgDots}>
                  {selected.celeb.images.map((_, i) => (
                    <button
                      key={i}
                      style={{
                        ...s.dot,
                        background: i === selected.imgIdx ? '#e8b84b' : 'rgba(255,255,255,0.15)',
                        transform: i === selected.imgIdx ? 'scale(1.3)' : 'scale(1)',
                      }}
                      onClick={() => setSelected({ ...selected, imgIdx: i })}
                    />
                  ))}
                </div>
                <button
                  style={{ ...s.navBtn, opacity: selected.imgIdx === 4 ? 0.3 : 1 }}
                  disabled={selected.imgIdx === 4}
                  onClick={() => setSelected({ ...selected, imgIdx: selected.imgIdx + 1 })}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const s = {
  header: {
    position: 'sticky',
    top: 0,
    background: 'rgba(10,10,15,0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    zIndex: 100,
    padding: '0 32px',
  },
  headerInner: {
    maxWidth: '1400px',
    margin: '0 auto',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerLogo: { fontSize: '22px', color: '#e8b84b' },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#f0ede8',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  progressBar: {
    width: '120px',
    height: '6px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #e8b84b, #4bbd7f)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  progressLabel: { fontSize: '13px', color: '#7a7888' },
  userBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e8b84b, #d4a035)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#0a0a0f',
  },
  userName: { fontSize: '14px', color: '#a09aa8' },
  logoutBtn: {
    padding: '6px 14px',
    background: 'rgba(201,75,75,0.15)',
    border: '1px solid rgba(201,75,75,0.25)',
    borderRadius: '8px',
    color: '#e07070',
    fontSize: '13px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  catFilters: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: {
    padding: '7px 16px',
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#7a7888',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  catBtnActive: {
    background: 'rgba(232,184,75,0.15)',
    border: '1px solid rgba(232,184,75,0.4)',
    color: '#e8b84b',
  },
  exportBtns: { display: 'flex', gap: '10px' },
  exportBtn: {
    padding: '8px 18px',
    background: 'rgba(75,189,127,0.12)',
    border: '1px solid rgba(75,189,127,0.3)',
    borderRadius: '8px',
    color: '#4bbd7f',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  celebCard: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '20px',
    transition: 'border-color 0.2s',
  },
  celebHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  celebName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#f0ede8',
    marginBottom: '4px',
  },
  celebCat: {
    fontSize: '12px',
    color: '#7a7888',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  miniProgress: { display: 'flex', gap: '4px' },
  miniDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background 0.3s',
  },
  imgGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
    marginBottom: '14px',
  },
  imgThumb: {
    aspectRatio: '1',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid transparent',
    position: 'relative',
    background: '#1c1c28',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  imgSelected: {
    borderColor: '#e8b84b',
    transform: 'scale(1.05)',
  },
  imgRated: {
    borderColor: 'rgba(75,189,127,0.5)',
  },
  imgPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1c1c28',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  ratedOverlay: {
    position: 'absolute',
    bottom: '2px',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '9px',
    color: '#e8b84b',
    background: 'rgba(0,0,0,0.6)',
    padding: '1px 0',
  },
  celebFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doneLabel: { fontSize: '12px', color: '#7a7888' },
  doneCheck: { fontSize: '12px', color: '#4bbd7f', fontWeight: 500 },

  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '520px',
    padding: '32px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255,255,255,0.08)',
    border: 'none',
    borderRadius: '8px',
    color: '#a09aa8',
    fontSize: '16px',
    padding: '6px 10px',
    cursor: 'pointer',
  },
  modalTop: { marginBottom: '20px' },
  modalName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '26px',
    fontWeight: 700,
    color: '#f0ede8',
    marginBottom: '4px',
  },
  modalMeta: { fontSize: '14px', color: '#7a7888' },
  modalImgWrap: {
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
    background: '#1c1c28',
    height: '300px',
  },
  modalImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  ratingSection: { textAlign: 'center', marginBottom: '24px' },
  ratingLabel: {
    fontSize: '14px',
    color: '#7a7888',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  stars: { display: 'flex', justifyContent: 'center', gap: '8px' },
  star: {
    fontSize: '40px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.15s, transform 0.15s',
    padding: '0 2px',
  },
  savedMsg: {
    marginTop: '12px',
    color: '#4bbd7f',
    fontSize: '15px',
    fontWeight: 600,
    animation: 'fadeIn 0.2s ease',
  },
  currentRating: {
    marginTop: '8px',
    color: '#7a7888',
    fontSize: '13px',
  },
  modalNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    padding: '9px 18px',
    background: '#1c1c28',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#a09aa8',
    fontSize: '14px',
    cursor: 'pointer',
  },
  imgDots: { display: 'flex', gap: '8px' },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
