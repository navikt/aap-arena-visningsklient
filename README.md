# Visningklient for arena og arena-migrering

Dette er en enkel visningsklient for Arena etter arena er skrudd av. Den har litt ulike ting den skal fungere for:

- Innsyk i historiske data fra arena etter saker er migrert til Kelvin
- Visning av diverse støtte-funksjonalitet i forbindelse med migrerinngen

## Førstegangsoppsett

Dette oppsettet forutsetter at du har følgende programvare installert:

- Node.js 26 (NVM anbefales: `nvm install` / `nvm use` leser `.nvmrc` automatisk)
- pnpm (`npm install -g pnpm@11.0.9`)
- dotenv (`npm install -g dotenv-cli`)
- Docker med colima og docker-compose, dotenv

### Sett opp GitHub token

1. Gå inn på GitHub under brukeren din på Settings -> Developer settings
2. Velg Personal access tokens -> Tokens (classic) -> Generate new token (classic)
3. Gi token et navn, sett utløpsdato og huk av for `read:packages`-rettighet
4. Klikk Generate token og kopier tokenet (Det forsvinner fra siden)
5. Klikk Configure SSO -> Authorize for navikt-organisasjonen
6. Legg inn miljøvariabel med token i ~/.bashrc eller ~/.zshrc:
   ```
   export NODE_AUTH_TOKEN=<token-her>
   ```
   Husk å kjøre `source ~/.bashrc` eller `source ~/.zshrc` etterpå for å laste inn endringene, evt start terminal på nytt.

### Bruke eksisterende token

Har du Kelvin sitt oppsett for NPM, kan du gjøre
`export NODE_AUTH_TOKEN=$NPM_AUTH_TOKEN` i ~/.zshrc

### Linting og formattering

Prosjektet bruker oxlint og oxfmt. Skru gjerne på støtte for disse i din IDE.

#### Autoformatering i IntelliJ med File Watchers

For å kjøre oxfmt automatisk ved lagring, sett opp en File Watcher:

1. Åpne **Settings → Tools → File Watchers** og klikk **+** for å legge til en ny.
2. Fyll inn feltene:
   - **Name:** `oxfmt`
   - **File type:** `TypeScript` (legg til en watcher til for `TypeScript JSX` om ønskelig)
   - **Scope:** `Current File`
   - **Program:** `pnpm`
   - **Arguments:** `exec oxfmt "$FilePath$"`
   - **Output paths to refresh:** `$FilePath$`
   - **Working directory:** `$ProjectFileDir$`
3. Huk av for **Auto-save edited files to trigger the watcher** og fjern haken for **Create output file from stdout**.
4. Klikk **OK** og lagre innstillingene.

oxfmt vil nå formatere filen automatisk hver gang du lagrer.

## Kjøre opp lokalt mot lokal backend

1. Installer avhengigheter og start applikasjonen:
   ```bash
   pnpm install
   pnpm dev:local
   ```
   Applikasjonen skal nå være tilgjengelig i nettleseren på http://localhost:3000 \
   **OBS:** Husk å starte backend-tjenestene lokalt også, etter egen oppskrift.

## Kjøre opp lokalt mot devmiljø

