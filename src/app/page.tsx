'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────
interface Domain {
  domain_name: string;
}

interface EmailItem {
  id: string;
  subject: string;
  from: string;
  date: string;
}

// ─── SVG Icons ───────────────────────────────────────────
const Icons = {
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  copy: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />
    </svg>
  ),
  inbox: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  ),
  zap: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  ),
  clock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  globe: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  trash: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  user: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  dice: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" /><path d="m18 2 4 4-4 4" /><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" /><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" /><path d="m18 14 4 4-4 4" />
    </svg>
  ),
  mailOpen: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" /><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
    </svg>
  ),
};

// ─── Random username generator ───────────────────────────
function generateRandomUsername(): string {
  const firstNames = [
    'james', 'emma', 'oliver', 'sophia', 'william', 'ava', 'lucas', 'mia',
    'henry', 'charlotte', 'alex', 'luna', 'daniel', 'chloe', 'jack', 'lily',
    'noah', 'grace', 'ethan', 'zoe', 'liam', 'hannah', 'mason', 'alice',
    'logan', 'ruby', 'ryan', 'ivy', 'nathan', 'ella', 'kevin', 'sarah',
    'david', 'anna', 'michael', 'clara', 'thomas', 'stella', 'andrew', 'nora',
  ];
  const lastWords = [
    'river', 'stone', 'frost', 'bloom', 'storm', 'winter', 'dawn', 'lake',
    'woods', 'hill', 'brook', 'field', 'cloud', 'vale', 'ridge', 'moon',
    'north', 'west', 'snow', 'oak', 'silver', 'fox', 'wolf', 'hawk',
    'knight', 'sage', 'phoenix', 'ember', 'aurora', 'haven', 'crest', 'peak',
    'atlas', 'blaze', 'cedar', 'delta', 'echo', 'flint', 'grove', 'harbor',
  ];
  const separators = ['.', '_', ''];

  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastWords[Math.floor(Math.random() * lastWords.length)];
  const sep = separators[Math.floor(Math.random() * separators.length)];
  const num = Math.floor(Math.random() * 100);
  
  // Varied patterns
  const patterns = [
    `${first}${sep}${last}${num}`,       // emma.river42
    `${first}${sep}${last}`,              // james_storm
    `${last}${sep}${first}${num}`,        // frost.lucas7
    `${first}${num}${sep}${last}`,        // noah55.dawn
    `${first}${sep}${last}${sep}${num}`,  // alex.moon.3
  ];
  
  return patterns[Math.floor(Math.random() * patterns.length)];
}

