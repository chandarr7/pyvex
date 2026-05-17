/* Login page — wired to Clerk Auth.
 *
 * Security note: the secret key (sk_test_...) is NEVER referenced here.
 * Only the publishable key (pk_test_...) is used, which is safe in client code.
 * The secret key belongs in your server, behind auth, and should be rotated
 * if it ever appears in chat, git, or a frontend bundle.
 *
 * Flow:
 *   - On mount, load Clerk SDK. If user is already signed in, jump to dashboard.
 *   - Email sign-in -> clerk.client.signIn.create({ identifier, password })
 *   - Email sign-up -> clerk.client.signUp.create({ emailAddress, password, firstName }),
 *                      then prepareEmailAddressVerification — show OTP step.
 *   - OAuth -> signIn.authenticateWithRedirect({ strategy:'oauth_google'|'oauth_apple' })
 *
 * Verification redirect:
 *   - We send the user back to /verify.html which calls clerk.handleRedirectCallback().
 */

const LoginPage = () => {
  const [mode, setMode] = React.useState('signin'); // 'signin' | 'signup' | 'verify' | 'done'
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [focused, setFocused] = React.useState(null);
  const [clerk, setClerk] = React.useState(null);
  const [clerkLoading, setClerkLoading] = React.useState(true);

  // Load Clerk on mount
  React.useEffect(() => {
    let cancelled = false;
    window.loadClerk()
      .then(c => {
        if (cancelled) return;
        setClerk(c);
        setClerkLoading(false);
        // If already signed in, jump straight in
        if (c.user) setMode('done');
      })
      .catch(err => {
        if (cancelled) return;
        console.error('Clerk load failed:', err);
        setError('Auth service unreachable. Demo mode active.');
        setClerkLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // rotate portraits behind the editorial panel
  const [tIdx, setTIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTIdx(i => (i + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);
  const tones = ['jade', 'emerald', 'smoke'];

  const onOAuth = async (strategy) => {
    setError('');
    if (!clerk) { setError('Auth not ready. Try again in a moment.'); return; }
    try {
      setSubmitting(true);
      await clerk.client.signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: window.location.origin + window.location.pathname.replace(/login\.html$/, 'verify.html'),
        redirectUrlComplete: window.location.origin + window.location.pathname.replace(/login\.html$/, 'index.html'),
      });
    } catch (err) {
      setError(window.clerkErrMessage(err));
      setSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password required.'); return; }
    if (!clerk) {
      // demo fallback
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); setMode('done'); }, 1200);
      return;
    }
    try {
      setSubmitting(true);
      if (mode === 'signin') {
        const res = await clerk.client.signIn.create({ identifier: email, password });
        if (res.status === 'complete') {
          await clerk.setActive({ session: res.createdSessionId });
          setMode('done');
        } else if (res.status === 'needs_first_factor' || res.status === 'needs_second_factor') {
          setError('Additional verification needed. Check your email.');
        } else {
          setError(`Sign-in returned status: ${res.status}. Check your Clerk dashboard settings.`);
        }
      } else {
        // signup
        const [firstName, ...rest] = (name || '').trim().split(/\s+/);
        const params = { emailAddress: email, password };
        if (firstName) params.firstName = firstName;
        if (rest.length) params.lastName = rest.join(' ');
        const signUp = await clerk.client.signUp.create(params);
        if (signUp.status === 'complete') {
          await clerk.setActive({ session: signUp.createdSessionId });
          // skip OTP if not required, go straight to onboarding
          window.location.href = 'onboarding.html';
        } else {
          await clerk.client.signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setMode('verify');
        }
      }
    } catch (err) {
      console.error('[Auth] submit error:', err);
      setError(window.clerkErrMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    setError('');
    if (!code) { setError('Enter the 6-digit code.'); return; }
    try {
      setSubmitting(true);
      const res = await clerk.client.signUp.attemptEmailAddressVerification({ code });
      if (res.status === 'complete') {
        await clerk.setActive({ session: res.createdSessionId });
        // new signups go through onboarding
        window.location.href = 'onboarding.html';
      } else {
        setError('Code incorrect. Try again.');
      }
    } catch (err) {
      setError(window.clerkErrMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const swap = (next) => { setMode(next); setError(''); };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 1fr', position: 'relative', zIndex: 1 }}>
      {/* LEFT — editorial cinema */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        {tones.map((t, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: tIdx === i ? 1 : 0,
            transition: 'opacity 1800ms cubic-bezier(0.2,0.8,0.2,1)',
          }}>
            <Portrait tone={t} aspectRatio="auto" label="" style={{ height: '100%', borderRadius: 0 }}/>
          </div>
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(110deg, rgba(5,7,7,0.3) 0%, rgba(5,7,7,0.7) 60%, rgba(5,7,7,0.95) 100%)',
          pointerEvents: 'none',
        }}/>
        <a href="index.html" style={{
          position: 'absolute', top: 36, left: 40, zIndex: 2,
          fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 22,
          color: 'var(--fg-1)', letterSpacing: '-0.01em', textDecoration: 'none',
        }}>
          pyvex<span style={{ color: 'var(--accent)', textShadow: '0 0 12px rgba(70,243,168,0.6)' }}>·</span>me
        </a>
        <div style={{ position: 'absolute', left: 40, right: 40, bottom: 40, zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px rgba(70,243,168,0.7)' }}/>
            · CHAPTER 01
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: 1.04,
            letterSpacing: '-0.02em', margin: 0, color: 'var(--fg-1)',
            maxWidth: 460,
          }}>
            Your <em style={{ fontStyle: 'italic' }}>aura</em>,<br/>
            engineered.
          </h1>
          <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 22, color: 'var(--fg-1)' }}>14M</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>FRAMES</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 22, color: 'var(--fg-1)' }}>100K+</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>STYLED</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, fontSize: 22, color: 'var(--accent)' }}>4S</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>ANALYSIS</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 40, top: 40, zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(242,239,232,0.18)', animation: 'spin-slow 16s linear infinite' }}>
            <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 10px rgba(70,243,168,0.8)' }}/>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-2)', letterSpacing: '0.18em' }}>0{tIdx+1}/03</div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{
        background: 'var(--bg)', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '64px 48px',
      }}>
        <div aria-hidden style={{
          position: 'absolute', right: '-20%', top: '20%',
          width: '80%', height: '60%',
          background: 'radial-gradient(closest-side, #46F3A8, transparent 70%)',
          opacity: 0.10, filter: 'blur(120px)', pointerEvents: 'none',
        }}/>

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {clerkLoading ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 999, border: '1px solid rgba(242,239,232,0.18)', animation: 'spin-slow 1.4s linear infinite', margin: '0 auto 16px' }}>
                <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}/>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>CONNECTING TO PYVEX</div>
            </div>

          ) : mode === 'done' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 999,
                background: 'rgba(70,243,168,0.10)',
                border: '1px solid rgba(70,243,168,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', color: 'var(--accent)',
                boxShadow: '0 0 60px rgba(70,243,168,0.3)',
              }}>
                <Icon name="check" size={24} stroke={2}/>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 36,
                lineHeight: 1.1, letterSpacing: '-0.02em',
                margin: '0 0 12px', color: 'var(--fg-1)',
              }}>You&rsquo;re <em style={{ fontStyle: 'italic' }}>in</em>.</h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-2)', margin: '0 0 32px' }}>
                Reading your tonal field. Generating your first twelve looks.
              </p>
              <a href="index.html" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Enter the studio</a>
            </div>

          ) : mode === 'verify' ? (
            <>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 20 }}>· VERIFY EMAIL</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 300,
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                lineHeight: 1.05, letterSpacing: '-0.02em',
                margin: '0 0 14px', color: 'var(--fg-1)',
              }}>
                Check your <em style={{ fontStyle: 'italic' }}>inbox</em>.
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-2)', margin: '0 0 36px', lineHeight: 1.5 }}>
                We sent a six-digit code to <span style={{ color: 'var(--fg-1)' }}>{email}</span>.
              </p>
              <form onSubmit={onVerify} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <label style={{ display: 'block' }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: focused === 'code' ? 'var(--accent)' : 'var(--fg-3)', marginBottom: 8, transition: 'color 300ms' }}>CODE</div>
                  <input
                    inputMode="numeric" maxLength={6}
                    value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g,''))}
                    onFocus={() => setFocused('code')} onBlur={() => setFocused(null)}
                    placeholder="000000"
                    style={{
                      width: '100%', background: 'transparent',
                      border: 'none',
                      borderBottom: `1.5px solid ${focused === 'code' ? 'var(--accent)' : 'var(--border-strong)'}`,
                      color: 'var(--fg-1)', fontFamily: 'var(--font-mono)', fontSize: 28,
                      letterSpacing: '0.4em', padding: '8px 0', outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 300ms',
                    }}
                  />
                </label>
                {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff7a7a' }}>{error}</div>}
                <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', padding: '16px 24px', fontSize: 15, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Verifying' : 'Verify and continue'}
                </button>
                <button type="button" onClick={() => swap('signup')} style={{ background: 'transparent', border: 'none', color: 'var(--fg-3)', fontFamily: 'var(--font-ui)', fontSize: 12, cursor: 'pointer' }}>
                  Wrong email? Go back
                </button>
              </form>
            </>

          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 20 }}>
                {mode === 'signin' ? '· WELCOME BACK' : '· BEGIN'}
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 300,
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                lineHeight: 1.12, letterSpacing: '-0.02em',
                margin: '0 0 20px', color: 'var(--fg-1)',
              }}>
                {mode === 'signin'
                  ? <>Step back into the <em style={{ fontStyle: 'italic' }}>studio</em>.</>
                  : <>Begin your <em style={{ fontStyle: 'italic' }}>signature</em>.</>}
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--fg-2)', margin: '0 0 36px', lineHeight: 1.5 }}>
                {mode === 'signin'
                  ? 'Twelve new looks waiting. Pick up where you left off.'
                  : 'Free forever. No card. Four-second analysis.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                <button type="button" onClick={() => onOAuth('oauth_google')} disabled={submitting} className="btn-ghost" style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" opacity=".55"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" opacity=".7"/><path fill="currentColor" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z" opacity=".85"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                  Continue with Google
                </button>
                <button type="button" onClick={() => onOAuth('oauth_apple')} disabled={submitting} className="btn-ghost" style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Continue with Apple
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '0 0 28px' }}>
                <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-3)' }}>OR EMAIL</span>
                <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
              </div>

              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {mode === 'signup' && (
                  <label style={{ display: 'block' }}>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: focused === 'name' ? 'var(--accent)' : 'var(--fg-3)', marginBottom: 8, transition: 'color 300ms' }}>NAME</div>
                    <input
                      value={name} onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                      placeholder="Rose Tanaka"
                      style={{
                        width: '100%', background: 'transparent',
                        border: 'none',
                        borderBottom: `1.5px solid ${focused === 'name' ? 'var(--accent)' : 'var(--border-strong)'}`,
                        color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 16,
                        padding: '8px 0', outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 300ms',
                      }}
                    />
                  </label>
                )}
                <label style={{ display: 'block' }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: focused === 'email' ? 'var(--accent)' : 'var(--fg-3)', marginBottom: 8, transition: 'color 300ms' }}>EMAIL</div>
                  <input
                    type="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    placeholder="you@studio.com"
                    style={{
                      width: '100%', background: 'transparent',
                      border: 'none',
                      borderBottom: `1.5px solid ${focused === 'email' ? 'var(--accent)' : 'var(--border-strong)'}`,
                      color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 16,
                      padding: '8px 0', outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 300ms',
                    }}
                  />
                </label>
                <label style={{ display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: focused === 'pw' ? 'var(--accent)' : 'var(--fg-3)', transition: 'color 300ms' }}>PASSWORD</span>
                    {mode === 'signin' && (
                      <a style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-2)', cursor: 'pointer' }} onClick={async () => {
                        if (!email) { setError('Enter your email first.'); return; }
                        if (!clerk) return;
                        try {
                          await clerk.client.signIn.create({ identifier: email });
                          await clerk.client.signIn.prepareFirstFactor({ strategy: 'reset_password_email_code', emailAddressId: clerk.client.signIn.supportedFirstFactors?.find(f => f.strategy === 'reset_password_email_code')?.emailAddressId });
                          setError('Reset link sent to ' + email);
                        } catch (err) { setError(window.clerkErrMessage(err)); }
                      }}>Forgot?</a>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('pw')} onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', background: 'transparent',
                      border: 'none',
                      borderBottom: `1.5px solid ${focused === 'pw' ? 'var(--accent)' : 'var(--border-strong)'}`,
                      color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 16,
                      padding: '8px 0', outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 300ms',
                    }}
                  />
                </label>

                {error && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff7a7a', lineHeight: 1.4 }}>{error}</div>
                )}

                <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', padding: '16px 24px', marginTop: 8, fontSize: 15, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ display: 'flex', gap: 3 }}>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}/>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.2s' }}/>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.4s' }}/>
                      </span>
                      {mode === 'signin' ? 'Entering' : 'Calibrating'}
                    </span>
                  ) : (mode === 'signin' ? 'Continue' : 'Begin AI styling')}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 28, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-2)' }}>
                {mode === 'signin' ? 'New to PYVEX?' : 'Already a member?'}{' '}
                <a onClick={() => swap(mode === 'signin' ? 'signup' : 'signin')} style={{ color: 'var(--fg-1)', cursor: 'pointer', borderBottom: '1px solid var(--border-strong)' }}>
                  {mode === 'signin' ? 'Create an account' : 'Sign in'}
                </a>
              </div>

              {mode === 'signup' && (
                <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                  By continuing, you agree to our <a style={{ color: 'var(--fg-2)', cursor: 'pointer' }}>Terms</a> and <a style={{ color: 'var(--fg-2)', cursor: 'pointer' }}>Privacy Notice</a>.
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: clerk ? 'var(--accent)' : '#ff7a7a', boxShadow: clerk ? '0 0 8px var(--accent)' : 'none' }}/>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.10em' }}>
            {clerk ? 'CLERK · LIVE' : (clerkLoading ? 'CONNECTING' : 'DEMO MODE')}
          </span>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { LoginPage });
