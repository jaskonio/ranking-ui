import { Injectable } from '@angular/core';
import { League, LeagueRace, LeagueRunnerParticipant, Person, Race } from '../../shared/services/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LeagueManagementService {

  updateRunnerParticipantsSelected(persons: Person[], leagueSelected?: League): LeagueRunnerParticipant[] {
    if (!leagueSelected) return [];

    const newParticipantsSelected: LeagueRunnerParticipant[] = [];
    const existingParticipantsMap = new Map<string, LeagueRunnerParticipant>();

    leagueSelected.runner_participants?.forEach(rp => existingParticipantsMap.set(rp.person_id, rp));

    persons.forEach(person => {
      const existingParticipant = existingParticipantsMap.get(person.id);
      if (existingParticipant) {
        newParticipantsSelected.push(existingParticipant);
      } else {
        newParticipantsSelected.push(this.createNewParticipant(person));
      }
    });

    return newParticipantsSelected;
  }

  updateRacesLeagueSelected(races:Race[], leagueSelected?: League): LeagueRace[] {
    if (!leagueSelected) return [];

    const newRacesSelected: LeagueRace[] = [];
    const existingRaceMap = new Map<string, LeagueRace>();

    leagueSelected.races?.forEach(r => existingRaceMap.set(r.name, r));

    races.forEach(race => {
      const existingParticipant = existingRaceMap.get(race.name);
      if (existingParticipant) {
        newRacesSelected.push(existingParticipant);
      } else {
        newRacesSelected.push(this.createNewRaceLeague(race));
      }
    });

    return newRacesSelected;
  }

  private createNewParticipant(person: Person): LeagueRunnerParticipant {
    return {
      id: person.id,
      first_name: person.first_name,
      last_name: person.last_name,
      gender: person.gender,
      photo_url: person.photo_url,
      person_id: person.id,
      category: '',
      disqualified_order_race: -1,
      dorsal: 0,
      unique_dorsal: true,
    };
  }

  private createNewRaceLeague(race:Race): LeagueRace {
    return {
      id: race.id,
      name:race.name,
      order:0,
    }
  }
}
