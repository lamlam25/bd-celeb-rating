import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Admin email - only this user can access admin panel
const ADMIN_EMAIL = 'lamialabib.sarker@gmail.com';

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!t || !u) {
      router.push('/');
      return;
    }
    
    const userData = JSON.parse(u);
    
    // Check if user is admin
    if (userData.email !== ADMIN_EMAIL) {
      setError('Access Denied: Admin only');
      setLoading(false);
      return;
    }
    
    setToken(t);
    setUser(userData);
    fetchStats(t);
  }, []);

  const fetchStats = async (t) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${t}` },
      });
      
      if (res.status === 403) {
        setError('Access Denied: Admin only');
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load admin panel');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push('/');
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#7a7888' }}>Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...s.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px' }}>
        <h1 style={{ fontSize: '48px', color: '#e07070' }}>🚫</h1>
        <h2 style={{ color: '#e07070', fontSize: '24px' }}>{error}</h2>
        <p style={{ color: '#7a7888' }}>You do not have permission to access this page.</p>
        <button onClick={() => router.push('/dashboard')} style={{ 
          padding: '10px 20px',
          background: '#4bbd7f',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#e07070' }}>Failed to load stats</p>
      </div>
    );
  }

  return (
    <>
      <Head><title>Admin Panel — BD Celebrity Rater</title></Head>
      <div style={s.page}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.headerInner}>
            <div style={s.headerLeft}>
              <span style={s.headerLogo}>⚙️</span>
              <span style={s.headerTitle}>Admin Panel</span>
            </div>
            <div style={s.headerRight}>
              <button onClick={goToDashboard} style={s.dashboardBtn}>
                ← Back to Dashboard
              </button>
              <div style={s.userBadge}>{user?.name?.charAt(0).toUpperCase()}</div>
              <span style={s.userName}>{user?.name}</span>
              <button onClick={logout} style={s.logoutBtn}>Logout</button>
            </div>
          </div>
        </header>

        <main style={s.main}>
          {/* Summary Cards */}
          <div style={s.summaryGrid}>
            <div style={s.summaryCard}>
              <div style={s.summaryIcon}>👥</div>
              <div style={s.summaryValue}>{stats.totalUsers}</div>
              <div style={s.summaryLabel}>Total Users</div>
            </div>
            <div style={s.summaryCard}>
              <div style={s.summaryIcon}>⭐</div>
              <div style={s.summaryValue}>{stats.totalRatings}</div>
              <div style={s.summaryLabel}>Total Ratings</div>
            </div>
            <div style={s.summaryCard}>
              <div style={s.summaryIcon}>🎬</div>
              <div style={s.summaryValue}>{stats.celebrityAverages.length}</div>
              <div style={s.summaryLabel}>Rated Celebrities</div>
            </div>
            <div style={s.summaryCard}>
              <div style={s.summaryIcon}>📊</div>
              <div style={s.summaryValue}>
                {stats.totalUsers > 0 ? (stats.totalRatings / stats.totalUsers).toFixed(1) : 0}
              </div>
              <div style={s.summaryLabel}>Avg Ratings/User</div>
            </div>
          </div>

          {/* Celebrity Average Ratings */}
          <section style={s.section}>
            <h2 style={s.sectionTitle}>Celebrity Average Ratings</h2>
            <div style={s.celebGrid}>
              {stats.celebrityAverages.map((celeb) => (
                <div key={celeb.id} style={s.celebCard}>
                  <div style={s.celebCardHeader}>
                    <h3 style={s.celebCardName}>{celeb.name}</h3>
                    <div style={s.celebAvg}>
                      <span style={s.avgStars}>{'★'.repeat(Math.round(celeb.avgRating))}</span>
                      <span style={s.avgNumber}>{celeb.avgRating}</span>
                    </div>
                  </div>
                  <div style={s.celebCardMeta}>
                    <span style={s.metaItem}>{celeb.totalRatings} ratings</span>
                  </div>
                  <div style={s.distribution}>
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = celeb.ratingDistribution[star];
                      const pct = celeb.totalRatings > 0 ? (count / celeb.totalRatings) * 100 : 0;
                      return (
                        <div key={star} style={s.distRow}>
                          <span style={s.distLabel}>{star}★</span>
                          <div style={s.distBar}>
                            <div style={{ ...s.distFill, width: `${pct}%` }} />
                          </div>
                          <span style={s.distCount}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* User List */}
          <section style={s.section}>
            <h2 style={s.sectionTitle}>Registered Users</h2>
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr style={s.tableHeaderRow}>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Joined</th>
                    <th style={s.th}>Total Ratings</th>
                    <th style={s.th}>Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.users.map((u) => (
                    <tr key={u.id} style={s.tableRow}>
                      <td style={s.td}>{u.name}</td>
                      <td style={s.td}>{u.email}</td>
                      <td style={s.td}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={s.td}>{u.totalRatings}</td>
                      <td style={s.td}>
                        <span style={s.avgBadge}>{u.avgRating} ★</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#f0ede8',
  },
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
  headerLogo: { fontSize: '22px' },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#f0ede8',
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '14px' },
  dashboardBtn: {
    padding: '8px 16px',
    background: 'rgba(75,189,127,0.12)',
    border: '1px solid rgba(75,189,127,0.3)',
    borderRadius: '8px',
    color: '#4bbd7f',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 500,
  },
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
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  summaryCard: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '24px',
    textAlign: 'center',
  },
  summaryIcon: { fontSize: '32px', marginBottom: '12px' },
  summaryValue: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#e8b84b',
    marginBottom: '4px',
  },
  summaryLabel: { fontSize: '13px', color: '#7a7888', textTransform: 'uppercase' },
  section: { marginBottom: '40px' },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    fontWeight: 700,
    color: '#f0ede8',
    marginBottom: '20px',
  },
  celebGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  celebCard: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '20px',
  },
  celebCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  celebCardName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#f0ede8',
  },
  celebAvg: { display: 'flex', alignItems: 'center', gap: '8px' },
  avgStars: { color: '#e8b84b', fontSize: '14px' },
  avgNumber: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#e8b84b',
  },
  celebCardMeta: { marginBottom: '16px' },
  metaItem: { fontSize: '12px', color: '#7a7888' },
  distribution: { display: 'flex', flexDirection: 'column', gap: '6px' },
  distRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  distLabel: { fontSize: '11px', color: '#7a7888', width: '24px' },
  distBar: {
    flex: 1,
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  distFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #e8b84b, #d4a035)',
    borderRadius: '3px',
  },
  distCount: { fontSize: '11px', color: '#7a7888', width: '20px', textAlign: 'right' },
  tableWrapper: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    color: '#7a7888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#a09aa8',
  },
  avgBadge: {
    background: 'rgba(232,184,75,0.15)',
    color: '#e8b84b',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
  },
};
