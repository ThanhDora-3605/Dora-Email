import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Bypass TLS verification if configured
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const baseUrl = process.env.API_BASE_URL;
  const endpoint = process.env.API_MESSAGES_ENDPOINT;

  if (!baseUrl || !endpoint) {
    return NextResponse.json(
      { error: 'API configuration missing' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { username, domain, id, update, token } = body;

    const params = new URLSearchParams();
    if (username) params.append('username', username);
    if (domain) params.append('domain', domain);
    if (id) params.append('id', id);
    if (update) params.append('update', update);
    if (token) params.append('token', token);

    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    });

    const rawText = await res.text();
    const contentType = res.headers.get('content-type') || '';

    // Try to parse as JSON
    if (contentType.includes('application/json') || rawText.startsWith('{') || rawText.startsWith('[') || rawText.startsWith('"')) {
      try {
        const parsed = JSON.parse(rawText);
        // If the upstream API returned a JSON-encoded string (e.g. "<!DOCTYPE html>..."),
        // wrap it as { html: ... } so the client always gets a consistent shape
        if (typeof parsed === 'string') {
          // Clean up double-escaped HTML from upstream API:
          // - literal backslash before newlines (\\\n → \n)
          // - escaped forward slashes (\/ → /)
          // - remaining double-backslash escapes (\\n, \\t, etc.)
          const cleanHtml = parsed
            .replace(/\\\n/g, '\n')
            .replace(/\\\r/g, '\r')
            .replace(/\\\t/g, '\t')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
          return NextResponse.json({ html: cleanHtml });
        }
        return NextResponse.json(parsed);
      } catch {
        // JSON parse failed, treat the raw text as HTML
        return NextResponse.json({ html: rawText });
      }
    }

    // Non-JSON response: treat as HTML
    return NextResponse.json({ html: rawText });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
