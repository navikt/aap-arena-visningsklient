# Visningklient for arena og arena-migrering

Dette er en enkel visningsklient for Arena etter arena er skrudd av. Den har litt ulike ting den skal fungere for:
* Innsyk i historiske data fra arena etter saker er migrert til Kelvin
* Visning av diverse støtte-funksjonalitet i forbindelse med migrerinngen

## Førstegangsoppsett

Dette oppsettet forutsetter at du har følgende programvare installert:

- Node.js
- Corepack (Kommer med Node.js og håndterer riktig versjon av yarn for deg, må aktiveres med `corepack enable`)
- Docker med colima og docker-compose

### Sett opp GitHub token

1. Gå inn på GitHub under brukeren din på Settings -> Developer settings
2. Velg Personal access tokens -> Tokens (classic) -> Generate new token (classic)
3. Gi token et navn, sett utløpsdato og huk av for `read:packages`-rettighet
4. Klikk Generate token og kopier tokenet (Det forsvinner fra siden)
5. Klikk Configure SSO -> Authorize for navikt-organisasjonen
6. Legg inn miljøvariabel med token i ~/.bashrc eller ~/.zshrc:
   ```
   export NPM_AUTH_TOKEN=<token-her>
   ```
   Husk å kjøre `source ~/.bashrc` eller `source ~/.zshrc` etterpå for å laste inn endringene, evt start terminal på nytt.

### Prettier og linting

Prosjektet bruker prettier og eslint. Skru gjerne på "Automatic configuration" for disse i din IDE.


## Kjøre opp lokalt mot lokal backend

1. Installer avhengigheter og start applikasjonen:
   ```bash
   yarn install
   yarn dev:local
   ```
   Applikasjonen skal nå være tilgjengelig i nettleseren på http://localhost:3000 \
   **OBS:** Husk å starte backend-tjenestene lokalt også, etter egen oppskrift.

## Kjøre opp lokalt mot devmiljø

1. Hent secret (se: https://github.com/navikt/aap-cli)
   ```bash
   get-secret
   ```
2. Start Wonderwall:
   ```bash
   colima start
   docker-compose up -d
   ```

3. Hent ned OBO-tokens
   ```bash
   ./token-generator.sh
   ```

4. Installer avhengigheter og start applikasjonen:
   ```bash
    yarn install
    yarn dev:dev-gcp
   ```
   Applikasjonen skal nå være tilgjengelig i nettleseren på http://localhost:4000

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

### Kjøring av tester

For å kjøre tester lokalt, bruk følgende kommando:

```bash
  yarn test
```

### Oppdatere avhengigheter

For å forhindre utilsiktede endringer i `yarn.lock` er man tvunget til å alltid kjøre følgende kommando når man vil oppdatere avhengigheter:

```bash
  yarn install --no-immutable
```


## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-aap-åpen
