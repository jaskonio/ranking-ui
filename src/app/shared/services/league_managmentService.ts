import { Injectable } from '@angular/core';
import { League, LeagueRunnerParticipant, Person } from '../../shared/services/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LeagueManagementService {

  updateRunnerParticipantsSelected(persons: Person[], leagueSelected?: League): LeagueRunnerParticipant[] {
    if (!leagueSelected) return [];

    const newParticipantsSelected: LeagueRunnerParticipant[] = [];
    const existingParticipantsMap = new Map<string, LeagueRunnerParticipant>();

    leagueSelected.runner_participants.forEach(rp => existingParticipantsMap.set(rp.person_id, rp));

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
}
