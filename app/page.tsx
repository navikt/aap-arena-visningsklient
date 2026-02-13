import styles from './page.module.css';
import { BodyLong, Heading } from '@navikt/ds-react';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <img className={styles.logo} src="/nav_logo.png" alt="NAV-logo" />
        <Heading size="medium">Hello world, fra arena-visningsklient</Heading>
        <BodyLong size="medium">
          Her kommer en visningsklient som skal vise data fra Arena. Fokuset kommer til å være historiske data, og
          f.eks. vise hva som var lagt inn i en historisk sak i Arena etter brukeren er migrert til Kelvin.
        </BodyLong>
      </section>
    </main>
  );
}
