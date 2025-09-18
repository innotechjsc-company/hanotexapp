import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Owner } from "../types";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";

interface TechnologyOwnersSectionProps {
  owners: Owner[];
  onAddOwner: () => void;
  onRemoveOwner: (index: number) => void;
  onUpdateOwner: (index: number, field: string, value: string) => void;
}

export const TechnologyOwnersSection: React.FC<TechnologyOwnersSectionProps> = ({
  owners,
  onAddOwner,
  onRemoveOwner,
  onUpdateOwner,
}) => {
  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold text-gray-900">
            3. Chủ sở hữu công nghệ *
          </h2>
          <Button
            variant="flat"
            color="primary"
            size="sm"
            startContent={<Plus className="h-4 w-4" />}
            onClick={onAddOwner}
          >
            Thêm chủ sở hữu
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-6 space-y-4">
        {owners.map((owner, index) => (
          <Card key={index} className="border border-gray-200">
            <CardBody className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  label="Loại chủ sở hữu"
                  selectedKeys={[owner.ownerType]}
                  onChange={(e) =>
                    onUpdateOwner(index, "ownerType", e.target.value)
                  }
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-gray-700 mb-1",
                  }}
                >
                  <SelectItem key="INDIVIDUAL">
                    Cá nhân
                  </SelectItem>
                  <SelectItem key="COMPANY">
                    Doanh nghiệp
                  </SelectItem>
                  <SelectItem key="RESEARCH_INSTITUTION">
                    Viện/Trường
                  </SelectItem>
                </Select>
                <Input
                  label="Tên chủ sở hữu"
                  placeholder="Nhập tên chủ sở hữu"
                  value={owner.ownerName}
                  onChange={(e) =>
                    onUpdateOwner(index, "ownerName", e.target.value)
                  }
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-gray-700 mb-1",
                    input: "text-sm",
                  }}
                />
                <Input
                  label="Tỷ lệ sở hữu (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={owner.ownershipPercentage.toString()}
                  onChange={(e) =>
                    onUpdateOwner(
                      index,
                      "ownershipPercentage",
                      e.target.value
                    )
                  }
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-gray-700 mb-1",
                    input: "text-sm",
                  }}
                />
                <div className="flex items-end">
                  <Button
                    color="danger"
                    variant="flat"
                    className="w-full"
                    startContent={<Trash2 className="h-4 w-4" />}
                    onClick={() => onRemoveOwner(index)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </CardBody>
    </Card>
  );
};
