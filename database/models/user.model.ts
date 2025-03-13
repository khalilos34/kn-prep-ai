import { userRoles } from "@/constants/constants";
import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  profilePicture: {
    id: string;
    url: string | null;
  };
  password?: string | null;
  authProviders: {
    provider: string;
    providerId: string;
  }[];
  subscriptions: {
    id: string;
    customer: string;
    created: Date;
    status: string;
    startDate: Date;
    currentPeriodEnd: Date;
    nextPaymentAttempt: Date;
  };
}
const authProvidersSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ["google", "github", "credentials"],
  },
  providerId: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      trim: true,
      unique: [true, "Email already exist"],
      lowercase: true,
    },
    roles: {
      type: [String],
      default: ["user"],
      enum: userRoles,
    },
    profilePicture: {
      id: String,
      url: {
        type: String,
        default: null,
      },
    },
    password: {
      type: String,
      minlength: [8, "password should be at least 8 characters long"],
      select: false,
      default: null,
    },
    authProviders: {
      type: [authProvidersSchema],
      default: [],
    },
    subscriptions: {
      id: String,
      customer: String,
      created: Date,
      status: String,
      startDate: Date,
      currentPeriodEnd: Date,
      nextPaymentAttempt: Date,
    },
  },
  {
    timestamps: true,
  }
);
//encrypt password before saving user information

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
