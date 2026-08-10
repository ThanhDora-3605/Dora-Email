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

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      // Email detail returns HTML string
      const html = await res.text();
      return NextResponse.json({ html });
    }
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
