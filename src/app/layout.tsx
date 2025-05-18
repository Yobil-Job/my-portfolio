
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/core/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/core/Header';
import { Footer } from '@/components/core/Footer';
import { HiddenTerminalProvider } from '@/contexts/TerminalContext';
import { ClientOnlyHiddenTerminal } from '@/components/core/ClientOnlyHiddenTerminal';
import { BalancerProvider } from '@/components/core/BalancerProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Eyob's Portfolio",
  description: 'Portfolio of Eyob Weldetensay, Backend Developer & Aspiring Cloud Engineer.',
  icons: {
    icon: '/images/favicon-32x32.png', // Path relative to the public directory
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BalancerProvider>
            <HiddenTerminalProvider>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
              <Toaster />
              <ClientOnlyHiddenTerminal />
            </HiddenTerminalProvider>
          </BalancerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
