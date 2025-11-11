
// import { useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';

// import { Document, Page, pdfjs } from 'react-pdf';
import { Viewer, Worker } from '@react-pdf-viewer/core';

// pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + "/public/pdf.worker.min.mjs";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

export const PDFViewer = ({ file }: { file: string }) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs">
      <Viewer fileUrl={file} />;
    </Worker>
  )
  // const [numPages, setNumPages] = useState<number>();
  // const [pageNumber] = useState<number>(1);

  // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
  //   setNumPages(numPages);
  // }

  // return (
  //   <div className="flex flex-col items-center w-full h-full">
  //     <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
  //       <Page pageNumber={pageNumber} />
  //     </Document>
  //     <p>
  //       Page {pageNumber} of {numPages}
  //     </p>
  //   </div>
  // );
};