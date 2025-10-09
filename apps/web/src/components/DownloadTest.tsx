import React from 'react';
import { Button, message } from 'antd';
import { Download } from 'lucide-react';
import downloadService from '@/services/downloadService';

export const DownloadTest: React.FC = () => {
  const testDownload = async () => {
    try {
      message.loading('Testing download...', 0.5);
      
      // Test with a sample file URL - replace with actual file URL from your system
      const testUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      
      await downloadService.downloadByUrl(testUrl, 'test-download.pdf');
      message.success('Test download successful!');
    } catch (error) {
      console.error('Test download failed:', error);
      message.error(`Test download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4">
      <h3>Download Functionality Test</h3>
      <Button 
        type="primary" 
        icon={<Download size={16} />} 
        onClick={testDownload}
      >
        Test Download
      </Button>
      <p className="mt-2 text-sm text-gray-600">
        Click to test the download functionality. Check browser console for debug logs.
      </p>
    </div>
  );
};