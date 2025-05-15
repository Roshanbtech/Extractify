import { create } from 'zustand';
import axios from '../api/axiosInstance';
import { PdfSubdoc } from '../types/types';
import { toast } from 'react-toastify';

interface PdfState { docs: PdfSubdoc[]; fetchList: () => Promise<void>; upload: (file: File) => Promise<void>; extract: (publicId: string, pages: number[], order?: number[]) => Promise<void>; deleteDoc: (publicId: string) => Promise<void>; }
export const usePdfStore = create<PdfState>(set => ({
  docs: [],
  fetchList: async () => {
    const res = await axios.get('/pdf/list'); 
    console.log("Fetched PDFs:", res.data.documents); 
    set({ docs: res.data.documents });
  },
  upload: async file => {
    const form = new FormData(); form.append('pdf', file);
    await axios.post('/pdf/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Uploaded!'); await usePdfStore.getState().fetchList();
  },
  extract: async (publicId, pages, order) => {
    await axios.post('/pdf/extract', { publicId, pages, order });
    toast.success('Extraction complete'); await usePdfStore.getState().fetchList();
  },
  deleteDoc: async publicId => {
    if (confirm('Delete this PDF?')) {
      await axios.delete('/pdf/delete', {
        data: { publicId }
      });
      toast.success('File Deleted');
      await usePdfStore.getState().fetchList();
    }
  }
}));
