import React from 'react'
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
 


interface PdfRenderProps{
    FileUrl:string |undefined;
}
const PdfRender = ( {FileUrl}:PdfRenderProps) => {
  return (
    <div>
     <div className='container w-full mx-auto border  p-2 '>
 <div className='flex items-center w-full h-12    '>
    top bar
    </div>

    <Document file={FileUrl}>
      <Page pageNumber={1} />
    </Document>
    </div>
    </div>
  )
}

export default PdfRender
