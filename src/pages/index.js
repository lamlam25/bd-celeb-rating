import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>BD Celebrity Rater</title>
        <meta name="description" content="Rate your favourite Bangladeshi celebrities" />
      </Head>
      <div className="page-wrapper">
        <div style={styles.container}>
          {/* Left panel - branding */}
          <div style={styles.left}>
            <div style={styles.brand}>
              <div style={styles.logo}>★</div>
              <h1 style={styles.brandTitle}>BD Celebrity<br />Rater</h1>
              <p style={styles.brandSub}>
                Rate & discover the most beloved personalities of Bangladesh
              </p>
              <div style={styles.stats}>
                <div style={styles.stat}>
                  <span style={styles.statNum}>20</span>
                  <span style={styles.statLabel}>Celebrities</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.stat}>
                  <span style={styles.statNum}>100</span>
                  <span style={styles.statLabel}>Images</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.stat}>
                  <span style={styles.statNum}>5★</span>
                  <span style={styles.statLabel}>Rating Scale</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - auth form */}
          <div style={styles.right}>
            <div style={styles.card}>
              <div style={styles.tabs}>
                <button
                  style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
                  onClick={() => { setMode('login'); setError(''); }}
                >
                  Login
                </button>
                <button
                  style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
                  onClick={() => { setMode('register'); setError(''); }}
                >
                  Register
                </button>
              </div>

              <form onSubmit={submit} style={styles.form}>
                {mode === 'register' && (
                  <div style={styles.field}>
                    <label style={styles.label}>Full Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handle}
                      placeholder="Your full name"
                      required
                      style={styles.input}
                    />
                  </div>
                )}

                <div style={styles.field}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handle}
                    placeholder="you@example.com"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handle}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    style={styles.input}
                  />
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <button type="submit" disabled={loading} style={styles.btn}>
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <p style={styles.switchText}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                  style={styles.switchBtn}
                >
                  {mode === 'login' ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a0a0a 0%, #0a0a1a 50%, #0d1a0a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    position: 'relative',
    overflow: 'hidden',
  },
  brand: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '420px',
  },
  logo: {
    fontSize: '64px',
    color: '#e8b84b',
    marginBottom: '24px',
    filter: 'drop-shadow(0 0 30px rgba(232,184,75,0.5))',
  },
  brandTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '52px',
    fontWeight: 900,
    lineHeight: 1.1,
    color: '#f0ede8',
    marginBottom: '20px',
    letterSpacing: '-1px',
  },
  brandSub: {
    fontSize: '17px',
    color: '#a09aa8',
    lineHeight: 1.6,
    marginBottom: '48px',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px',
    fontWeight: 700,
    color: '#e8b84b',
  },
  statLabel: {
    fontSize: '13px',
    color: '#7a7888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255,255,255,0.1)',
  },
  right: {
    width: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: '#0a0a0f',
  },
  card: {
    width: '100%',
    maxWidth: '380px',
  },
  tabs: {
    display: 'flex',
    background: '#13131a',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '32px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  tab: {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#7a7888',
    fontSize: '15px',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#1c1c28',
    color: '#f0ede8',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#9a94a8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '13px 16px',
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#f0ede8',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    background: 'rgba(201,75,75,0.15)',
    border: '1px solid rgba(201,75,75,0.3)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#e07070',
    fontSize: '14px',
  },
  btn: {
    padding: '14px',
    background: 'linear-gradient(135deg, #e8b84b, #d4a035)',
    border: 'none',
    borderRadius: '10px',
    color: '#0a0a0f',
    fontSize: '15px',
    fontWeight: 600,
    marginTop: '4px',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  switchText: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#7a7888',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#e8b84b',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 500,
  },
};
