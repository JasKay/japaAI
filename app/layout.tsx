import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Poppins } from 'next/font/google'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space',
})


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-poppins',
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aliov - Your AI Relocation Assistant',
  description: 'Your personalized relocation guide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