Oppsettet bruker [localauth](https://github.com/navikt/localauth), så du trenger ingen secrets lokalt. Wonderwall håndterer innlogging og Texas veksler til OBO-tokens, begge mot teamets localauth-instans.

1. Hent konfigurasjon fra localauth (krever naisdevice):

   ```bash
   curl -s https://localauth-aap.intern.dev.nav.no/entraid/env > .env.localauth
   ```

2. Start Wonderwall og Texas:

   ```bash
   colima start
   docker-compose up -d
   ```

3. Installer avhengigheter og start applikasjonen:
   ```bash
   pnpm install
   pnpm dev:dev-gcp
   ```
   Applikasjonen skal nå være tilgjengelig i nettleseren på http://localhost:4000

Tjenestene appen kaller (for eksempel `tilgang` og `arenaoppslag`) må tillate innkommende kall fra `localauth` i sin `accessPolicy`.

## Legge til nye integrasjoner

Om man legger til nye integrasjoner må man husle å oppdatere følgende

- Legge til accessPolicy i `nais.yaml`
- Legge til miljøviabler for baseUrl og Scope i `dev.yaml` og `prod.yaml`
- Legg til scope og base-url for tjenesten i dev i `.env.dev-gcp-extra`
- Legge til `localauth` som inbound i tjenestens `accessPolicy` (i dev)
- Legg til scope, base-url og endepunkt for å hente ut mock-token lokalt i `.env.local-backend`
- Lage en mock-implementasjon av service, som returnerer mock-data om `mocksEnabled()` er true

## Rydd opp før ny oppstart

Dersom du opplever rare feilmeldinger kan det hende at ting er kjørt opp i feil rekkefølge eller at noe har hengt seg opp.
Disse kommandoene kan hjelpe deg med å rydde opp før du prøver på nytt:

```bash
    docker-compose down
```

```bash
    pkill -9 ^next-server
```

## Diverse nyttige kommandoer

### Unleash

Serverkode kan sjekke feature-flagg med `erFeatureFlaggAktivert(flaggNavn)` fra
`lib/services/unleash/unleash-service.ts`. Tjenesten gjenbruker én Unleash-klient.

Hvis `UNLEASH_SERVER_API_URL` mangler eller er tom, brukes en mock som aktiverer alle flagg.
Når URL-en er satt, må også `UNLEASH_SERVER_API_TOKEN` og `UNLEASH_SERVER_API_ENV` være konfigurert.
Nais-manifestet henter disse fra secreten `kelvin-unleash-api-token` og tillater utgående trafikk til
`aap-unleash-api.nav.cloud.nais.io`.

### Tilgang til kvotehistorikk

Når Unleash-flagget `AutoriserteEndepunkterHosArenaoppslag` er `false`, brukes `autorisert = true` for kvotehistorikk.
Når flagget er `true`, brukes ressursens konfigurerte verdi. Den er nå `true`, så kvotehistorikk bruker det
autoriserte endpointet i begge tilfeller. Andre sakressurser påvirkes ikke.
Alle Arenaoppslag-endepunkter kan returnere `403`. Tjenestene returnerer da `TilgangAvvist`.
Saksoppslagets tilgangsresultat styrer den felles meldingen «Ikke tilgang til sak» i saks-layouten.
Hvis bare kvotehistorikk avviser tilgang, viser kvotesiden den samme meldingen i stedet for en tom side.
Bare kvotehistorikk velger mellom autorisert og ordinært endpoint. Foreløpig er det bare backend-endpointet for
kvotehistorikk som håndhever tilgangskontrollen. Andre feil viser fortsatt den vanlige feilmeldingen.

### Kjøring av tester

For å kjøre tester lokalt, bruk følgende kommando:

```bash
  pnpm test
```

### Oppdatere avhengigheter

For å forhindre utilsiktede endringer i `pnpm-lock.yaml` er man tvunget til å alltid kjøre følgende kommando når man vil oppdatere avhengigheter:

```bash
  pnpm install --no-frozen-lockfile
```

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.

Dette repoet er satt opp for AI-agenter med tydelige instruksjoner:

- `AGENTS.md` er hovedkilden for regler og prioritering av instruksjoner.
- `.github/copilot-instructions.md` skal holdes minimal og bare peke til `AGENTS.md`.
- `docs/ai/agent-guidelines-template.md` brukes kun for scope-spesifikke tillegg (ikke duplisering av globale regler).

Tips for nye oppgaver til AI:

- Beskriv hva som skal endres (konkret scope).
- Nevn om atferd skal bevares eller endres.
- Be om testoppdateringer ved logikkendringer.
- Be AI følge styling-kontrakten (Aksel-først, CSS Modules, kun Aksel-tokens).

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-aap-åpen

PEtter tester PR men det er noe som er rart
