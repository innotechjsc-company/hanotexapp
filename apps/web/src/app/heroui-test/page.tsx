"use client";

import { useState, useCallback } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Switch,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

export default function HeroUITestPage() {
  const [selected, setSelected] = useState<string>("apple");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const toggleDark = useCallback(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">HeroUI Components Test</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Trang test nhanh các component của HeroUI để xác nhận cấu hình Tailwind đã hoạt động.
          </p>
        </div>
        <Switch onValueChange={(_v) => toggleDark()}>
          Chế độ tối
        </Switch>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Buttons</h2>
          </CardHeader>
          <CardBody className="flex flex-wrap gap-3">
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
            <Button variant="flat">Flat</Button>
            <Button variant="bordered">Bordered</Button>
            <Button variant="light">Light</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Inputs & Select</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input 
              label="Email" 
              placeholder="you@example.com" 
              type="email" 
              variant="bordered"
            />
            <Input 
              label="Password" 
              placeholder="••••••••" 
              type="password" 
              variant="bordered"
            />
            <Select
              label="Favorite fruit"
              variant="bordered"
              selectedKeys={new Set([selected])}
              onSelectionChange={(keys) => {
                if (keys === "all") return;
                const k = Array.from(keys)[0] as string;
                setSelected(k);
              }}
            >
              <SelectItem key="apple">Apple</SelectItem>
              <SelectItem key="banana">Banana</SelectItem>
              <SelectItem key="orange">Orange</SelectItem>
            </Select>
            
            {/* Test các Input variants khác */}
            <Input 
              label="Flat Input" 
              placeholder="Flat variant" 
              variant="flat" 
            />
            <Input 
              label="Faded Input" 
              placeholder="Faded variant" 
              variant="faded" 
            />
            <Input 
              label="Underlined Input" 
              placeholder="Underlined variant" 
              variant="underlined" 
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Tabs</h2>
          </CardHeader>
          <CardBody>
            <Tabs aria-label="Options" className="w-full">
              <Tab key="photos" title="Photos">
                <div className="p-2 text-sm text-gray-600 dark:text-gray-300">
                  Nội dung tab Photos
                </div>
              </Tab>
              <Tab key="music" title="Music">
                <div className="p-2 text-sm text-gray-600 dark:text-gray-300">
                  Nội dung tab Music
                </div>
              </Tab>
              <Tab key="videos" title="Videos">
                <div className="p-2 text-sm text-gray-600 dark:text-gray-300">
                  Nội dung tab Videos
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Modal</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Nhấn nút để mở modal và kiểm tra animation.
            </p>
            <Button color="primary" onPress={onOpen}>
              Open Modal
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {() => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Demo Modal
                    </ModalHeader>
                    <ModalBody>
                      <p>Đây là nội dung modal của HeroUI.</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="light" onPress={() => onOpenChange()}>
                        Đóng
                      </Button>
                      <Button color="primary" onPress={() => onOpenChange()}>
                        Xác nhận
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
