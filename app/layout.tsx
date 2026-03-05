import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'TFRC Engenharia - Levantamento Quantitativo',
  description: 'Ficha técnica para levantamento quantitativo de obras e vistorias de engenharia.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">{children}</body>
    </html>
  );
}
