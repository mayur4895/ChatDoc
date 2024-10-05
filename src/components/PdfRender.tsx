// components/PdfRender.tsx
'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Ensure the workerSrc is set correctly
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
}

interface PdfRenderProps {
  pdfUrl: string | undefined; 
}

const PdfRender: React.FC<PdfRenderProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setLoading(false);
    setNumPages(numPages);
  };

  const onLoadError = (error: any) => {
    setLoading(false);
    setError(error.message);
  };

  return (
    <div className="flex-1 flex-col justify-center items-start w-full h-auto">
      {loading && <p>Loading PDF...</p>}
      {error && <p>Error loading PDF: {error}</p>}
      <div className="pdf-container relative w-full  ">
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center">
            {numPages && Array.from(new Array(numPages), (el, index) => (
              <div key={index} className="mb-0"> {/* Remove margin between pages */}
                <Page 
                  pageNumber={index + 1}
                  width={600} // Set a fixed width for each page
                  height={600} // Set an appropriate height; adjust as necessary
                  renderTextLayer={false} 
                  className={"scale-75 md:scale-90  lg:scale-100  "}// Disable rendering of text layer
                />
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
};

export default PdfRender;
