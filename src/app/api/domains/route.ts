import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Bypass TLS verification if configured
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const baseUrl = process.env.API_BASE_URL;
  const endpoint = process.env.API_DOMAIN_ENDPOINT;

  if (!baseUrl || !endpoint) {
    return NextResponse.json(
      { status: 'error', message: 'API configuration missing' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    // Deduplicate domains
    if (data.data && Array.isArray(data.data)) {
      const seen = new Set<string>();
      data.data = data.data.filter((d: { domain_name: string }) => {
        if (seen.has(d.domain_name)) return false;
        seen.add(d.domain_name);
        return true;
      });
      data.count = data.data.length;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Domain fetch error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}
