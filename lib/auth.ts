import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import {Role} from "@/app/generated/prisma";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await prisma.user.findUnique({
                    where: {email: credentials.email as string},
                });
                if (!user || !user.password) return null;
                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password,
                );
                return passwordsMatch
                    ? {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                    }
                    : null;
            },
        }),
    ],
    callbacks: {
        async jwt({token, user, trigger, session}) {
            if (user) {
                token.id = user.id;
                token.image = user.image;
                token.name = user.name;
                token.role = (user as any).role ?? Role.CUSTOMER;
            }
            if (trigger === "update" && session) {
                if (session.image !== undefined) token.image = session.image;
                if (session.name !== undefined) token.name = session.name;
            }
            return token;
        },
        async session({session, token}) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            if (token?.image) {
                session.user.image = token.image as string;
            }
            return session;
        },
    },
});