import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, Check, Eye, EyeOff, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, registerUser, resendVerificationCode, verifyEmailUser } from '../store/authSlice.js';
import { apiError } from '../services/api.js';

export function AuthPage({ mode }) {
  const register = mode === 'register';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [code, setCode] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busySeconds, setBusySeconds] = useState(0);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!busy) return undefined;
    const timer = window.setInterval(() => setBusySeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [busy]);

  const set = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  const clearMessages = () => { setError(''); setNotice(''); };

  const submit = async (event) => {
    event.preventDefault();
    clearMessages();
    setBusySeconds(0);
    setBusy(true);
    try {
      if (register && verificationPending) {
        await dispatch(verifyEmailUser({ email: form.email, code })).unwrap();
        navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
      } else if (register) {
        const result = await dispatch(registerUser(form)).unwrap();
        setVerificationPending(true);
        setNotice(result.message || 'Check your inbox for a six-digit verification code.');
      } else {
        await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
        navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
      }
    } catch (value) {
      setError(typeof value === 'string' ? value : apiError(value, verificationPending ? 'Unable to verify your email.' : 'Unable to continue. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    clearMessages();
    setResending(true);
    try {
      const result = await dispatch(resendVerificationCode({ email: form.email })).unwrap();
      setNotice(result.message || 'If a registration is pending for this address, a new code will be sent.');
    } catch (value) {
      setError(typeof value === 'string' ? value : apiError(value, 'Unable to resend the verification code.'));
    } finally {
      setResending(false);
    }
  };

  const editSignup = () => {
    setVerificationPending(false);
    setCode('');
    clearMessages();
  };

  const title = verificationPending ? 'Check your email' : register ? 'Create your account' : 'Sign in to SmartMail';
  const subtitle = verificationPending
    ? <>We sent a six-digit code to <strong>{form.email}</strong>. Enter it to finish creating your account.</>
    : register ? 'A clearer inbox is just a few details away.' : 'Your calmer inbox is waiting for you.';

  return <div className="auth-layout">
    <section className="auth-visual">
      <div className="auth-logo"><span className="brand-mark"><Mail size={20} /></span> smartmail<span>.ai</span></div>
      <div className="auth-pitch">
        <span className="eyebrow"><Sparkles size={14} /> YOUR INBOX, IN FOCUS</span>
        <h1>Make room for the<br /><em>important</em> things.</h1>
        <p>A thoughtful workspace for email, with helpful AI that keeps you in control.</p>
        <div className="auth-benefits">
          <span><Check size={15} /> Find answers across your inbox</span>
          <span><Check size={15} /> Draft with AI, review every word</span>
          <span><ShieldCheck size={15} /> Your mailbox stays yours</span>
        </div>
      </div>
      <div className="auth-visual-foot">Email made calmer, one message at a time.</div>
    </section>

    <section className="auth-panel">
      <div className="auth-form-wrap">
        <div className="auth-mobile-logo"><span className="brand-mark"><Mail size={19} /></span> smartmail<span>.ai</span></div>
        <div className="auth-kicker">{verificationPending ? 'EMAIL VERIFICATION' : register ? 'GET STARTED' : 'WELCOME BACK'}</div>
        <h2>{title}</h2>
        <p className="auth-subtitle">{subtitle}</p>
        {error && <div className="notice error" role="alert">{error}</div>}
        {notice && <div className="notice success" role="status">{notice}</div>}

        <form className="auth-form" onSubmit={submit}>
          {register && verificationPending ? <>
            <div className="field">
              <label htmlFor="verification-email">Email address</label>
              <input id="verification-email" type="email" value={form.email} readOnly />
            </div>
            <div className="field">
              <label htmlFor="verification-code">Six-digit code</label>
              <input
                id="verification-code"
                className="verification-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                aria-describedby="verification-help"
              />
              <small id="verification-help" className="field-hint">The code expires after 10 minutes.</small>
            </div>
          </> : <>
            {register && <div className="field"><label htmlFor="fullName">Full name</label><input id="fullName" autoComplete="name" required minLength={2} maxLength={100} value={form.fullName} onChange={set('fullName')} placeholder="Alex Morgan" /></div>}
            <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={set('email')} placeholder="you@example.com" /></div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 12 : 1} maxLength={128} value={form.password} onChange={set('password')} placeholder={register ? 'At least 12 characters' : 'Enter your password'} />
                <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
              {register && <small className="field-hint">Use 12 or more characters.</small>}
            </div>
          </>}

          <button className="btn primary auth-submit" disabled={busy}>
            {busy ? <><span className="spinner" /> {register && !verificationPending ? 'Sending code…' : 'Please wait…'}</> : <>{verificationPending ? 'Verify email' : register ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></>}
          </button>
          {busy && register && !verificationPending && busySeconds >= 5 && <small className="field-hint" role="status">The API may be waking after inactivity. On Render Free, this can take about a minute.</small>}
        </form>

        {verificationPending ? <div className="auth-verification-actions">
          <button type="button" className="text-button auth-resend" onClick={resend} disabled={resending || busy}>{resending ? <><span className="spinner" /> Sending</> : 'Resend code'}</button>
          <button type="button" className="auth-inline-button" onClick={editSignup}>Change signup details</button>
        </div> : <div className="auth-switch">{register ? 'Already have an account?' : 'New to SmartMail?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></div>}

        <div className="auth-privacy"><ShieldCheck size={14} />{verificationPending ? 'Your account is created only after email verification.' : 'Your account is protected with secure sessions.'}</div>
      </div>
    </section>
  </div>;
}
