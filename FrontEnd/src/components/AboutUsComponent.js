// This line is no longer needed as we're not using JSX syntax
// // import React from 'react';

import Layout from './Layuot'
import React from 'react';

export default function AboutUsPage({ title }) {
    return (
        <Layout
            pageTitle={title}
        >
            <div className="min-h-screen flex flex-col">
                <div className="m-auto">
                    <h1 className="text-4xl">Hello User</h1>
                    <p className="text-lg mt-4">Welcome to our website!</p>
                    <img src="./home.png" alt="Description of the image" className="mt-4" />
                </div>
            </div>
        </Layout>
    );
}

