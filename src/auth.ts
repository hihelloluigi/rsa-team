import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Sign-in is restricted to one GitHub account: the admin writes to this repo,
// so anyone who can sign in can change the site. The allowed login is
// configuration rather than a literal, but it fails closed — an unset variable
// lets nobody in rather than everybody.
const ALLOWED = process.env.ADMIN_GITHUB_LOGIN?.toLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      // The repo is public, so this is the narrow scope that can still commit.
      authorization: { params: { scope: "read:user public_repo" } },
    }),
  ],
  callbacks: {
    signIn({ profile }) {
      const login = (profile?.login as string | undefined)?.toLowerCase();
      return Boolean(ALLOWED && login && login === ALLOWED);
    },
    jwt({ token, account, profile }) {
      // Kept so the commit is authored by whoever signed in, rather than by a
      // separate bot token that would have to be stored somewhere.
      if (account?.access_token) token.githubToken = account.access_token;
      if (profile?.login) token.login = profile.login as string;
      return token;
    },
    session({ session, token }) {
      session.githubToken = token.githubToken as string | undefined;
      session.login = token.login as string | undefined;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    githubToken?: string;
    login?: string;
  }
}
