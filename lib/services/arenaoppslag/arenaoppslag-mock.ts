import { SakDTO } from 'lib/services/arenaoppslag/arenaoppslag-types';
import Sak13721953Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13721953-mockdata.json';
import Sak13725526Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13725526-mockdata.json';
import Sak13322363Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13322363-mockdata.json';
import Sak13361135Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13361135-mockdata.json';
import Sak13397613Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13397613-mockdata.json';
import Sak13409999Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13409999-mockdata.json';
import Sak13697921Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13697921-mockdata.json';
import Sak13469475Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13469475-mockdata.json';
import Sak13335922Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13335922-mockdata.json';
import Sak13339857Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13339857-mockdata.json';

export function getMockSakFraArena(saksId: string): SakDTO | null {
  switch (saksId) {
    case '13721953':
      return Sak13721953Mockdata;
    case '13725526':
      return Sak13725526Mockdata;
    case '13322363':
      return Sak13322363Mockdata;
    case '13361135':
      return Sak13361135Mockdata;
    case '13397613':
      return Sak13397613Mockdata;
    case '13409999':
      return Sak13409999Mockdata;
    case '13697921':
      return Sak13697921Mockdata;
    case '13469475':
      return Sak13469475Mockdata;
    case '13335922':
      return Sak13335922Mockdata;
    case '13339857':
      return Sak13339857Mockdata;
    default:
      return null;
  }
}
