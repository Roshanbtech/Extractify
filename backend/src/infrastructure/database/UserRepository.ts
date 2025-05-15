import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import UserModel, { IUser } from "../database/models/UserModel";
import { PdfSubdoc } from "../../domain/entities/PdfSubdoc";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const createdUser: IUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      return new User({
        id: createdUser.id.toString(),
        name: createdUser.name,
        email: createdUser.email,
        password: createdUser.password,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
      throw new Error("Error creating user");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const foundUser: IUser | null = await UserModel.findOne({ email });
      if (foundUser) {
        return new User({
          id: foundUser.id.toString(),
          name: foundUser.name,
          email: foundUser.email,
          password: foundUser.password,
        });
      }
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error finding user by email: ${error.message}`);
      }
      throw new Error("Error finding user by email");
    }
  }

  async addDocument(userId: string, doc: PdfSubdoc): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");
    if(!user.documents) user.documents = [];
    user.documents.push({
      publicId: doc.publicId,
      originalName: doc.originalName,
      url: doc.url,
      createdAt: doc.createdAt,
    });
    await user.save();
  }

  async hasDocument(userId: string, publicId: string): Promise<boolean> {
    const user = await UserModel.exists({ _id: userId, 'documents.publicId': publicId });
    return Boolean(user);
  }



  async listDocuments(userId: string): Promise<PdfSubdoc[]> {
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new Error("User not found");
    if (!user.documents) return [];
  
    console.log("Stored PDFs for User:", user.documents);
  
    return user.documents.map(d => new PdfSubdoc(d.publicId, d.url, d.originalName, d.createdAt)) || [];
  }
  

  async removeDocument(userId: string, publicId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { documents: { publicId } }
    });
  }
}