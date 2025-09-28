import { NextResponse } from 'next/server';
import { getPayloadApiUrl } from '@/lib/api-config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch category from CMS
    const cmsUrl = getPayloadApiUrl(`/categories/${id}`);
    
    const response = await fetch(cmsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      throw new Error(`CMS API error: ${response.status}`);
    }

    const category = await response.json();
    
    // Transform the data to match the expected format
    const transformedCategory = {
      value: category.id,
      label: category.name,
      id: category.id,
      name: category.name,
      code_intl: category.code_intl,
      code_vn: category.code_vn,
      parent: category.parent,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: transformedCategory,
    });
  } catch (error) {
    console.error('Error fetching category from CMS:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Unable to fetch category from CMS',
    }, { status: 500 });
  }
}