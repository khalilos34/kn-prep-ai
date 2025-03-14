"use server";

import { register } from "@/database/controllers/auth.controller";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  return await register(name, email, password);
};
