import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatbotWrapper from '@/components/chatbot/ChatbotWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HANOTEX - Sàn Giao Dịch Công Nghệ Hà Nội',
  description: 'Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội - Kết nối doanh nghiệp, viện nghiên cứu và cá nhân trong lĩnh vực khoa học công nghệ',
  keywords: [
    'HANOTEX',
    'sàn giao dịch công nghệ',
    'Hà Nội',
    'khoa học công nghệ',
    'đấu giá công nghệ',
    'chuyển giao công nghệ',
    'sở hữu trí tuệ',
    'patent',
    'trademark',
    'TRL',
    'technology readiness level'
  ],
  authors: [{ name: 'HANOTEX Team' }],
  creator: 'HANOTEX',
  publisher: 'HANOTEX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'HANOTEX - Sàn Giao Dịch Công Nghệ Hà Nội',
    description: 'Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'HANOTEX',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HANOTEX - Sàn Giao Dịch Công Nghệ Hà Nội',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HANOTEX - Sàn Giao Dịch Công Nghệ Hà Nội',
    description: 'Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div className="min-h-full">
            <Header />
            {children}
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <ChatbotWrapper />
        </Providers>
      </body>
    </html>
  );
}

