import { NextRequest, NextResponse } from "next/server";

// Mock data for development - shared across route files
export let mockDemands: any[] = [
  {
    id: "1",
    title: "Tìm kiếm công nghệ xử lý nước thải",
    description:
      "Cần tìm công nghệ xử lý nước thải hiệu quả cho nhà máy sản xuất",
    category: "550e8400-e29b-41d4-a716-446655440005", // Môi trường
    user: "user-1",
    trl_level: 7,
    option: "Ưu tiên công nghệ có chi phí vận hành thấp",
    option_technology: "Công nghệ sinh học hoặc màng lọc",
    option_rule: "Phải đạt tiêu chuẩn QCVN 40:2011/BTNMT",
    from_price: 500000000,
    to_price: 2000000000,
    cooperation: "Chuyển giao công nghệ",
    documents: [],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Cần công nghệ sản xuất vật liệu composite",
    description:
      "Tìm kiếm công nghệ sản xuất vật liệu composite cho ngành hàng không",
    category: "550e8400-e29b-41d4-a716-446655440003", // Vật liệu mới
    user: "user-2",
    trl_level: 8,
    option: "Vật liệu nhẹ, bền, chịu nhiệt cao",
    option_technology: "Công nghệ ép nhiệt hoặc autoclave",
    option_rule: "Đạt tiêu chuẩn AS9100",
    from_price: 1000000000,
    to_price: 5000000000,
    cooperation: "Hợp tác phát triển",
    documents: [],
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const user = searchParams.get("user");

    let filteredDemands = [...mockDemands];

    // Apply filters
    if (search) {
      filteredDemands = filteredDemands.filter(
        (demand) =>
          demand.title.toLowerCase().includes(search.toLowerCase()) ||
          demand.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredDemands = filteredDemands.filter(
        (demand) => demand.category === category
      );
    }

    if (user) {
      filteredDemands = filteredDemands.filter(
        (demand) => demand.user === user
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDemands = filteredDemands.slice(startIndex, endIndex);

    const totalDocs = filteredDemands.length;
    const totalPages = Math.ceil(totalDocs / limit);

    return NextResponse.json({
      success: true,
      data: paginatedDemands,
      pagination: {
        totalDocs,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error("Error fetching demands:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch demands" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      user,
      trl_level,
      option,
      option_technology,
      option_rule,
      from_price,
      to_price,
      cooperation,
      documents,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !user || !trl_level) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new demand
    const newDemand = {
      id: Date.now().toString(),
      title,
      description,
      category,
      user,
      trl_level,
      option: option || null,
      option_technology: option_technology || null,
      option_rule: option_rule || null,
      from_price: from_price || null,
      to_price: to_price || null,
      cooperation: cooperation || null,
      documents: documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDemands.push(newDemand);

    return NextResponse.json({
      success: true,
      data: newDemand,
      message: "Demand created successfully",
    });
  } catch (error) {
    console.error("Demand creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create demand" },
      { status: 500 }
    );
  }
}
