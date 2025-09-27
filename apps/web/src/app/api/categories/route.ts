import { NextResponse } from 'next/server';
import { getPayloadApiBaseUrl } from "@/lib/api-config";

const PAYLOAD_API_URL = getPayloadApiBaseUrl();

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}/categories?limit=100&sort=name`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform PayloadCMS response to match expected format
    const categories = (data.docs || data.data || []).map((category: any) => ({
      id: category.id,
      name: category.name,
      code: category.code_intl || category.code_vn || category.name,
    }));

    return NextResponse.json({
      success: true,
      data: categories,
      docs: categories, // For compatibility with existing code
    });
  } catch (error) {
    console.error('Error fetching categories from CMS:', error);
    
    // Fallback to mock data if CMS is not available
    const fallbackCategories = [
      { id: '1', name: 'Điện – Điện tử – CNTT', code: 'EEICT' },
      { id: '2', name: 'Vật liệu & Công nghệ vật liệu', code: 'MTRL' },
      { id: '3', name: 'Cơ khí – Động lực', code: 'MECH' },
      { id: '4', name: 'Công nghệ sinh học y dược', code: 'BIOTECH' },
      { id: '5', name: 'Năng lượng & Môi trường', code: 'ENERGY' },
      { id: '6', name: 'Nông nghiệp & Thực phẩm', code: 'AGRI' },
      { id: '7', name: 'Xây dựng & Kiến trúc', code: 'CONSTR' },
      { id: '8', name: 'Giao thông vận tải', code: 'TRANSPORT' }
    ];

    return NextResponse.json({
      success: true,
      data: fallbackCategories,
      docs: fallbackCategories,
      fallback: true,
    });
  }
}
