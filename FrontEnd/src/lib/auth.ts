import { NextAuthOptions } from 'next-auth'

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google" 
import Cookies from 'js-cookie'
import axios from 'axios'
import { useRouter } from 'next/navigation'



export const authConfig: NextAuthOptions = {
    session:{
        strategy: 'jwt'
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async redirect({ url, baseUrl }){
        
            return url.startsWith(baseUrl) ? url : "http://localhost:3000/"
        },
        // async jwt({ token, user, session }) {
        //      console.log("jwt: ", {token, user, session});
        //      Cookies.set('plan_ahead_google_user_token', token)
        //      return token;
        //  },
        // async session({ session, token, user }){
        //     console.log("session callback", {session, token, user});
        //     return session;
        // },
    }
};