// ─── Main Page ───────────────────────────────────────────
export default function Home() {
  // State
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [username, setUsername] = useState('');
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [emailContent, setEmailContent] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverTime, setServerTime] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');
  const [countdown, setCountdown] = useState(5);
  const [codeCopied, setCodeCopied] = useState(false);

  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);

  const scrollToInbox = () => {
    setTimeout(() => {
      inboxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Fetch domains ───────────────────────────────────
  useEffect(() => {
    async function fetchDomains() {
      try {
        const res = await fetch('/api/domains');
        const data = await res.json();
        if (data.status === 'success' && data.data) {
          setDomains(data.data);
          if (data.data.length > 0) {
            setSelectedDomain(data.data[0].domain_name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch domains:', err);
      }
    }
    fetchDomains();
  }, []);

  // ─── Fetch emails ────────────────────────────────────
  const fetchEmails = useCallback(async (isUpdate = false) => {
    if (!username || !selectedDomain) return;

    if (!isUpdate) setLoading(true);
    setRefreshing(true);

    try {
      const body: Record<string, string> = { username, domain: selectedDomain };
      if (isUpdate && serverTime) {
        body.update = serverTime;
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.result) {
        if (isUpdate && serverTime) {
          // Merge new emails
          setEmails(prev => {
            const existingIds = new Set(prev.map(e => e.id));
            const newEmails = data.result.filter((e: EmailItem) => !existingIds.has(e.id));
            return [...newEmails, ...prev];
          });
        } else {
          setEmails(data.result);
        }
      }
      if (data.server_time) {
        setServerTime(data.server_time);
      }
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [username, selectedDomain, serverTime]);

  // ─── Auto refresh ────────────────────────────────────
  useEffect(() => {
    if (isActive && autoRefresh) {
      refreshTimerRef.current = setInterval(() => {
        fetchEmails(true);
      }, 5000);
    }
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [isActive, autoRefresh, fetchEmails]);

  // ─── Countdown timer ─────────────────────────
  useEffect(() => {
    if (!isActive || !autoRefresh) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, autoRefresh]);

  // ─── Start checking email ────────────────────────────
  const handleCheckEmail = async () => {
    if (!username.trim() || !selectedDomain) return;
    setIsActive(true);
    setSelectedEmail(null);
    setEmailContent('');
    setServerTime('');
    setMobileTab('list');
    setCountdown(5);
    await fetchEmails(false);
    scrollToInbox();
  };

  // ─── Extract OTP code from subject or body ─────────
  const extractOtpCode = (subject: string, body: string): string | null => {
    const subjectMatch = subject.match(/(\d{4,8})/);
    if (subjectMatch) return subjectMatch[1];
    const bodyText = body.replace(/<[^>]*>/g, ' ');
    const otpPattern = /(?:code|mã|otp|verify|xác|pin|verification|confirm)[^\d]{0,30}(\d{4,8})/i;
    const bodyMatch = bodyText.match(otpPattern);
    if (bodyMatch) return bodyMatch[1];
    const reversePattern = /(\d{4,8})[^\d]{0,30}(?:code|mã|otp|verify|xác|pin|verification|confirm)/i;
    const reverseMatch = bodyText.match(reversePattern);
    if (reverseMatch) return reverseMatch[1];
    return null;
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch (err) {
      console.error('Copy code failed:', err);
    }
  };

  const enhanceEmailContent = (html: string): string => {
    const baseStyles = `<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}</style>`;
    if (html.includes('</head>')) {
      return html.replace('</head>', baseStyles + '</head>');
    }
    return baseStyles + html;
  };

  const handleViewEmail = async (email: EmailItem) => {
    setSelectedEmail(email);
    setMobileTab('detail');
    setLoadingDetail(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: email.id,
          username,
          domain: selectedDomain,
        }),
      });
      const data = await res.json();
      const rawHtml = data.html || data.result || '';
      const textOnly = rawHtml.replace(/<[^>]*>/g, '').trim();
      setEmailContent(textOnly.length > 0 ? enhanceEmailContent(rawHtml) : '');
    } catch (err) {
      console.error('Failed to fetch email detail:', err);
      setEmailContent('<p>Failed to load email content.</p>');
    } finally {
      setLoadingDetail(false);
    }
  };

  // ─── Copy email address ─────────────────────────────
  const handleCopy = async () => {
    const emailAddr = `${username}@${selectedDomain}`;
    try {
      await navigator.clipboard.writeText(emailAddr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // ─── Generate new random email ──────────────────────
  const handleNewEmail = () => {
    setUsername(generateRandomUsername());
    setEmails([]);
    setSelectedEmail(null);
    setEmailContent('');
    setServerTime('');
    setIsActive(false);
    scrollToTop();
  };

  // ─── Randomize username only (keep current state) ───
  const [isRandomizing, setIsRandomizing] = useState(false);
  const handleRandomize = () => {
    setIsRandomizing(true);
    setUsername(generateRandomUsername());
    // If already active, reset inbox for new email
    if (isActive) {
      setEmails([]);
      setSelectedEmail(null);
      setEmailContent('');
      setServerTime('');
    }
    setTimeout(() => setIsRandomizing(false), 600);
  };

  // ─── Format date ────────────────────────────────────
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;

      // Force UTC+7 (Asia/Bangkok, Ho_Chi_Minh)
      const utc7Offset = 7 * 60 * 60 * 1000;
      const nowUTC7 = new Date(Date.now() + utc7Offset + new Date().getTimezoneOffset() * 60000);
      const dateUTC7 = new Date(d.getTime() + utc7Offset + new Date().getTimezoneOffset() * 60000);

      const diff = nowUTC7.getTime() - dateUTC7.getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (mins < 0) return 'Vừa xong';
      if (mins < 1) return 'Vừa xong';
      if (mins < 60) return `${mins} phút trước`;
      if (hours < 24) return `${hours} giờ trước`;
      if (days < 7) return `${days} ngày trước`;

      return d.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // ─── Render ──────────────────────────────────────────
  return (
    <>
      {/* ── Top Nav ── */}
      <nav className="top-nav">
        <a href="/" className="nav-brand" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
          <img src="/doraemail.JPG" alt="Dora-Email" className="nav-logo" />
          <span>Dora<span className="nav-brand-text">-Email</span></span>
        </a>
        <div style={{ flex: 1 }} />
      </nav>

      {/* ── Hero Section ── */}
      <>
          <section className="hero-section">
            <img src="/doraemail.JPG" alt="Dora-Email" className="hero-logo" />
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Email Tạm Thời - Nhanh Chóng &amp; Bảo Mật
            </div>
            <h1 className="hero-title">
              <span className="hero-title-accent">Dora</span>-Email
            </h1>
            <p className="hero-subtitle">
              Tạo email tạm thời tức thì. Không cần đăng ký, không mật khẩu.
              Nhận email theo thời gian thực và bảo vệ hộp thư của bạn.
            </p>

            {/* Email Generator Row */}
            <div className="generator-row">
              <div className="email-generator">
                <input
                  className="email-input"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    if (val.includes('@')) {
                      const [user, domain] = val.split('@');
                      setUsername(user.replace(/[^a-z0-9._-]/g, ''));
                      if (domain) {
                        const match = domains.find(d => d.domain_name === domain);
                        if (match) setSelectedDomain(match.domain_name);
                      }
                    } else {
                      setUsername(val.replace(/[^a-z0-9._-]/g, ''));
                    }
                  }}
                  placeholder="Enter username"
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckEmail()}
                />
                <span className="email-at">@</span>
                <select
                  className="domain-select"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  {domains.map((d) => (
                    <option key={d.domain_name} value={d.domain_name}>
                      {d.domain_name}
                    </option>
                  ))}
                </select>
                <button className="check-btn" onClick={handleCheckEmail} disabled={!username.trim()}>
                  {Icons.mail}
                  Check Inbox
                </button>
              </div>
              <button
                className={`random-outside-btn ${isRandomizing ? 'spin' : ''}`}
                onClick={handleRandomize}
                title="Random email"
                type="button"
              >
                {Icons.dice}
              </button>
            </div>

            {/* Feature Tags */}
            <div className="feature-tags">
              <span className="feature-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                Anonymous
              </span>
              <span className="feature-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                Instant Delivery
              </span>
              <span className="feature-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Auto Refresh 5s
              </span>
              <span className="feature-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                No Registration
              </span>
            </div>
          </section>

      {/* ── Active Email Display Bar ── */}
      {isActive && (
        <div className="email-live-bar">
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
          <span className="live-email-text" onClick={handleCopy} title="Click to copy">{username}@{selectedDomain}</span>
          <div className="live-actions">
            <button className={`live-btn primary ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? Icons.check : Icons.copy}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className={`live-btn ${isRandomizing ? 'spin' : ''}`} onClick={handleRandomize}>
              {Icons.dice}
              Random
            </button>
            <div className="live-timer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {countdown}s
            </div>
          </div>
        </div>
      )}

      {/* ── Inbox Section ── */}
      {isActive && (
        <div ref={inboxRef} id="inbox" className="inbox-section-wrapper">
          {/* Auto-refresh indicator */}
          {autoRefresh ? (
            <div className="auto-refresh-bar">
              <span className="auto-refresh-dot" />
              Auto-refreshing every 5 seconds
              <button
                onClick={() => setAutoRefresh(false)}
                className="auto-refresh-toggle"
              >
                Pause
              </button>
            </div>
          ) : (
            <div className="auto-refresh-bar paused">
              Auto-refresh paused
              <button
                onClick={() => setAutoRefresh(true)}
                className="auto-refresh-toggle paused"
              >
                Resume
              </button>
            </div>
          )}

          {/* Mobile email address bar */}
          <div className="mobile-email-bar">
            <span className="mobile-email-addr" onClick={handleCopy} title="Click to copy">{username}@{selectedDomain}</span>
            <div className="mobile-email-actions">
              <button className={`mobile-action-btn ${isRandomizing ? 'spin' : ''}`} onClick={handleRandomize} title="Random">
                {Icons.dice}
              </button>
              <button className={`mobile-action-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} title="Copy">
                {copied ? Icons.check : Icons.copy}
              </button>
            </div>
          </div>

          {/* Main content: inbox list + email detail */}
          <div className="main-content">
            {/* Inbox Panel */}
            <div className={`inbox-panel ${mobileTab === 'list' ? 'mobile-show' : 'mobile-hide'}`}>
              <div className="inbox-header">
                <div className="inbox-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                  Inbox
                  {emails.length > 0 && (
                    <span className="inbox-count">{emails.length}</span>
                  )}
                </div>
                <button
                  className={`inbox-refresh ${refreshing ? 'spinning' : ''}`}
                  onClick={() => fetchEmails(false)}
                  title="Refresh inbox"
                >
                  {Icons.refresh}
                </button>
              </div>

              <div className="inbox-list">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="email-item" style={{ cursor: 'default' }}>
                      <div className="email-avatar skeleton" />
                      <div className="email-item-content">
                        <div className="email-item-header">
                          <div className="skeleton skeleton-line" style={{ width: '60%', height: 14 }} />
                          <div className="skeleton skeleton-line" style={{ width: '20%', height: 12 }} />
                        </div>
                        <div className="skeleton skeleton-line short" style={{ marginTop: 6 }} />
                        <div className="skeleton skeleton-line" style={{ width: '80%', height: 11, marginTop: 4 }} />
                      </div>
                    </div>
                  ))
                ) : emails.length === 0 ? (
                  <div className="inbox-empty">
                    <div className="inbox-empty-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                      </svg>
                    </div>
                    <div className="inbox-empty-title">Chưa có email</div>
                    <div className="inbox-empty-desc">
                      Email gửi đến <strong style={{ color: 'var(--primary)' }}>{username}@{selectedDomain}</strong> sẽ hiển thị tại đây.
                    </div>
                  </div>
                ) : (
                  emails.map((email) => (
                    <div
                      key={email.id}
                      className={`email-item ${selectedEmail?.id === email.id ? 'active' : ''}`}
                      onClick={() => handleViewEmail(email)}
                    >
                      <div className="email-avatar">
                        {email.from.charAt(0).toUpperCase()}
                      </div>
                      <div className="email-item-content">
                        <div className="email-item-header">
                          <span className="email-from">{email.from}</span>
                          <span className="email-date">{formatDate(email.date)}</span>
                        </div>
                        <span className="email-subject">{email.subject}</span>
                        <span className="email-preview">Click to view email content</span>
                      </div>
                      {selectedEmail?.id !== email.id && <span className="email-unread-dot" />}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Email Detail Panel */}
            <div className={`detail-panel ${mobileTab === 'detail' ? 'mobile-show' : 'mobile-hide'}`}>
              {!selectedEmail ? (
                <div className="detail-placeholder">
                  <div className="detail-placeholder-visual">
                    <img src="/doraemail.JPG" alt="Dora-Email" className="detail-placeholder-logo" />
                    <div className="detail-placeholder-glow" />
                  </div>
                  <div className="detail-placeholder-title">Chọn email để đọc</div>
                  <div className="detail-placeholder-desc">
                    Click vào email bên trái để xem nội dung tại đây
                  </div>
                  <div className="detail-placeholder-tips">
                    <div className="detail-tip">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                      Nội dung email được hiển thị an toàn
                    </div>
                    <div className="detail-tip">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      Tự động cập nhật mỗi 5 giây
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="detail-header">
                    <div className="detail-header-top">
                      <button className="detail-back-btn" onClick={() => { setMobileTab('list'); setSelectedEmail(null); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                        </svg>
                        Quay lại
                      </button>
                    </div>
                    <h2 className="detail-subject">{selectedEmail.subject}</h2>
                    <div className="detail-sender-row">
                      <div className="detail-sender-avatar">
                        {selectedEmail.from.charAt(0).toUpperCase()}
                      </div>
                      <div className="detail-sender-info">
                        <span className="detail-sender-name">{selectedEmail.from}</span>
                        <span className="detail-sender-to">
                          To: <strong>{username}@{selectedDomain}</strong>
                        </span>
                      </div>
                      <span className="detail-date-badge">{formatDate(selectedEmail.date)}</span>
                    </div>
                  </div>
                  {/* OTP Code Display */}
                  {(() => {
                    const otpCode = extractOtpCode(selectedEmail.subject, emailContent);
                    if (!otpCode) return null;
                    return (
                      <div
                        className={`otp-code-box ${codeCopied ? 'copied' : ''}`}
                        onClick={() => handleCopyCode(otpCode)}
                        title={`Click to copy: ${otpCode}`}
                      >
                        <div className="otp-label">Mã xác nhận</div>
                        <div className="otp-digits">{otpCode}</div>
                        <div className="otp-hint">
                          {codeCopied ? (
                            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Đã copy!</>
                          ) : (
                            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg> Click để copy</>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  <div className="detail-body">
                    {loadingDetail ? (
                      <div className="detail-loading">
                        <div className="detail-loading-spinner">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                        </div>
                        <span>Đang tải nội dung email...</span>
                      </div>
                    ) : emailContent && emailContent.replace(/<[^>]*>/g, '').trim().length > 0 ? (
                      <div className="detail-iframe-wrapper">
                        <iframe
                          ref={iframeRef}
                          srcDoc={emailContent}
                          sandbox="allow-same-origin"
                          title="Email content"
                          className="detail-iframe"
                        />
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile bottom nav */}
          <div className="mobile-bottom-nav">
            <button className="mobile-bottom-btn" onClick={() => scrollToTop()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>Home</span>
            </button>
            <button className="mobile-bottom-btn" onClick={() => { scrollToInbox(); setMobileTab('list'); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              <span>Inbox</span>
              {emails.length > 0 && <span className="mobile-badge">{emails.length}</span>}
            </button>
            <button className={`mobile-bottom-btn ${isRandomizing ? 'spin' : ''}`} onClick={handleRandomize}>
              {Icons.dice}
              <span>Random</span>
            </button>
            <button className={`mobile-bottom-btn ${copied ? 'active' : ''}`} onClick={handleCopy}>
              {copied ? Icons.check : Icons.copy}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

          {/* Features */}
          <section className="features-section">
            <h2 className="features-title">
              Why Choose <span style={{ color: 'var(--primary)' }}>TempMail</span>?
            </h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--primary)' }}>{Icons.shield}</div>
                <h3 className="feature-name">Privacy Protection</h3>
                <p className="feature-desc">
                  Keep your real email address private. Use temporary addresses for sign-ups, trials, and unknown websites.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--trading-up)' }}>{Icons.zap}</div>
                <h3 className="feature-name">Instant Setup</h3>
                <p className="feature-desc">
                  No registration required. Generate a disposable email address instantly and start receiving emails right away.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--info)' }}>{Icons.clock}</div>
                <h3 className="feature-name">Real-time Updates</h3>
                <p className="feature-desc">
                  Emails are delivered in real-time with automatic refresh every 5 seconds. Never miss a verification code.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--trading-down)' }}>{Icons.trash}</div>
                <h3 className="feature-name">Anti-Spam</h3>
                <p className="feature-desc">
                  Stop spam from reaching your primary inbox. Use a temporary address and forget about it when done.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--accent-turquoise)' }}>{Icons.globe}</div>
                <h3 className="feature-name">Multiple Domains</h3>
                <p className="feature-desc">
                  Choose from multiple domain options. Some services block specific domains — we give you alternatives.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--primary)' }}>{Icons.lock}</div>
                <h3 className="feature-name">No Data Storage</h3>
                <p className="feature-desc">
                  We don&apos;t store your data permanently. Emails are temporary and automatically cleaned up.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <img src="/doraemail.JPG" alt="Dora-Email" className="footer-logo" />
                Dora<span className="footer-brand-accent">-Email</span>
              </div>
              <p className="footer-text">
                Free disposable temporary email service. Protect your privacy online.
              </p>
              <div className="footer-links">
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">API Documentation</a>
                <a href="#" className="footer-link">Contact</a>
              </div>
            </div>
          </footer>
      </>
    </>
  );
}
