import type { Metadata } from 'next'
import { Fraunces, DM_Sans, DM_Mono } from 'next/font/google'
import './styles/globals.css'
import { ModalProvider } from './context/ModalContext'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const dmSans   = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const dmMono   = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono' })

export const metadata: Metadata = {
  title: {
    default:  'DevConnect — Build together, ship faster',
    template: '%s | DevConnect',
  },
  description:
    'DevConnect connects IT Community to real open-source projects. Find your next team, apply in seconds, and start building.',
  icons: {
    icon:  '/logo-icon.jpeg',
    apple: '/logo-icon.jpeg',
  },
  openGraph: {
    title:       'DevConnect',
    description: 'Open-source developer collaboration platform',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('dc-theme');var t=s?JSON.parse(s).state?.theme:'dark';if(t!=='light')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})()`,
          }}
        />
      </head>
      <body className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable}`}>
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  )
}
