import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

type GitHubEmail = {
  email: string;
  primary?: boolean;
  verified?: boolean;
};

type GitHubProfile = {
  id: number;
  login: string;
  name?: string | null;
  email?: string | null;
  email_verified?: boolean;
  avatar_url?: string | null;
};

const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getRequiredEnvFrom = (keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  throw new Error(
    `Missing required environment variable: one of ${keys.join(", ")}`,
  );
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: getRequiredEnvFrom(["AUTH_SECRET", "NEXTAUTH_SECRET"]),
  providers: [
    GitHub({
      clientId: getRequiredEnv("GITHUB_ID"),
      clientSecret: getRequiredEnv("GITHUB_SECRET"),
      authorization: {
        params: {
          scope: "read:user user:email",
          allow_signup: "false",
        },
      },
      userinfo: {
        async request({
          tokens,
        }: {
          tokens: { access_token?: string };
        }) {
          const profile = (await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "User-Agent": "authjs",
            },
          }).then(async (res) => await res.json())) as GitHubProfile;

          if (!profile.email) {
            const emails = (await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                "User-Agent": "authjs",
              },
            }).then(async (res) =>
              res.ok ? ((await res.json()) as GitHubEmail[]) : [],
            )) as GitHubEmail[];

            const primaryEmail = emails.find((email) => email.primary) ?? emails[0];

            profile.email = primaryEmail?.email;
            profile.email_verified = primaryEmail?.verified ?? false;
          } else {
            profile.email_verified = true;
          }

          return profile;
        },
      },
      checks: ["state"],
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: getRequiredEnv("GOOGLE_ID"),
      clientSecret: getRequiredEnv("GOOGLE_SECRET"),
      authorization: {
        params: {
          prompt: "consent select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      checks: ["pkce", "state"],
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    signIn({ account, profile }) {
      if (!account) return false;

      if (account.provider === "google") {
        const googleProfile = profile as
          | { email?: string | null; email_verified?: boolean }
          | undefined;
        if (!googleProfile?.email) return false;
        if (googleProfile?.email_verified === false) return false;
      }

      if (account.provider === "github") {
        const githubProfile = profile as
          | { email?: string | null; email_verified?: boolean }
          | undefined;
        if (githubProfile && !githubProfile.email) return false;
        if (githubProfile?.email_verified === false) return false;
      }

      return true;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
