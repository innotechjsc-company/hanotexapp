import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Mock OCR processing - simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock extracted data based on file name or content
    const fileName = file.name.toLowerCase();
    let extractedData = {};

    if (fileName.includes('images') || fileName.includes('test')) {
      extractedData = {
        title: 'Hệ thống nhận dạng hình ảnh thông minh',
        field: 'SCI_ENG',
        industry: 'EEICT',
        specialty: 'Xử lý hình ảnh',
        trlSuggestion: '6',
        confidence: 0.85
      };
    } else if (fileName.includes('patent') || fileName.includes('bằng')) {
      extractedData = {
        title: 'Công nghệ xử lý dữ liệu phân tán',
        field: 'SCI_ENG',
        industry: 'EEICT',
        specialty: 'Hệ thống phân tán',
        trlSuggestion: '7',
        confidence: 0.92
      };
    } else if (fileName.includes('software') || fileName.includes('phần mềm')) {
      extractedData = {
        title: 'Phần mềm quản lý tài nguyên doanh nghiệp',
        field: 'SCI_ENG',
        industry: 'EEICT',
        specialty: 'Phần mềm hệ thống',
        trlSuggestion: '8',
        confidence: 0.88
      };
    } else {
      // Default extraction
      extractedData = {
        title: 'Công nghệ tiên tiến',
        field: 'SCI_ENG',
        industry: 'MECH',
        specialty: 'Cơ khí chính xác',
        trlSuggestion: '5',
        confidence: 0.75
      };
    }

    return NextResponse.json({
      success: true,
      extractedData,
      processingTime: '2.1s',
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('OCR Processing Error:', error);
    return NextResponse.json(
      { error: 'OCR processing failed' },
      { status: 500 }
    );
  }
}
