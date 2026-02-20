import './globals.css';
import styles from './page.module.css';

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
      <body>
        <main className={styles.main}>
          <section className={styles.content}>{children}</section>
        </main>
      </body>
    </html>
  );
}
