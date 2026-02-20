import './globals.css';
import styles from './page.module.css';

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
        <main className={styles.main}>
          <div className={styles.content}>
            <img className={styles.logo} src="/nav_logo.png" alt="NAV-logo" />
            <section>{children}</section>
          </div>
        </main>
      </body>
    </html>
  );
}
