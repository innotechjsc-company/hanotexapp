import { NextResponse } from 'next/server';
import { getPayloadApiUrl } from '@/lib/api-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const page = searchParams.get('page') || '1';
    const sort = searchParams.get('sort') || 'name';

    // Fetch categories from CMS
    const cmsUrl = getPayloadApiUrl(`/categories?limit=${limit}&page=${page}&sort=${sort}`);
    
    const response = await fetch(cmsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CMS API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match the expected format
    const categories = (data.docs || []).map((category: any) => ({
      value: category.id,
      label: category.name,
      id: category.id,
      name: category.name,
      code_intl: category.code_intl,
      code_vn: category.code_vn,
      parent: category.parent,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: categories,
      docs: categories,
      totalDocs: data.totalDocs || categories.length,
      limit: data.limit || parseInt(limit),
      totalPages: data.totalPages || 1,
      page: data.page || parseInt(page),
      pagingCounter: data.pagingCounter || 1,
      hasPrevPage: data.hasPrevPage || false,
      hasNextPage: data.hasNextPage || false,
      prevPage: data.prevPage || null,
      nextPage: data.nextPage || null,
    });
  } catch (error) {
    console.error('Error fetching categories from CMS:', error);
    
    // Fallback to empty data if CMS is unavailable
    return NextResponse.json({
      success: false,
      data: [],
      docs: [],
      error: 'Unable to fetch categories from CMS',
    }, { status: 500 });
  }
}
