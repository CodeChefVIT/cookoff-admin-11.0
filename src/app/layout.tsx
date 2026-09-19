import AreyBC from '@/components/AreyBC';
import Sidebar from '@/components/ui/sidebar';

import '@/styles/globals.css';

import { type Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://portal.codechefvit.com'),
  title: 'Cookoff Admin',
  description: 'Made with ♡ by CodeChef-VIT',
  icons: [{ rel: 'icon', url: '/cc-logo.svg' }],
  openGraph: {
    title: 'CodeChef-VIT',
    images: [{ url: '/open-graph.png' }],
    url: 'https://portal.codechefvit.com',
    type: 'website',
    description: 'Made with ♡ by CodeChef-VIT',
    siteName: 'CodeChef-VIT',
  },
  applicationName: 'CodeChef-VIT',
  keywords: ['CodeChef', 'VIT', 'Vellore Institute of Technology', 'CodeChef-VIT', 'Cookoff'],
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className="h-full"
      style={
        {
          '--font-sans': 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          '--font-geist-sans': 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          '--font-display': 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        } as React.CSSProperties
      }
    >
      <body>
        <Sidebar />
        <div className="z-0 bg-black">
          <Toaster position="top-right" toastOptions={{ id: '_toast' }} />
          <AreyBC>{children}</AreyBC>
        </div>
      </body>
    </html>
  );
}
