import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  displayName: string;
  email: string;
  photo?: string;
  password?: string;
}

const UserSchema = new Schema<IUser>({
  googleId: { type: String, unique: true, sparse: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String },
  password: { type: String },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
