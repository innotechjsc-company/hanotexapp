import { NextRequest, NextResponse } from "next/server";
import { mockDemands } from "../route";

// Use shared mock data

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const demand = mockDemands.find((d) => d.id === id);

    if (!demand) {
      return NextResponse.json(
        { success: false, error: "Demand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: demand,
    });
  } catch (error) {
    console.error("Error fetching demand:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch demand" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const demandIndex = mockDemands.findIndex((d) => d.id === id);

    if (demandIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Demand not found" },
        { status: 404 }
      );
    }

    // Update demand
    mockDemands[demandIndex] = {
      ...mockDemands[demandIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockDemands[demandIndex],
      message: "Demand updated successfully",
    });
  } catch (error) {
    console.error("Error updating demand:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update demand" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const demandIndex = mockDemands.findIndex((d) => d.id === id);

    if (demandIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Demand not found" },
        { status: 404 }
      );
    }

    // Remove demand
    mockDemands.splice(demandIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Demand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting demand:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete demand" },
      { status: 500 }
    );
  }
}
