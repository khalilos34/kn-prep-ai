import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import User from "../models/user.model";

export const register = catchAsyncErrors(
  async (name: string, email: string, password: string) => {
    await dbConnect();
    const newUser = await User.create({
      name,
      email,
      password,
      authProviders: [{ provider: "credentials", providerId: email }],
    });
    return newUser._id
      ? { created: true }
      : (() => {
          throw new Error("User does not created");
        })();
  }
);
