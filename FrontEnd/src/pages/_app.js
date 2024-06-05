import '../assets/css/globals.css'
import '../assets/css/page.module.css'
import '../assets/css/dashboard.css'
import '../assets/css/sidebar.css'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  )
}
