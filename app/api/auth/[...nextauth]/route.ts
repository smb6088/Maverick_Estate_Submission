import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import retrieveDB from "@/lib/retrieveDB"
import User from "@/models/UserModel"
import bcrypt from "bcrypt"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session:  {strategy: "jwt", maxAge: 30 * 24 * 60 * 60,}, 
  providers: [CredentialsProvider({ name: "Credentials",credentials: {email: { label: "Email", type: "email" },password: { label: "Password", type: "password" },},
      async authorize(credentials) {
        await retrieveDB()
        const user = await User.findOne({ email: credentials?.email })
        if (!user) {
          throw new Error("Account does not exist")
        }
        if (!user.verified) {
          throw new Error("Please verify your email before logging in.")
        }
        if (!(await bcrypt.compare(credentials!.password, user.password))) {
          throw new Error("Incorrect Password")
        }
        return {username: user.username, id: user._id.toString(), email: user.email,}
      }
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: { async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-ignore
        token.username = user.username
      }
      return token
    }, async session({ session, token }) {
      if (token?.id && session.user) {
        // @ts-ignore
        session.user.id = token.id
        // @ts-ignore
        session.user.username = token.username
      }
      return session
    },
  },
})
export { handler as GET, handler as POST }