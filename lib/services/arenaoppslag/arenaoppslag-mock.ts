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
import Sak13676545Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13676545-mockdata.json';
import Sak13691130Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13691130-mockdata.json';
import Sak13304506Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13304506-mockdata.json';
import Sak13782028Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13782028-mockdata.json';
import Sak13781846Mockdata from 'lib/services/arenaoppslag/mockdata/sak-13781846-mockdata.json';

export function getMockSakFraArena(saksId: string): SakDTO | null {
  switch (saksId) {
    case '13721953':
      return Sak13721953Mockdata as SakDTO;
    case '13725526':
      return Sak13725526Mockdata as SakDTO;
    case '13322363':
      return Sak13322363Mockdata as SakDTO;
    case '13361135':
      return Sak13361135Mockdata as SakDTO;
    case '13397613':
      return Sak13397613Mockdata as SakDTO;
    case '13409999':
      return Sak13409999Mockdata as SakDTO;
    case '13697921':
      return Sak13697921Mockdata as SakDTO;
    case '13469475':
      return Sak13469475Mockdata as SakDTO;
    case '13335922':
      return Sak13335922Mockdata as SakDTO;
    case '13339857':
      return Sak13339857Mockdata as SakDTO;
    case '13676545':
      return Sak13676545Mockdata as SakDTO;
    case '13691130':
      return Sak13691130Mockdata as SakDTO;
    case '13304506':
      return Sak13304506Mockdata as SakDTO;
    case '13782028':
      return Sak13782028Mockdata as SakDTO;
    case '13781846':
      return Sak13781846Mockdata as SakDTO;
    default:
      return null;
  }
}
