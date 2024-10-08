'use client';

import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, Fullscreen, Loader2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { CiFileOff } from 'react-icons/ci';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { ScrollArea } from './ui/scroll-area';
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { PdfModal } from './models/pdf-modal';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
}

interface PdfRenderProps {
  pdfUrl: string | undefined;
}

type FormValues = {
  currentPage: number;
};

export default function PdfRender({ pdfUrl }: PdfRenderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const { width, ref } = useResizeDetector();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      currentPage: 1,
    },
  });

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setLoading(false);
    setNumPages(numPages);
    pageRefs.current = Array(numPages).fill(null);
  };

  const onLoadError = (error: any) => {
    toast({
      title: "Error loading PDF",
      description: error.message,
      variant: "destructive",
    });
    setError(error.message);
    setLoading(false);
  };

  const scrollToPage = (pageNumber: number) => {
    const pageElement = pageRefs.current[pageNumber - 1];
    if (pageElement && scrollAreaRef.current) {
      const scrollTop = pageElement.offsetTop - scrollAreaRef.current.offsetTop;
      scrollAreaRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (numPages && currentPage < numPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setValue('currentPage', newPage);
      scrollToPage(newPage);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setValue('currentPage', newPage);
      scrollToPage(newPage);
    }
  };

  const onSubmit = (data: FormValues) => {
    const newPage = Math.min(Math.max(data.currentPage, 1), numPages);
    setCurrentPage(newPage);
    setValue('currentPage', newPage);
    scrollToPage(newPage);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= numPages) {
      setCurrentPage(value);
      setValue('currentPage', value);
      scrollToPage(value);
    }
  };

  const increaseScale = () => setScale((prev) => Math.min(prev + 0.1, 2.0));
  const decreaseScale = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const rotatePage = () => setRotation((prev) => (prev + 90) % 360);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, clientHeight } = scrollAreaRef.current;
        const middleOfViewport = scrollTop + clientHeight / 2;

        for (let i = 0; i < pageRefs.current.length; i++) {
          const pageElement = pageRefs.current[i];
          if (pageElement) {
            const { offsetTop, offsetHeight } = pageElement;
            if (middleOfViewport >= offsetTop && middleOfViewport < offsetTop + offsetHeight) {
              setCurrentPage(i + 1);
              setValue('currentPage', i + 1);
              break;
            }
          }
        }
      }
    };

    const scrollArea = scrollAreaRef.current;
    scrollArea?.addEventListener('scroll', handleScroll);

    return () => scrollArea?.removeEventListener('scroll', handleScroll);
  }, [setValue]);

  useEffect(() => {
    setValue('currentPage', currentPage);
  }, [currentPage, setValue]);

 
  useEffect(() => {
    if (width) {
      const newScale = Math.min(width / 600, 2.0);
      setScale(newScale);
    }
  }, [width]);

  if (error) {
    return (
      <div className='z-50 flex items-center justify-center w-full h-[80vh]'>
        <div className='text-center flex items-center flex-col gap-5'>
          <CiFileOff size={25} />
          <span>Error loading PDF</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex-col justify-center items-start w-full h-auto overflow-hidden" >
      {!loading && !error && (
        <div className='flex items-center justify-between border'>
          <div className="w-full h-12 z-50 flex items-center p-4 gap-5 bg-white sticky top-0">
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              <ChevronUp size={20} />
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
              <Input
                type="number"
                max={numPages}
                {...register('currentPage', {
                  required: true,
                  valueAsNumber: true,
                  min: 1,
                  max: numPages || 1,
                })}
                className="w-20 text-center"
                onChange={handleInputChange}
              />
              <span>/ {numPages}</span>
              <button type="submit" className="hidden">Go</button>
            </form>
            <button onClick={goToNextPage} disabled={numPages ? currentPage === numPages : true}>
              <ChevronDown size={20} />
            </button>
          </div>

          <div className='flex items-center gap-5 mr-5'>
            <button onClick={increaseScale}>
              <ZoomIn size={20} />
            </button>
            <button onClick={decreaseScale}>
              <ZoomOut size={20} />
            </button>
            <button onClick={rotatePage}>
              <RotateCw size={20} />
            </button>
            <PdfModal
              pdfUrl={pdfUrl}
              numPages={numPages}
              onLoadError={onLoadError}
              onLoadSuccess={onLoadSuccess}
              scale={scale}
              rotate={rotation}
              currentPage={currentPage}
            />
          </div>
        </div>
      )}

      <ScrollArea ref={scrollAreaRef} className='h-[calc(85vh-3rem)]  w-full bg-zinc-50 border overflow-auto'>
        {loading && (
          <div className='flex items-center justify-center w-full h-[85vh]'>
            <div className='text-center flex items-center flex-col gap-5'>
              <Loader2 className='animate-spin' size={22} />
              <span>Loading PDF...</span>
            </div>
          </div>
        )}
        <div ref={ref} className="    w-full ">
          <Document
            file={pdfUrl}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            className="flex flex-col items-center justify-center w-full overflow-hidden"
          >
           {Array.from(new Array(numPages), (el, index) => (
  <div
    key={index}
    ref={(pageRef) => {
      pageRefs.current[index] = pageRef; // Assign the ref without returning anything
    }}
    className='border mb-5 w-auto justify-center'
  >
    <Page
      pageNumber={currentPage }
      scale={scale}
      rotate={rotation}
      renderTextLayer={false}  // Disable text layer
      renderAnnotationLayer={false} // Disable annotation layer
      className="shadow-md rounded"
      loading={
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="animate-spin" />
        </div>
      }
    />
  </div>
))}

          </Document>
        </div>
      </ScrollArea>
    </div>
  );
}
