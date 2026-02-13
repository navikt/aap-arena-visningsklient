import './globals.css';

export const metadata = {
  title: 'Kelvin',
  description: 'Arena-visningsklient',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
