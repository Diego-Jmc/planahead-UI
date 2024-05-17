import React, { useEffect } from 'react'
import Layout from './Layuot'
import isUserAuth from '../utils/auth'
import { useRouter } from 'next/navigation'

export default function HomePage({ title }) {

    const router = useRouter()

    useEffect(() => {

            if (!isUserAuth()) {
                console.log('user is not authenticated');
                router.push('/login');
            } else {
                console.log('user is authenticated');
            }
        
    }, [isUserAuth]);


    return (
        <Layout
            pageTitle={title}
        >
            <div className="min-h-screen flex flex-col">
                <div className="m-auto">
                    <h1 className="text-4xl">{title}</h1>
                </div>
            </div>
        </Layout>
    )
}
