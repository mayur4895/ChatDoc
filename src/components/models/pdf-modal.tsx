'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronDown, ChevronUp, RotateCw, ZoomIn, ZoomOut, Fullscreen
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { ScrollArea } from "../ui/scroll-area";

interface PdfModalProps {
  pdfUrl: string | undefined;
  numPages: number;
  onLoadSuccess: any;
  onLoadError: any;
  scale: number;
  rotate: any;
  currentPage: number;
}

export function PdfModal({
  pdfUrl,
  onLoadError,
  onLoadSuccess,
  numPages,
}: PdfModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { width, ref } = useResizeDetector();

  const scrollToPage = (pageNumber: number) => {
    const pageElement = pageRefs.current[pageNumber - 1];
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToNextPage = () => {
    if (numPages && currentPage < numPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      scrollToPage(newPage);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      scrollToPage(newPage);
    }
  };

  const increaseScale = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const decreaseScale = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const rotatePage = () => setRotation((prev) => (prev + 90) % 360);

  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 when modal opens
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-4">
          <Fullscreen size={22} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="flex items-center justify-between border-b pb-2 mt-5 mb-4">
       
         <div className="flex items-center gap-2">
             
          <button onClick={increaseScale}>
            <ZoomIn size={20} />
          </button>
          <button onClick={decreaseScale}>
            <ZoomOut size={20} />
          </button>
          <button onClick={rotatePage}>
            <RotateCw size={20} />
          </button>
         </div>
        </div>
     <ScrollArea className=" h-[80vh]">
        
     <div ref={ref} className="pdf-container relative w-full pr-8">
          <Document
            file={pdfUrl}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            className="flex flex-col items-center justify-center w-full"
          >
            {Array.from({ length: numPages || 0 }, (_, index) => (
              <div
                key={`page-${index + 1}`}
                ref={(el) => {
                  if (el) pageRefs.current[index] = el;
                }}
                className="mb-4"
              >
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={width ? width : undefined}
                  renderTextLayer={false}
                  scale={scale}
                  rotate={rotation}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
     </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
