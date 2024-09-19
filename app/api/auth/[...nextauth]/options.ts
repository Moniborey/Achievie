import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectMongoDB from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import User from '@/models/User'
// import Facebook from 'next-auth/providers/facebook'


export const options = {
    providers: [
        GoogleProvider({
            async profile(profile) {
                await connectMongoDB()
                let user = await User.findOne({ email: profile.email })

                if (!user) {
                    user = await new User({
                        userID: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture
                    }).save();
                }
                return {
                    ...profile,
                    id: profile.sub,
                }
            },
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "string", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    connectMongoDB()
                    const foundUser = await User.findOne({ email: credentials!.email }).lean().exec() as any

                    if (foundUser) {
                        const match = await bcrypt.compare(credentials!.password, foundUser.password)

                        if (match) {
                            const safeUser = { ...foundUser };
                            delete safeUser.password;
                            return safeUser;
                        }
                    }
                    else {
                        return null
                    }
                    return null;
                } catch (error) {
                    return NextResponse.json('Internal error', { status: 500 })
                }
            }
        })
        // Facebook({
        //     clientId:process.env.FACEBOOK_ID as string,
        //     clientSecret:process.env.FACEBOOK_SECRET as string
        // })
    ],
    pages: {
        signIn: '/auth/signIn',
        signUp: '/auth/signUp'
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id || user.userID
                token.image = user.picture || user.image
            }
            return token
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.id = token.id
                session.user.image = token.image
            }
            return session
        }
    }
}
