'use server';

import styles from './page.module.css';
import { isProd } from 'lib/utils/environment';
import { DevContent } from 'app/dev-content';
import { ProdContent } from 'app/prod-content';
import { VStack } from '@navikt/ds-react';

export default async function Home() {
  return (
    <section className={styles.content}>
      <VStack gap="space-32">
        {<ProdContent />}
        {!isProd() && <DevContent />}
      </VStack>
    </section>
  );
}
