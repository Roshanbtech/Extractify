import mongoose, { Schema, Document } from "mongoose";

export interface IPdfSubdoc{
    publicId: string;
    originalName: string;
    createdAt: Date;
    url: string
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  documents?: IPdfSubdoc[];
  createdAt: Date;
  updatedAt: Date;
}

const PdfSubdocSchema = new Schema<IPdfSubdoc>(
    {
      publicId:     { type: String, required: true },
      originalName: { type: String, required: true },
      url:          { type: String, required: true },
    },
    {
      _id: false,
      timestamps: { createdAt: true, updatedAt: false },
    }
  );

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    documents: {
        type: [PdfSubdocSchema],
        required: false,        
        default: [],     
      },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
