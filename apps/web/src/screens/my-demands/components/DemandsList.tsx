"use client";

import { Typography, Spin, Card } from "antd";
import { Demand } from "@/types/demand";
import DemandCard from "./DemandCard";

interface DemandsListProps {
  loading: boolean;
  demands: Demand[];
  deletingIds: Set<string>;
  onView: (d: Demand) => void;
  onViewProposals: (d: Demand) => void;
  onEdit: (d: Demand) => void;
  onDelete: (d: Demand) => void;
}

export default function DemandsList({
  loading,
  demands,
  deletingIds,
  onView,
  onViewProposals,
  onEdit,
  onDelete,
}: DemandsListProps) {
  return (
    <div
      style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: "0 16px 24px",
        marginTop: 16,
      }}
    >
      <Card title={<Typography.Text strong>Danh sách nhu cầu</Typography.Text>}>
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 48 }}
          >
            <Spin size="large" />
          </div>
        ) : demands.length > 0 ? (
          <div className="space-y-4">
            {demands.map((demand) => (
              <DemandCard
                key={(demand.id as string) || (demand as any)._id}
                demand={demand}
                deletingIds={deletingIds}
                onView={onView}
                onViewProposals={onViewProposals}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Chưa có nhu cầu nào</p>
          </div>
        )}
      </Card>
    </div>
  );
}
