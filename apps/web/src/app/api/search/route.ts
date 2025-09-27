import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Query must be at least 2 characters long'
      }, { status: 400 });
    }

    // Call CMS search API
    const cmsSearchUrl = `http://localhost:4000/api/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`;
    
    console.log('Calling CMS search API:', cmsSearchUrl);
    
    const cmsResponse = await fetch(cmsSearchUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!cmsResponse.ok) {
      console.error('CMS search API error:', cmsResponse.status, cmsResponse.statusText);
      return NextResponse.json({
        success: false,
        error: 'Failed to search in CMS'
      }, { status: 500 });
    }

    const cmsData = await cmsResponse.json();
    
    if (!cmsData.success) {
      return NextResponse.json({
        success: false,
        error: cmsData.error || 'Search failed'
      }, { status: 500 });
    }

    // Return the data from CMS
    return NextResponse.json(cmsData);

  } catch (error) {
    console.error('Web Search API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}