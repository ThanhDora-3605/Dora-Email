import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Bypass TLS verification for azpopmail.com (self-signed cert)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  try {
    const res = await fetch('https://azpopmail.com/api/domain_list', {
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
