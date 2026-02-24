'use client';

import { useState } from 'react';
import { Button, Heading, TextField, BodyLong, Alert } from '@navikt/ds-react';
import { hentExistererPerson } from 'lib/services/arenaOpplagsService';
import { checkPersonExists } from 'app/sokOmPersonFinnes/actions';

export default function SokOmPersonFinnes() {
  const [fnr, setFnr] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ exists: boolean; searched: boolean }>({
    exists: false,
    searched: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fnr || fnr.length !== 11) {
      setError('Fødselsnummer må være 11 siffer');
      return;
    }

    setLoading(true);
    setError(null);
    setResult({ exists: false, searched: false });

    try {
      const exists = await checkPersonExists(fnr);
      setResult({ exists: Boolean(exists), searched: true });
    } catch (err) {
      setError('Noe gikk galt ved søk. Prøv igjen senere.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Heading size="large" spacing>
        Søk om person finnes i Arena
      </Heading>

      <BodyLong spacing>
        Skriv inn fødselsnummer for å sjekke om personen finnes i Arena-systemet.
      </BodyLong>

      <form onSubmit={handleSearch}>
        <TextField
          label="Fødselsnummer (11 siffer)"
          value={fnr}
          onChange={(e) => setFnr(e.target.value)}
          placeholder="11 siffer"
          maxLength={11}
          error={error}
        />

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          Søk
        </Button>
      </form>

      {result.searched && (
        <Alert
          variant={result.exists ? 'success' : 'info'}
          style={{ marginTop: '2rem' }}
        >
          {result.exists
            ? `Person med fødselsnummer ${fnr} finnes i Arena`
            : `Person med fødselsnummer ${fnr} finnes ikke i Arena`}
        </Alert>
      )}
    </div>
  );
}
