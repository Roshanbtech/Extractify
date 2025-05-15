export interface IPdfFileRepository {
  saveOriginal(input: {
    userId: string;
    fileBuffer: Buffer;
    originalName: string;
  }): Promise<{ publicId: string; url: string }>;

  extractPages(input: {
    userId: string;
    publicId: string;
    pages: number[];
    order?: number[];
  }): Promise<{ publicId: string; url: string }>;

  getSignedUrl(publicId: string): string;

  delete(input: {
    userId: string;
    publicId: string;
  }): Promise<void>;
}