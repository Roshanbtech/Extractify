import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { usePdfStore } from "../store/pdfStore";
import type { PdfSubdoc } from "../types/types";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface Props {
  doc: PdfSubdoc;
}

export default function PdfCard({ doc }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [loaded,setLoaded] = useState(false);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [processing, setProcessing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<"grid" | "slider">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [hoverPage, setHoverPage] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const extract = usePdfStore(s => s.extract);
  const deleteDoc = usePdfStore(s => s.deleteDoc);

  const token = localStorage.getItem("accessToken");

  const fetchPdf = () => {
    let retries = 0;

    const attemptFetch = async() => {
      setLoaded(false);
      await axios.get(`/pdf/download?publicId=${encodeURIComponent(doc.publicId)}`, {
        responseType: "blob", 
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(res => {
          setPdfFile(res.data);
          setLoaded(true);
        })
        .catch(error => {
          console.error("PDF Fetch Error:", error);
          setPdfFile(null);
          if (retries < 3) { 
            retries++; 
            setTimeout(attemptFetch, 2000); 
          }
        });
    };

    attemptFetch();
  }

  useEffect(() => {
    fetchPdf();
  }, [doc.publicId]);
  

  const onDocumentLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setSelected(Array(numPages).fill(false));
    setLoaded(true);
  };

  const togglePage = (i: number) => {
    setSelected(s => s.map((v, idx) => (idx === i ? !v : v)));
  };

  const handleExtract = async () => {
    const pages = selected
      .map((v, i) => (v ? i + 1 : null))
      .filter((n): n is number => n !== null);
  
    if (pages.length === 0) {
      return toast.error("Select at least one page");
    }
  
    setProcessing(true);
    try {
      await extract(doc.publicId, pages, pages);
  
      setTimeout(() => {
        setLoaded(false);
        fetchPdf(); 
      }, 2000);
  
      toast.success("Extraction successful");
    } catch (error) {
      console.error("Extraction failed:", error);
      toast.error("Failed to extract pages. Please try again.");
    } finally {
      setProcessing(false);
    }
  };
  

    

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "slider" : "grid");
  };

  const navigatePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showMagnifier) return;
    
    // Get position relative to the current target
    const rect = e.currentTarget.getBoundingClientRect();
    setMagnifierPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const selectAll = () => {
    setSelected(Array(numPages).fill(true));
  };

  const deselectAll = () => {
    setSelected(Array(numPages).fill(false));
  };

  const downloadPdf = async () => {
    try {
      const response = await axios.get(
        `/pdf/download?publicId=${encodeURIComponent(doc.publicId)}`,
        { responseType: "blob", withCredentials: true }
      );
      const blob = response.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };  

  const handleCheckboxChange = (i: number) => {
    togglePage(i);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden max-w-3xl hover:border-cyan-500 transition-all duration-200 filter hover:shadow-cyan-500/20">
      <header className="p-4 border-b border-cyan-700 flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex-1 min-w-0">
          <h4 className="truncate font-semibold text-white">{doc.originalName}</h4>
          <p className="text-xs text-gray-400 mt-1">
            {numPages} page{numPages !== 1 && "s"} • {selected.filter(Boolean).length} selected
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button 
            className="p-1 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setShowMagnifier(!showMagnifier)}
            title={showMagnifier ? "Disable magnifier" : "Enable magnifier"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            className="p-1 rounded-md hover:bg-gray-700 transition-colors"
            onClick={toggleViewMode}
            title={viewMode === "grid" ? "Switch to slider view" : "Switch to grid view"}
          >
            {viewMode === "grid" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1V4zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                <path d="M2 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V9zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1V9zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V9z" />
                <path d="M2 14a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H8a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="p-4 bg-gray-900 relative">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="text-xs bg-gray-700 text-cyan-500 hover:bg-gray-600 py-1 px-2 rounded transition-colors"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="text-xs bg-gray-700 text-purple-500 hover:bg-gray-600 py-1 px-2 rounded transition-colors"
            >
              Deselect All
            </button>
            <span className="text-xs text-cyan-400 ml-2">
              {selected.filter(Boolean).length} / {numPages} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Zoom: {zoom}%</span>
            <input
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={handleZoomChange}
              className="w-24 h-2 bg-cyan-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {loaded && viewMode === "slider" && (
          <div className="flex items-center justify-center gap-4 mb-2">
            <button
              onClick={() => navigatePage('prev')}
              disabled={currentPage === 1}
              className={`p-1 rounded-full ${currentPage === 1 ? 'text-gray-600' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm text-gray-400">Page {currentPage} of {numPages}</span>
            <button
              onClick={() => navigatePage('next')}
              disabled={currentPage === numPages}
              className={`p-1 rounded-full ${currentPage === numPages ? 'text-gray-600' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div 
          ref={previewRef}
          className={`bg-gray-900 overflow-auto ${viewMode === "grid" ? "max-h-64" : "max-h-96"}`}
        >
          {pdfFile && loaded ? (
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoad}
              onLoadError={error => {
                console.error("Error loading PDF:", error);
                setNumPages(0);
                setLoaded(false);
              }}
              loading={
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              }
              noData={
                <div className="flex justify-center items-center h-32 text-gray-400">
                  <span>No PDF file available</span>
                </div>
              }
            >
              { loaded && viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
                  {Array.from({ length: numPages }, (_, i) => (
                    <div 
                      key={i} 
                      className="relative group"
                      onMouseEnter={() => setHoverPage(i)}
                      onMouseLeave={() => setHoverPage(null)}
                    >
                      <div 
                        className={`
                          rounded overflow-hidden cursor-pointer transition-all duration-200
                          transform ${hoverPage === i ? "scale-105" : ""} border-2
                          ${selected[i] 
                            ? "border-cyan-500 shadow-lg shadow-cyan-500/50" 
                            : hoverPage === i 
                              ? "border-gray-500" 
                              : "border-gray-700"
                          }
                        `}
                        style={{
                          boxShadow: selected[i] ? "0 0 15px rgba(6, 182, 212, 0.5)" : "none"
                        }}
                      >
                        <Page
                          pageNumber={i + 1}
                          width={(100 * zoom) / 100}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          className={selected[i] ? "opacity-90" : "opacity-100"}
                        />
                        
                        {/* Overlay for selection indication */}
                        {selected[i] && (
                          <div className="absolute inset-0 bg-cyan-500/20 pointer-events-none" />
                        )}
                      </div>
                      
                      {/* Page number badge */}
                      <div className={`
                        absolute top-1 left-1 min-w-6 h-6 rounded-md flex items-center justify-center text-xs px-1.5
                        ${selected[i] ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"}
                      `}>
                        {i + 1}
                      </div>
                      
                      {/* Checkbox */}
                      <div className="absolute top-1 right-1 z-10">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected[i]}
                            onChange={() => handleCheckboxChange(i)}
                            className="form-checkbox h-4 w-4 text-cyan-500 rounded border-gray-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                          />
                        </label>
                      </div>
                      
                      {showMagnifier && hoverPage === i && (
                        <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-gray-800 rounded-full border border-gray-600 flex items-center justify-center cursor-zoom-in z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div 
                    className="relative group cursor-pointer"
                    onMouseMove={handleMouseMove}
                  >
                    <div className={`
                      rounded overflow-hidden border-2 relative
                      ${selected[currentPage - 1] 
                        ? "border-cyan-500 shadow-lg shadow-cyan-500/50" 
                        : "border-gray-700"
                      }
                    `}
                    style={{
                      boxShadow: selected[currentPage - 1] ? "0 0 20px rgba(6, 182, 212, 0.5)" : "none"
                    }}
                    >
                      <Page
                        pageNumber={currentPage}
                        width={(180 * zoom) / 100}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                      
                      {/* Overlay for selection indication */}
                      {selected[currentPage - 1] && (
                        <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
                      )}
                    </div>
                    
                    {/* Page number badge */}
                    <div className={`
                      absolute top-2 left-2 min-w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium px-2
                      ${selected[currentPage - 1] ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"}
                    `}>
                      {currentPage}
                    </div>
                    
                    {/* Checkbox */}
                    <div className="absolute top-2 right-2 z-10">
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected[currentPage - 1]}
                          onChange={() => handleCheckboxChange(currentPage - 1)}
                          className="form-checkbox h-5 w-5 text-cyan-500 rounded border-gray-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                        />
                      </label>
                    </div>
                    
                    {showMagnifier && (
                      <div 
                        className="absolute w-32 h-32 border-2 border-cyan-500 rounded-full overflow-hidden pointer-events-none z-10 bg-white shadow-lg"
                        style={{
                          top: Math.max(0, Math.min(magnifierPosition.y - 64, (previewRef.current?.clientHeight || 0) - 128)),
                          left: Math.max(0, Math.min(magnifierPosition.x - 64, (previewRef.current?.clientWidth || 0) - 128)),
                          backgroundImage: `url(${URL.createObjectURL(pdfFile || new Blob())})`,
                          backgroundPosition: `${-magnifierPosition.x * 2.5 + 80}px ${-magnifierPosition.y * 2.5 + 80}px`,
                          backgroundSize: `${zoom * 5}%`,
                          display: showMagnifier ? 'block' : 'none',
                          boxShadow: "0 0 15px rgba(6, 182, 212, 0.6)"
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </Document>
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Selection summary */}
        {selected.some(Boolean) && (
          <div className="mt-3 p-2 bg-gray-800 rounded-md border border-gray-700">
            <div className="text-xs text-gray-300">
              Selected pages: 
              <span className="ml-1 font-mono text-cyan-400">
                {selected
                  .map((isSelected, index) => isSelected ? index + 1 : null)
                  .filter(page => page !== null)
                  .join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 flex justify-between items-center">
        <button
          onClick={handleExtract}
          disabled={!selected.some(Boolean) || processing}
          className={`
            px-4 py-2 rounded-md font-medium transition-all duration-200
            flex items-center gap-2
            ${!selected.some(Boolean) || processing
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-0.5"
            }
          `}
        >
          {processing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing…</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Extract ({selected.filter(Boolean).length})</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadPdf}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white font-medium hover:bg-gray-600 transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>
          <button
            onClick={() => deleteDoc(doc.publicId)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors text-red-400 hover:text-red-300 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </footer>
    </div>
  );
}