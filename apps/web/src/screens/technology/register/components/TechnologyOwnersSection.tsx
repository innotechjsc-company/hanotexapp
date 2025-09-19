import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { TechnologyOwner, OwnerType } from "@/types";

interface TechnologyOwnersSectionProps {
  initialOwners?: TechnologyOwner[];
  onChange?: (owners: TechnologyOwner[]) => void;
}

export interface TechnologyOwnersSectionRef {
  getOwners: () => TechnologyOwner[];
  validate: () => boolean;
}

export const TechnologyOwnersSection = forwardRef<
  TechnologyOwnersSectionRef,
  TechnologyOwnersSectionProps
>(({ initialOwners = [], onChange }, ref) => {
  const [owners, setOwners] = useState<TechnologyOwner[]>(initialOwners);

  useEffect(() => {
    if (onChange) {
      onChange(owners);
    }
  }, [owners, onChange]);

  useImperativeHandle(ref, () => ({
    getOwners: () => owners,
    validate: () => owners.length > 0 && owners.every(owner => 
      owner.owner_name.trim() !== '' && 
      owner.ownership_percentage > 0 && 
      owner.ownership_percentage <= 100
    )
  }));
  
  const handleAddOwner = () => {
    setOwners(prev => [
      ...prev, 
      { 
        owner_type: 'individual' as OwnerType, 
        owner_name: '', 
        ownership_percentage: 0 
      }
    ]);
  };

  const handleRemoveOwner = (index: number) => {
    setOwners(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateOwner = (index: number, field: string, value: string) => {
    setOwners(prev => {
      const newOwners = [...prev];
      const owner = { ...newOwners[index] };
      
      if (field === "ownerType") {
        owner.owner_type = value as OwnerType;
      } else if (field === "ownerName") {
        owner.owner_name = value;
      } else if (field === "ownershipPercentage") {
        owner.ownership_percentage = parseFloat(value) || 0;
      }
      
      newOwners[index] = owner;
      return newOwners;
    });
  };
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
            onClick={handleAddOwner}
          >
            Thêm chủ sở hữu
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-6 space-y-4">
        {owners.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            Chưa có thông tin chủ sở hữu. Vui lòng thêm chủ sở hữu.
          </div>
        )}
        {owners.map((owner, index) => (
          <Card key={index} className="border border-gray-200">
            <CardBody className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  label="Loại chủ sở hữu"
                  selectedKeys={[owner.owner_type]}
                  onChange={(e) =>
                    handleUpdateOwner(index, "ownerType", e.target.value)
                  }
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-gray-700 mb-1",
                  }}
                >
                  <SelectItem key="individual">Cá nhân</SelectItem>
                  <SelectItem key="company">Doanh nghiệp</SelectItem>
                  <SelectItem key="research_institution">
                    Viện/Trường
                  </SelectItem>
                </Select>
                <Input
                  label="Tên chủ sở hữu"
                  placeholder="Nhập tên chủ sở hữu"
                  value={owner.owner_name}
                  onChange={(e) =>
                    handleUpdateOwner(index, "ownerName", e.target.value)
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
                  value={owner.ownership_percentage.toString()}
                  onChange={(e) =>
                    handleUpdateOwner(index, "ownershipPercentage", e.target.value)
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
                    onClick={() => handleRemoveOwner(index)}
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
});
