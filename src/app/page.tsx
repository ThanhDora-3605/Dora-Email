/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
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
  const autoRefresh = true;
  const [refreshing, setRefreshing] = useState(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');
  const [countdown, setCountdown] = useState(5);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

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

  // ─── Verification types ─────────────────────────────
  type VerificationType = 'otp' | 'text' | 'link' | 'magic' | 'pin' | 'token';
  interface VerificationItem {
    id: string;
    type: VerificationType;
    value: string;
    label: string;
  }

  // ─── Extract ALL verification data from email ───────
  const extractVerifications = (subject: string, body: string): VerificationItem[] => {
    const results: VerificationItem[] = [];
    const seen = new Set<string>();
    const bodyText = body.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

    const addResult = (type: VerificationType, value: string, label: string) => {
      const key = `${type}:${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ id: key, type, value, label });
      }
    };

    // 1. OTP / Numeric codes (4-8 digits)
    const otpKeywords = /(?:code|mã|otp|verify|xác\s*(?:nhận|minh)|pin|verification|confirm|security|bảo mật|xác thực|mật khẩu)/i;

    // Check subject for OTP
    const subjectOtpMatch = subject.match(/(\d{4,8})/);
    if (subjectOtpMatch && otpKeywords.test(subject)) {
      addResult('otp', subjectOtpMatch[1], 'Mã OTP');
    }

    // Check body for OTP with context
    const otpPatterns = [
      /(?:code|mã|otp|verify|xác|pin|verification|confirm|security|passcode|mật khẩu)[^\d]{0,40}(\d{4,8})/gi,
      /(\d{4,8})[^\d]{0,40}(?:code|mã|otp|verify|xác|pin|verification|confirm|security|passcode)/gi,
      /(?:is|là|:)\s*(\d{4,8})(?:\s|\.|,|$)/gi,
      /(?:enter|nhập|use|sử dụng)[^\d]{0,30}(\d{4,8})/gi,
    ];
    for (const pattern of otpPatterns) {
      let m;
      while ((m = pattern.exec(bodyText)) !== null) {
        addResult('otp', m[1], 'Mã OTP');
      }
    }

    // Fallback: if subject has 4-8 digit number and no other OTP found
    if (subjectOtpMatch && results.filter(r => r.type === 'otp').length === 0) {
      addResult('otp', subjectOtpMatch[1], 'Mã xác nhận');
    }

    // 2. PIN codes (exactly 4-6 digits, in PIN context)
    const pinPatterns = [
      /(?:pin|PIN)[^\d]{0,20}(\d{4,6})/g,
      /(\d{4,6})[^\d]{0,20}(?:pin|PIN)/g,
    ];
    for (const pattern of pinPatterns) {
      let m;
      while ((m = pattern.exec(bodyText)) !== null) {
        addResult('pin', m[1], 'Mã PIN');
      }
    }

    // 3. Text-based verification codes (alphanumeric mix like "A3B7C9", "XYZ-123")
    const textCodePatterns = [
      /(?:code|mã|verification|xác nhận|confirm)[^a-zA-Z0-9]{0,20}([A-Z0-9][A-Z0-9\-]{3,12}[A-Z0-9])/gi,
      /([A-Z0-9][A-Z0-9\-]{3,12}[A-Z0-9])[^a-zA-Z0-9]{0,20}(?:code|mã|verification|xác nhận|confirm)/gi,
      /(?:code|mã|verification)[^a-zA-Z0-9]{0,10}([A-Z]{2,}[\-]?\d{2,})/gi,
      /(?:code|mã|verification)[^a-zA-Z0-9]{0,10}(\d{2,}[\-]?[A-Z]{2,})/gi,
    ];
    for (const pattern of textCodePatterns) {
      let m;
      while ((m = pattern.exec(bodyText)) !== null) {
        const val = m[1].trim();
        if (/[A-Za-z]/.test(val) && /\d/.test(val) && val.length >= 4) {
          addResult('text', val.toUpperCase(), 'Mã xác nhận');
        }
      }
    }

    // 4. Verification links
    const linkPatterns = [
      /href=["'](https?:\/\/[^"']*(?:verify|confirm|activate|validate|auth|token|click|action|unsubscribe|email[_-]?confirm|registration|signup|reset|approve)[^"']*)["']/gi,
      /(https?:\/\/[^\s<>"']*(?:verify|confirm|activate|validate|auth|token|email[_-]?confirm|registration|signup|reset|approve)[^\s<>"']*)/gi,
    ];
    for (const pattern of linkPatterns) {
      let m;
      while ((m = pattern.exec(body)) !== null) {
        const url = m[1].trim();
        if (url.length > 30 && !url.includes('unsubscribe')) {
          // Determine if it's a magic link or verification link
          if (/(?:magic|login|signin|sign[_-]in|auto[_-]?login|one[_-]?click)/i.test(url)) {
            addResult('magic', url, 'Magic Link');
          } else {
            addResult('link', url, 'Link xác nhận');
          }
        }
      }
    }

    // 5. Magic links (login links)
    const magicPatterns = [
      /href=["'](https?:\/\/[^"']*(?:magic|login|signin|sign[_-]in|sso|one[_-]?click|auto[_-]?login)[^"']*)["']/gi,
      /(https?:\/\/[^\s<>"']*(?:magic|login|signin|sign[_-]in|sso|one[_-]?click|auto[_-]?login)[^\s<>"']*)/gi,
    ];
    for (const pattern of magicPatterns) {
      let m;
      while ((m = pattern.exec(body)) !== null) {
        addResult('magic', m[1].trim(), 'Magic Link');
      }
    }

    // 6. Token / long codes (JWT-like, UUID-like, hex tokens)
    const tokenPatterns = [
      /(?:token|key|secret)[^a-zA-Z0-9]{0,15}([a-zA-Z0-9\-_]{20,})/gi,
      /(?:token|key|secret)[^a-zA-Z0-9]{0,15}([0-9a-f]{32,})/gi,
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi, // UUID
    ];
    for (const pattern of tokenPatterns) {
      let m;
      while ((m = pattern.exec(bodyText)) !== null) {
        addResult('token', m[1].trim(), 'Token xác thực');
      }
    }

    // Also try to find button-style verification links from HTML
    const buttonLinkPattern = /<a[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([^<]*(?:verify|confirm|xác nhận|xác minh|activate|kích hoạt|click here|bấm vào|nhấn vào|đăng nhập)[^<]*)<\/a>/gi;
    let bm;
    while ((bm = buttonLinkPattern.exec(body)) !== null) {
      const url = bm[1].trim();
      if (url.length > 20) {
        if (/(?:magic|login|signin|sign[_-]in)/i.test(url) || /(?:đăng nhập|login|sign\s*in)/i.test(bm[2])) {
          addResult('magic', url, 'Magic Link');
        } else {
          addResult('link', url, 'Link xác nhận');
        }
      }
    }

    return results;
  };

  const handleCopyItem = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItemId(id);
      setTimeout(() => setCopiedItemId(null), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const enhanceEmailContent = (html: string): string => {
    const metaCharset = `<meta charset="utf-8">`;
    const metaViewport = `<meta name="viewport" content="width=device-width, initial-scale=1">`;
    const baseTarget = `<base target="_blank">`;
    const baseStyles = `<style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 8px; word-wrap: break-word; }
      img { max-width: 100% !important; height: auto !important; }
      table { max-width: 100% !important; }
      a { color: #3b82f6; }
      pre, code { white-space: pre-wrap; word-wrap: break-word; }
    </style>`;

    const headContent = metaCharset + metaViewport + baseTarget + baseStyles;

    if (html.includes('</head>')) {
      return html.replace('</head>', headContent + '</head>');
    }
    if (html.includes('<body')) {
      return html.replace('<body', '<head>' + headContent + '</head><body');
    }
    if (html.includes('<html')) {
      return html.replace(/<html[^>]*>/, (match) => match + '<head>' + headContent + '</head>');
    }
    // No HTML structure at all - wrap it
    return `<!DOCTYPE html><html><head>${headContent}</head><body>${html}</body></html>`;
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
      // Handle both: data as string directly, or data.html / data.result as object properties
      const rawHtml = typeof data === 'string'
        ? data
        : (data.html || data.result || '');
      const hasContent = rawHtml.trim().length > 0;
      setEmailContent(hasContent ? enhanceEmailContent(rawHtml) : '');
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


  // ─── Render ──────────────────────────────────────────
  return (
    <>
      {/* ── Top Nav ── */}
      <nav className="top-nav">
        <Link href="/" className="nav-brand" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
          <div className="nav-logo" title="Dora-Email" />
          <span>Dora<span className="nav-brand-text">-Email</span></span>
        </Link>
        <div style={{ flex: 1 }} />
      </nav>

      {/* ── Hero Section ── */}
      <>
          <section className="hero-section">
            <div className="hero-logo" title="Dora-Email" />
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
                  placeholder="Nhập tên email..."
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
                    <div className="detail-placeholder-logo" title="Dora-Email" />
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
                  {/* ── Verification Items Display ── */}
                  {(() => {
                    const verifications = extractVerifications(selectedEmail.subject, emailContent);
                    if (verifications.length === 0) return null;

                    const renderCopyHint = (id: string) => (
                      <div className="vb-copy-hint">
                        {copiedItemId === id ? (
                          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Đã copy!</>
                        ) : (
                          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg> Click để copy</>
                        )}
                      </div>
                    );

                    const typeIcons: Record<string, React.ReactNode> = {
                      otp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
                      text: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>,
                      link: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
                      magic: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 4-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2Z" /><path d="m5 8-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2Z" /><path d="M21.64 3.64a2 2 0 0 0-2.83 0L2.36 20.09a2 2 0 1 0 2.83 2.83L21.64 6.47a2 2 0 0 0 0-2.83Z" /></svg>,
                      pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" /><circle cx="12" cy="16" r="1" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
                      token: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>,
                    };

                    const typeLabels: Record<string, string> = {
                      otp: 'OTP', text: 'TEXT', link: 'LINK', magic: 'MAGIC', pin: 'PIN', token: 'TOKEN',
                    };

                    return (
                      <>
                        {/* Summary strip */}
                        {verifications.length > 1 && (
                          <div className="verification-summary">
                            {verifications.map(v => (
                              <span key={v.id} className={`verification-summary-item vs-${v.type}`}>
                                {typeIcons[v.type]}
                                {typeLabels[v.type]}
                              </span>
                            ))}
                          </div>
                        )}

                        {verifications.map(v => {
                          switch (v.type) {
                            case 'otp':
                              return (
                                <div
                                  key={v.id}
                                  className={`verification-box vb-otp ${copiedItemId === v.id ? 'copied' : ''}`}
                                  onClick={() => handleCopyItem(v.id, v.value)}
                                  title={`Click to copy: ${v.value}`}
                                >
                                  <div className="verification-box-label">
                                    {typeIcons.otp}
                                    {v.label}
                                    <span className="vb-tag">{typeLabels.otp}</span>
                                  </div>
                                  <div className="vb-otp-digits">{v.value}</div>
                                  {renderCopyHint(v.id)}
                                </div>
                              );

                            case 'pin':
                              return (
                                <div
                                  key={v.id}
                                  className={`verification-box vb-pin ${copiedItemId === v.id ? 'copied' : ''}`}
                                  onClick={() => handleCopyItem(v.id, v.value)}
                                  title={`Click to copy: ${v.value}`}
                                >
                                  <div className="verification-box-label">
                                    {typeIcons.pin}
                                    {v.label}
                                    <span className="vb-tag">{typeLabels.pin}</span>
                                  </div>
                                  <div className="vb-pin-digits">
                                    {v.value.split('').map((digit, i) => (
                                      <span key={i} className="vb-pin-digit">{digit}</span>
                                    ))}
                                  </div>
                                  {renderCopyHint(v.id)}
                                </div>
                              );

                            case 'text':
                              return (
                                <div
                                  key={v.id}
                                  className={`verification-box vb-text ${copiedItemId === v.id ? 'copied' : ''}`}
                                  onClick={() => handleCopyItem(v.id, v.value)}
                                  title={`Click to copy: ${v.value}`}
                                >
                                  <div className="verification-box-label">
                                    {typeIcons.text}
                                    {v.label}
                                    <span className="vb-tag">{typeLabels.text}</span>
                                  </div>
                                  <div className="vb-text-code">{v.value}</div>
                                  {renderCopyHint(v.id)}
                                </div>
                              );

                            case 'token':
                              return (
                                <div
                                  key={v.id}
                                  className={`verification-box vb-token ${copiedItemId === v.id ? 'copied' : ''}`}
                                  onClick={() => handleCopyItem(v.id, v.value)}
                                  title={`Click to copy token`}
                                >
                                  <div className="verification-box-label">
                                    {typeIcons.token}
                                    {v.label}
                                    <span className="vb-tag">{typeLabels.token}</span>
                                  </div>
                                  <div className="vb-token-value">{v.value}</div>
                                  {renderCopyHint(v.id)}
                                </div>
                              );

                            case 'link':
                            case 'magic':
                              return (
                                <div key={v.id} className={`verification-box vb-${v.type}`}>
                                  <div className="verification-box-label">
                                    {typeIcons[v.type]}
                                    {v.label}
                                    <span className="vb-tag">{typeLabels[v.type]}</span>
                                  </div>
                                  <div className="vb-link-content">
                                    <div className="vb-link-url">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
                                      <span className="vb-link-url-text">{v.value}</span>
                                    </div>
                                    <div className="vb-link-actions">
                                      <a
                                        href={v.value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="vb-link-btn vb-link-open"
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                        {v.type === 'magic' ? 'Đăng nhập' : 'Xác nhận ngay'}
                                      </a>
                                      <button
                                        className={`vb-link-btn vb-link-copy ${copiedItemId === v.id ? 'copied' : ''}`}
                                        onClick={e => { e.stopPropagation(); handleCopyItem(v.id, v.value); }}
                                      >
                                        {copiedItemId === v.id ? (
                                          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Đã copy!</>
                                        ) : (
                                          <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg> Copy link</>
                                        )}
                                      </button>
                                    </div>
                                    <div className="vb-link-warning">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                                      Link sẽ mở trong tab mới - hãy kiểm tra URL trước khi click
                                    </div>
                                  </div>
                                </div>
                              );

                            default:
                              return null;
                          }
                        })}
                      </>
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
                    ) : emailContent && emailContent.trim().length > 0 ? (
                      <div className="detail-iframe-wrapper">
                        <iframe
                          ref={iframeRef}
                          srcDoc={emailContent}
                          sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
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

      </>
    </>
  );
}

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
