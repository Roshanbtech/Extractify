export class PdfSubdoc {
  constructor(
    public readonly publicId: string,
    public readonly url: string,
    public readonly originalName: string,
    public readonly createdAt: Date
  ) {}
}
