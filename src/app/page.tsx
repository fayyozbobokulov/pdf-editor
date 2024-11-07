'use client';

import PDFEditor from '@/components/pdf-editor/PDFEditor';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">PDF Editor</h1>
        <PDFEditor />
      </div>
    </main>
  );
}