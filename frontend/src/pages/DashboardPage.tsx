import { useState, useEffect, useMemo } from 'react';
import { usePdfStore } from '../store/pdfStore';
import { useAuthStore } from '../store/authStore';
import DragDropZone from '../components/DragDropZone';
import PdfCard from '../components/PdfCard';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  // Auth
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // PDFs
  const docs = usePdfStore((state) => state.docs);
  const fetchList = usePdfStore((state) => state.fetchList);
  const upload = usePdfStore((state) => state.upload);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Pagination state
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(docs.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  const pageDocs = useMemo(
    () =>
      docs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      ),
    [docs, currentPage]
  );

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="w-full bg-black border-b border-cyan-500 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Extractify
              </h1>
              {user && (
                <p className="text-sm text-gray-400">
                  Welcome, <span className="text-cyan-400">{user.name}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition duration-300 shadow-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        <section className="mb-8">
          <DragDropZone onUpload={upload} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            Your PDFs
          </h2>

          {docs.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
              <p className="text-gray-400">You haven't uploaded any PDFs yet.</p>
              <p className="text-gray-400 mt-2">Use the upload area above to get started.</p>
            </div>
          ) : (
            <>
              {/* 3×2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageDocs.map((doc) => (
                  <PdfCard key={doc.publicId} doc={doc} />
                ))}
                {/* Fill empty slots */}
                {pageDocs.length < ITEMS_PER_PAGE &&
                  Array.from({ length: ITEMS_PER_PAGE - pageDocs.length }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full transition-colors focus:outline-none 
                    ${currentPage === 1
                      ? 'bg-cyan-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-gray-600'
                    }`}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>

                <span className="text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full transition-colors focus:outline-none 
                    ${currentPage === totalPages
                      ? 'bg-cyan-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-gray-600'
                    }`}
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
