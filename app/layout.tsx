import './globals.css';
import styles from './page.module.css';
import { Header } from 'components/header/Header';

export const metadata = {
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
        <Header />
        <main className={styles.main}>
          <div className={styles.content}>
            <section>{children}</section>
          </div>
        </main>
      </body>
    </html>
  );
}
