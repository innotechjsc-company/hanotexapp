import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const technology_id = formData.get('technology_id') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'video/mp4',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Mock file upload - in real implementation, save to cloud storage
    const fileId = Date.now().toString();
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type;
    const uploadUrl = `/uploads/${fileId}/${fileName}`; // Mock URL

    // Mock file metadata
    const fileMetadata = {
      id: fileId,
      filename: fileName,
      original_name: fileName,
      size: fileSize,
      type: fileType,
      url: uploadUrl,
      technology_id: technology_id || null,
      uploaded_at: new Date().toISOString(),
      uploaded_by: 'current_user_id' // In real implementation, get from session
    };

    return NextResponse.json({
      success: true,
      data: fileMetadata,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('file_id');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Mock file deletion
    // In real implementation, delete from cloud storage

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
