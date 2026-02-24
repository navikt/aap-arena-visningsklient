import './globals.css';
import styles from './page.module.css';
import type { Metadata } from 'next';
import { ClientHeader } from 'components/header';

export const metadata: Metadata = {
  title: 'Kelvin - Visningsklient for Arena',
  description: 'Arena-visningsklient',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">


    <body>
    <ClientHeader/>
    <main className={styles.main}>
          <div className={styles.content}>
            <section>{children}</section>
          </div>
        </main>
      </body>
    </html>
  );
}
