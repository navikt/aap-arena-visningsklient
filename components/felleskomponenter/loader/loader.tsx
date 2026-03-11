import styles from './loader.module.css';
import { Loader } from '@navikt/ds-react';

export default function StorLoader() {
  return (
    <section className={styles.loaderContainer}>
      <Loader size="3xlarge" title="Laster..." />
    </section>
  );
}
