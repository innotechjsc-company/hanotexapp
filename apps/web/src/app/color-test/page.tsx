"use client";

import { Button } from "@heroui/react";

export default function ColorTestPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Color Test - Primary Color Check</h1>
        <p className="text-gray-600 mb-8">
          Kiểm tra xem màu primary (#3b82f6) có hiển thị đúng không. 
          Nếu button bên dưới màu trắng xóa thì có vấn đề với cấu hình.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">HeroUI Button Primary</h2>
          <div className="flex flex-wrap gap-4">
            <Button color="primary" data-test="heroui-primary">Primary Button (HeroUI)</Button>
            <Button color="primary" variant="flat">Primary Flat</Button>
            <Button color="primary" variant="bordered">Primary Bordered</Button>
            <Button color="primary" variant="light">Primary Light</Button>
            <Button color="primary" variant="ghost">Primary Ghost</Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Tailwind Classes Test</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              data-test="tailwind-primary"
              className="bg-primary-500 text-white px-4 py-2 rounded"
            >
              bg-primary-500 (Should be #3b82f6)
            </button>
            <button className="bg-primary-600 text-white px-4 py-2 rounded">
              bg-primary-600 (Should be #2563eb)
            </button>
            <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded">
              bg-primary-100 text-primary-800
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Color Values Reference</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-primary-50 p-3 rounded text-center">
              <div className="mb-2">primary-50</div>
              <div className="text-xs">#eff6ff</div>
            </div>
            <div className="bg-primary-100 p-3 rounded text-center">
              <div className="mb-2">primary-100</div>
              <div className="text-xs">#dbeafe</div>
            </div>
            <div className="bg-primary-200 p-3 rounded text-center">
              <div className="mb-2">primary-200</div>
              <div className="text-xs">#bfdbfe</div>
            </div>
            <div className="bg-primary-300 p-3 rounded text-center">
              <div className="mb-2">primary-300</div>
              <div className="text-xs">#93c5fd</div>
            </div>
            <div className="bg-primary-400 p-3 rounded text-center text-white">
              <div className="mb-2">primary-400</div>
              <div className="text-xs">#60a5fa</div>
            </div>
            <div className="bg-primary-500 p-3 rounded text-center text-white">
              <div className="mb-2">primary-500</div>
              <div className="text-xs font-bold">#3b82f6</div>
            </div>
            <div className="bg-primary-600 p-3 rounded text-center text-white">
              <div className="mb-2">primary-600</div>
              <div className="text-xs">#2563eb</div>
            </div>
            <div className="bg-primary-700 p-3 rounded text-center text-white">
              <div className="mb-2">primary-700</div>
              <div className="text-xs">#1d4ed8</div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Chẩn đoán</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Màu mong muốn:</strong> <span style={{color: '#3b82f6'}}>#3b82f6 (Blue-500)</span></p>
            <p><strong>Nếu HeroUI Button màu trắng:</strong> Vấn đề với cấu hình HeroUI theme</p>
            <p><strong>Nếu Tailwind classes không hoạt động:</strong> Vấn đề với Tailwind config</p>
            <p><strong>Nếu cả hai đều hoạt động:</strong> Không có vấn đề gì!</p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Manual Debug:</h3>
            <button 
              onClick={() => {
                const btn = document.querySelector('[data-test="heroui-primary"]');
                const style = btn ? getComputedStyle(btn) : null;
                alert(`HeroUI Primary Button:\n- Background: ${style?.backgroundColor || 'N/A'}\n- Color: ${style?.color || 'N/A'}`);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded text-xs mr-2"
            >
              Check HeroUI
            </button>
            <button 
              onClick={() => {
                const btn = document.querySelector('[data-test="tailwind-primary"]');
                const style = btn ? getComputedStyle(btn) : null;
                alert(`Tailwind Primary Button:\n- Background: ${style?.backgroundColor || 'N/A'}\n- Color: ${style?.color || 'N/A'}`);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
            >
              Check Tailwind
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}