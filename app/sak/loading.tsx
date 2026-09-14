import StorLoader from 'components/felleskomponenter/loader/loader';

// Ligger over app/sak/[saksId]/layout.tsx, slik at spinneren kan vises med en gang ved navigasjon
// hit - layouten henter data og kan derfor ikke rendres umiddelbart.
export default function Loading() {
  return <StorLoader />;
}
