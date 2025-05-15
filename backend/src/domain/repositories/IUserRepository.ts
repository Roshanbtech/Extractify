import { User } from "../entities/User";
import { PdfSubdoc } from '../entities/PdfSubdoc';
export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  addDocument(userId: string, doc: PdfSubdoc): Promise<void>;
  listDocuments(userId: string): Promise<PdfSubdoc[]>;
  hasDocument(userId: string, publicId: string): Promise<boolean>;
  removeDocument(userId: string, publicId: string): Promise<void>;
}
