import dbConnect from "@/database/config/dbConnect";
import User from "@/database/models/user.model";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("Invalid email");
        }

        const isPasswordMatched = await bcrypt.compare(
          credentials?.password || "",
          user.password || ""
        );

        if (!isPasswordMatched) {
          throw new Error("Password mismatch");
        }

        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      await dbConnect();
      if (account?.provider === "credentials") {
        user.id = user._id;
      } else {
        const existingUser = await User.findOne({ email: user?.email });
        if (!existingUser) {
          const newUser = new User({
            email: user?.email,
            name: user?.name,
            profilePicture: { url: profile?.image || user?.image },
            authProviders: [
              {
                provider: account?.provider,
                providerId: profile?.id || profile?.sub,
              },
            ],
          });
          await newUser.save();
          user.id = newUser._id;
        } else {
          const existingProvider = existingUser.authProviders.find(
            (provider: { provider: string }) =>
              provider.provider === account?.provider
          );
          if (!existingProvider) {
            existingUser.authProviders.push({
              provider: account?.provider,
              providerId: profile?.id || profile?.sub,
            });
            if (!existingUser.profilePicture.url) {
              existingUser.profilePicture = {
                url: profile?.image || user?.image,
              };
            }
            await existingUser.save();
          }
          user.id = existingUser._id;
        }
      }

      return true;
    },
    async jwt({ token, user }: any) {
      console.log("first token", user);
      if (user) {
        token.user = user;
      } else {
        await dbConnect();
        const dbUser = await User.findById(token.user.id);
        if (dbUser) {
          token.user = dbUser;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
