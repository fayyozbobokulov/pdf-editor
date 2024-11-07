import React, { useState } from 'react';
import { FileUp, Download, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { PDFFile } from '@/types';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

const PDFEditor: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfFile({
        file,
        name: file.name,
        url,
      });
    } else {
      showNotification('Please select a valid PDF file');
    }
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const rotatePage = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handleDownload = async () => {
    if (!pdfFile) return;

    try {
      const response = await fetch(pdfFile.url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `edited_${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      showNotification('PDF downloaded successfully');
    } catch (error) {
      showNotification('Error downloading PDF');
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            onClick={() => document.getElementById('pdf-upload')?.click()}
            className="flex items-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            Upload PDF
          </Button>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <Button
            onClick={rotatePage}
            disabled={!pdfFile}
            className="flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Rotate
          </Button>
          
          <Button
            onClick={handleZoomIn}
            disabled={!pdfFile}
            className="flex items-center gap-2"
          >
            <ZoomIn className="w-4 h-4" />
            Zoom In
          </Button>
          
          <Button
            onClick={handleZoomOut}
            disabled={!pdfFile}
            className="flex items-center gap-2"
          >
            <ZoomOut className="w-4 h-4" />
            Zoom Out
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={!pdfFile}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>

        {pdfFile && (
          <div className="flex flex-col items-center">
            <div className="border rounded-lg p-4 bg-gray-50 w-full h-[600px] overflow-auto">
              <iframe
                src={pdfFile.url}
                className="w-full h-full"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </div>
        )}

        {!pdfFile && (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No PDF file selected</p>
            <p className="text-sm text-gray-400 mt-2">
              Upload a PDF to begin editing
            </p>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default PDFEditor;