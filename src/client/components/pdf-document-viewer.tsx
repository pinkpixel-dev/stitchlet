import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PdfDocumentViewerProps = {
  filename?: string;
  source: string;
};

const maximumPageWidth = 960;
const maximumPixelRatio = 1.5;

export function PdfDocumentViewer({ filename, source }: PdfDocumentViewerProps) {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const pageContainer = pageContainerRef.current;

    if (!pageContainer) {
      return;
    }

    const updatePageWidth = () => {
      setPageWidth(Math.min(Math.floor(pageContainer.clientWidth), maximumPageWidth));
    };

    updatePageWidth();
    const observer = new ResizeObserver(updatePageWidth);
    observer.observe(pageContainer);

    return () => observer.disconnect();
  }, []);

  const pixelRatio =
    typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, maximumPixelRatio);

  return (
    <div
      aria-label={`PDF pages for ${filename ?? "pattern"}`}
      className="min-h-0 flex-1 overflow-y-auto bg-(--surface-strong) p-2 sm:p-4"
      data-page-count={pageCount}
      data-pdf-viewer
      role="region"
    >
      <div className="mx-auto w-full max-w-[60rem]" ref={pageContainerRef}>
        <Document
          error={null}
          file={source}
          loading={
            <div className="rounded-md border border-(--border) bg-(--shell) p-4 text-sm text-(--muted)" role="status">
              Loading pattern pages...
            </div>
          }
          onLoadError={() => {
            setLoadError("The pattern could not be displayed. You can still download the PDF.");
            setPageCount(0);
          }}
          onLoadSuccess={({ numPages }) => {
            setLoadError(null);
            setPageCount(numPages);
          }}
        >
          {loadError ? (
            <div className="rounded-md border border-(--border) bg-(--shell) p-4 text-sm text-(--muted)" role="alert">
              {loadError}
            </div>
          ) : null}

          {pageWidth > 0 && pageCount > 0 ? (
            <div className="space-y-3">
              {Array.from({ length: pageCount }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <section aria-label={`Page ${pageNumber} of ${pageCount}`} data-pdf-page={pageNumber} key={pageNumber}>
                    <p className="mb-1 text-center text-xs text-(--muted)">
                      Page {pageNumber} of {pageCount}
                    </p>
                    <Page
                      className="overflow-hidden rounded-md border border-(--border) bg-white [&>canvas]:!h-auto [&>canvas]:!max-w-full"
                      devicePixelRatio={pixelRatio}
                      loading={
                        <div className="flex min-h-44 items-center justify-center text-sm text-(--muted)" role="status">
                          Rendering page {pageNumber}...
                        </div>
                      }
                      pageNumber={pageNumber}
                      width={pageWidth}
                    />
                  </section>
                );
              })}
            </div>
          ) : null}
        </Document>
      </div>
    </div>
  );
}

export default PdfDocumentViewer;
