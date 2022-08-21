import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack5';
import Button from './Button';
import Modal from './Modal';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDF = ({ PDF, onClose, className = '' }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Modal
      closable={true}
      onClose={onClose}
      className={'h-2/3 w-2/4 overflow-auto' + className}
    >
      <div className='flex justify-between'>
        <Button
          type='primary'
          onClick={() =>
            setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)
          }
        >
          Previous
        </Button>
        <Button
          type='primary'
          onClick={() =>
            setPageNumber(
              pageNumber + 1 >= numPages ? numPages : pageNumber + 1
            )
          }
        >
          Next
        </Button>
      </div>
      <Document
        file={PDF}
        onContextMenu={(e) => e.preventDefault()}
        className='print:hidden p-4'
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode='canvas'
      >
        <div className='flex items-center'>
          <Page pageNumber={pageNumber} width={600} className='mx-auto' />
        </div>
      </Document>
    </Modal>
  );
};

export default PDF;
