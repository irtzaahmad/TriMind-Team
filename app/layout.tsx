import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/hooks/useLanguage';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const notoUrdu = Noto_Nastaliq_Urdu({
  variable: '--font-urdu',
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'OmniPlus | اومنی پلس - AI for Accessible Healthcare',
  description:
    'Empowering Pakistani patients and families to understand prescriptions, medicines, and medical reports in Urdu, Roman Urdu, and English with live multimodal Gemini AI.',
  keywords: [
    'OmniPlus',
    'اومنی پلس',
    'Urdu Healthcare AI',
    'Medicine Explainer Pakistan',
    'Lab Report Explainer Urdu',
    'SDG 3 Good Health',
    'Gemini Healthcare AI',
  ],
  authors: [{ name: 'OmniPlus Team · Minhaj University AI Hackathon' }],
  openGraph: {
    title: 'OmniPlus | اومنی پلس - AI for Accessible Healthcare',
    description:
      'Understand medicines and lab reports in your own language. Built for elderly and low-literacy patients with live Gemini multimodal AI.',
    siteName: 'OmniPlus',
    locale: 'ur_PK',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" dir="rtl" className={`${inter.variable} ${notoUrdu.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white pb-16 md:pb-0">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
