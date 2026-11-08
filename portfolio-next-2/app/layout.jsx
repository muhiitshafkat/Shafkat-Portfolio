import './globals.css';

export const metadata = {
  title: 'Shafkat H Muhit | UI/UX Designer',
  description:
    'UI/UX designer from Dhaka with 5+ years of experience designing SaaS products, web apps and mobile interfaces for teams in Bangladesh, Canada and the US.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const fonts =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

// Marks the page as script-enabled before first paint, so reveal animations can start from their resting state.
// The timeout is a safety net: if anything stalls, every section becomes visible.
const boot =
  "document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('all-in')},4500);";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={fonts} />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
