'use client';

import React, { useState } from 'react';
import { Card, Button as AntdButton, Input as AntdInput, Select as AntdSelect, Space } from 'antd';
import { Button as HeroUIButton, Input as HeroUIInput, Select as HeroUISelect, SelectItem } from '@heroui/react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = AntdSelect;

export default function AntdHeroUIComparison() {
  const [antdValue, setAntdValue] = useState('');
  const [heroUIValue, setHeroUIValue] = useState('');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        So sánh Ant Design vs HeroUI
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ant Design Column */}
        <Card title="Ant Design Components" className="h-fit">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <Space wrap>
                <AntdButton type="primary">Primary</AntdButton>
                <AntdButton>Default</AntdButton>
                <AntdButton type="dashed">Dashed</AntdButton>
                <AntdButton type="primary" danger>
                  Danger
                </AntdButton>
                <AntdButton type="primary" icon={<PlusOutlined />}>
                  With Icon
                </AntdButton>
                <AntdButton type="primary" loading>
                  Loading
                </AntdButton>
              </Space>
            </div>

            {/* Inputs */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Inputs</h3>
              <Space direction="vertical" style={{ width: '100%' }}>
                <AntdInput 
                  placeholder="Basic input" 
                  value={antdValue}
                  onChange={(e) => setAntdValue(e.target.value)}
                />
                <AntdInput 
                  prefix={<UserOutlined />} 
                  placeholder="Input with prefix icon" 
                />
                <AntdInput.Password placeholder="Password input" />
                <AntdInput.TextArea 
                  rows={3} 
                  placeholder="Textarea" 
                />
              </Space>
            </div>

            {/* Select */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select</h3>
              <AntdSelect 
                placeholder="Chọn một tùy chọn" 
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="option1">Tùy chọn 1</Option>
                <Option value="option2">Tùy chọn 2</Option>
                <Option value="option3">Tùy chọn 3</Option>
              </AntdSelect>
            </div>

            {/* Size Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
              <Space direction="vertical" style={{ width: '100%' }}>
                <AntdButton size="small">Small Button</AntdButton>
                <AntdButton size="middle">Middle Button</AntdButton>
                <AntdButton size="large">Large Button</AntdButton>
              </Space>
            </div>
          </Space>
        </Card>

        {/* HeroUI Column */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">HeroUI Components</h2>
          <div className="space-y-8">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-2">
                <HeroUIButton color="primary">Primary</HeroUIButton>
                <HeroUIButton color="default">Default</HeroUIButton>
                <HeroUIButton variant="bordered">Bordered</HeroUIButton>
                <HeroUIButton color="danger">Danger</HeroUIButton>
                <HeroUIButton color="primary" startContent={<PlusOutlined />}>
                  With Icon
                </HeroUIButton>
                <HeroUIButton color="primary" isLoading>
                  Loading
                </HeroUIButton>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Inputs</h3>
              <div className="space-y-4">
                <HeroUIInput 
                  placeholder="Basic input"
                  value={heroUIValue}
                  onValueChange={setHeroUIValue}
                />
                <HeroUIInput 
                  startContent={<UserOutlined />}
                  placeholder="Input with start content"
                />
                <HeroUIInput 
                  type="password"
                  placeholder="Password input"
                />
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Textarea (using regular HTML)"
                />
              </div>
            </div>

            {/* Select */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select</h3>
              <HeroUISelect placeholder="Chọn một tùy chọn">
                <SelectItem key="option1" value="option1">
                  Tùy chọn 1
                </SelectItem>
                <SelectItem key="option2" value="option2">
                  Tùy chọn 2
                </SelectItem>
                <SelectItem key="option3" value="option3">
                  Tùy chọn 3
                </SelectItem>
              </HeroUISelect>
            </div>

            {/* Size Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
              <div className="space-y-2">
                <HeroUIButton size="sm">Small Button</HeroUIButton>
                <HeroUIButton size="md">Medium Button</HeroUIButton>
                <HeroUIButton size="lg">Large Button</HeroUIButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      <Card title="Tóm tắt so sánh" className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3 text-blue-600">Ant Design</h4>
            <ul className="space-y-2 text-sm">
              <li>✅ Bộ component phong phú và đầy đủ</li>
              <li>✅ Hỗ trợ internationalization tốt</li>
              <li>✅ Theme system mạnh mẽ</li>
              <li>✅ Documentation chi tiết</li>
              <li>✅ Cộng đồng lớn và ổn định</li>
              <li>✅ Tích hợp tốt với form validation</li>
              <li>⚠️ Bundle size lớn hơn</li>
              <li>⚠️ Styling phức tạp hơn khi customize</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 text-green-600">HeroUI</h4>
            <ul className="space-y-2 text-sm">
              <li>✅ Modern design và animations đẹp</li>
              <li>✅ Tích hợp tốt với Tailwind CSS</li>
              <li>✅ Bundle size nhỏ hơn</li>
              <li>✅ TypeScript support tốt</li>
              <li>✅ Accessibility tốt (React Aria)</li>
              <li>✅ Customization dễ dàng</li>
              <li>⚠️ Ít component hơn Ant Design</li>
              <li>⚠️ Cộng đồng nhỏ hơn</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">💡 Khuyến nghị sử dụng:</h4>
          <p className="text-sm text-gray-700">
            <strong>Ant Design:</strong> Sử dụng cho các trang admin, dashboard, form phức tạp, table với nhiều tính năng.<br/>
            <strong>HeroUI:</strong> Sử dụng cho landing page, UI components đơn giản, khi cần design modern và animations.
          </p>
        </div>
      </Card>
    </div>
  );
}
