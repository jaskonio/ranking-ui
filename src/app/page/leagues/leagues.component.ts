import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LeagueService } from '../../shared/services/league.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PersonService } from '../../shared/services/person.service';
import { League, PersonResponse, RaceLeague, RaceResponse, RunnerParticipant } from '../../shared/services/interfaces';
import { RaceService } from '../../shared/services/race.service';
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { ConlumnsDefinition, TableConfiguracion } from '../../shared/interfaces/interfaces';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-leagues',
  standalone: true,
  imports: [
    CommonModule,
		FormsModule,
		InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    NgTableComponent,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.scss'
})
export class LeaguesComponent implements OnDestroy{
  allLeagues: League[] = []
  addLeagueForm = new FormGroup({});

  allPersons:PersonResponse[] = []
  allRunnerParticipant:RunnerParticipant[] = []

  allRaces:RaceResponse[]= []
  allRacesLeague:RaceLeague[] =[]

  runnerParticipantsSelected: RunnerParticipant[] = []
  raceLeagueSelected: RaceLeague[] = []

  formGroupPersons = new FormGroup({
    participantsSelectedControl: new FormControl<RunnerParticipant[]>([], [])
  });

  raceFormGroup = new FormGroup({
    raceLeagueSelectedControl: new FormControl<RaceLeague[]>([], [])
  });

  _leagueSelected:League|undefined

  get leagueSelected() {
    return this._leagueSelected
  }

  set leagueSelected(item) {
    this._leagueSelected = item

    this.updateRunnerParticipantsOptions();
    this.updateRaceLeagueOptions();
  }

  private destroy$ = new Subject<void>();

  private runnerParticipantsColumnsDefinition: ConlumnsDefinition[] = [
    {
      "key": "id",
      "value": "ID",
      "order": 99,
      "visible": false,
      "foreign_key": true
    },
    {
      "key": "photo_url",
      "value": "Foto",
      "order": 1
    },
    {
      "key": "first_name",
      "value": "Nombre",
      "order": 2,
      "supportImageKey": "photo_url",
      "supportFilter": true
    },
    {
      "key": "last_name",
      "value": "Apellido",
      "order": 3,
      "supportFilter": true
    },
    {
      "key": "gender",
      "value": "Genero",
      "order": 4
    },
    {
      "key": "dorsal",
      "value": "Dorsal",
      "order": 5,
      "editable": true,
      "type": "number"
    },
    {
      "key": "disqualified_order_race",
      "value": "Nº Carrera descalificado/a",
      "order": 6,
      "editable": true,
      "type": "number"
    }
  ]

  private runnerParticipantsTableConfiguration:TableConfiguracion = {
    title: "Participantes",
    paginator: true,
    editableRow: true,
    rowsPerPageOptions: [5, 10, 20, 100],
    rows: 10,
    showCurrentPageReport: true,
  }

  private raceLeagueColumnDefinition: ConlumnsDefinition[] = [
    {
      "key": "name",
      "value": "Nombre",
      "order": 1,
      "supportFilter": true,
      "foreign_key": true
    },
    {
      "key": "order",
      "value": "Orden",
      "order": 2,
      "supportFilter": true,
      "editable": true,
      "type": "number"
    }
  ]

  private raceLeagueTableConfiguration:TableConfiguracion = {
    title: "Carreras",
    paginator: true,
    editableRow: true,
    rowsPerPageOptions: [5, 10, 50],
    rows: 10,
    showCurrentPageReport: true,
  }

  constructor(
    private notificationService:MessageService,
    private leagueService:LeagueService,
    private personService:PersonService,
    private raceService:RaceService){
  }

  ngOnInit() {
    this.addLeagueForm = new FormGroup({});
    let name_control = new FormControl('', [Validators.required, Validators.maxLength(50)])
    this.addLeagueForm.setControl('name', name_control)

    this.leagueService.allLeagues$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.allLeagues = data ?? []
    });

    this.reloadAllPersons()
    this.reloadAllRaces()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmitAddNewLeague() {
    console.log("onSubmitAddNewLeague")
    console.log(this.addLeagueForm.value)

    this.leagueService.save_item(this.addLeagueForm.value).subscribe(
      {
        next: (value) => {
          console.log(value);
          this.notificationService.add({ severity: 'success', summary: 'Successful', detail: 'Liga añadida correctamente', life: 3000 })
        },
        error: err => this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 }),
        complete: () => {
          console.log('end ad league');
          this.leagueService.reloadData();
        }
      }
    )
  }

  reloadAllPersons() {
    this.personService.get_data().subscribe(
      {
        next:(value) => {
          console.log("reloadAllPersons");
          console.log(value);
          this.allPersons = value;
        },
        error: err => this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 }),
        complete: () => {
          this.allLeagues
          console.log('end getAll')
        }
      }
    )
  }

  reloadAllRaces() {
    this.raceService.get_data().subscribe(
      {
        next: (value) => {
          console.log("next reloadAllRaces")
          console.log(value)
          this.allRaces = value
          this.allRacesLeague = this.allRaces.map( race => {
            let raceLeague:RaceLeague = {
              name: race.name,
              order: 0,
              race_info_id: race.id
            }

            return raceLeague
          })
        },
        error: err => this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 }),
        complete: () => {
          this.allLeagues
          console.log('end reloadAllRaces')
        }
      }
    )
  }

  // Runner Participants
  updateRunnerParticipantsOptions() {
    if (this.leagueSelected == undefined) {
      return;
    }

    this.allRunnerParticipant = []

    this.allPersons.map(p => {
        let newRP: RunnerParticipant = {...p}
        newRP.dorsal = -1
        newRP.disqualified_order_race = -1
        newRP.person_id = p.id
        this.allRunnerParticipant.push(newRP)
      }
    )

    let personSelected:RunnerParticipant[] = []

    if (this.leagueSelected.runner_participants) {
      this.leagueSelected.runner_participants.map( rp => {
        this.allRunnerParticipant.map( p => {
          if(rp.person_id == p.id) {
            p.dorsal = rp.dorsal
            p.disqualified_order_race = rp.disqualified_order_race
            personSelected.push(p)
          }
        })
      })
    }
    this.formGroupPersons.get('participantsSelectedControl')?.setValue([])
    this.formGroupPersons.get('participantsSelectedControl')?.setValue(personSelected)
    this.updateRunnerParticipantsSelected()
  }

  getRunnerParticipants() {
    return this.allRunnerParticipant
  }

  getRunnerParticipantsColumns() {
    return this.runnerParticipantsColumnsDefinition
  }

  onChangeRunnerParticipantCombo(event:any) {
    this.updateRunnerParticipantsSelected()
  }

  updateRunnerParticipantsSelected() {
    let control = this.formGroupPersons.get('participantsSelectedControl')

    if (control == undefined || control.value == null) {
      return;
    }

    let itemsSelected:RunnerParticipant[] = control.value

    itemsSelected = itemsSelected.map(item => {
      if (this.leagueSelected == undefined || this.leagueSelected.runner_participants == undefined || this.leagueSelected.runner_participants.length == 0) {
        return item
      }

      let new_item = this.leagueSelected.runner_participants.filter(lrp => {
        if (item.id == lrp.person_id) {
          return true
        }

        return false
      })

      if (new_item.length == 0) {
        return item
      }

      return new_item[0]
    })


    this.runnerParticipantsSelected = itemsSelected;
  }

  getRunnerParticipantsConfiguration() {
    return this.runnerParticipantsTableConfiguration;
  }

  getRacesFromLeague() {
    if(this.leagueSelected?.races == undefined) {
      return []
    }

    return this.leagueSelected?.races
  }

  onChangeRunnerParticipantTable(event:any) {
    console.log(event)
    this.runnerParticipantsUpdated = event;
  }

  // Races League
  updateRaceLeagueOptions() {
    let racesLeagueSelected:RaceLeague[] = []

    if (this.leagueSelected?.races) {
      this.leagueSelected?.races.map( r => {
        this.allRacesLeague.map( rl => {
          if(rl.race_info_id == r.race_info_id) {
            racesLeagueSelected.push(rl)
          }
        })
      })
    }

    this.raceFormGroup.get('raceLeagueSelectedControl')?.setValue(racesLeagueSelected)
    this.updateRaceLeagueSelected()
  }

  updateRaceLeagueSelected() {
    let control = this.raceFormGroup.get('raceLeagueSelectedControl')

    if (control == undefined) {
      return;
    }
    if (control.value == null ) {
      return;
    }
    let values:RaceLeague[] = control.value.map((value:RaceLeague, index:number) => {
      value.order = index;
      return value;
    })

    this.raceLeagueSelected = values;
  }

  getRaceLeagueOptions() {
    return this.allRacesLeague;
  }

  onChangeRaceLeagueCombo(event:any) {
    console.log("onChangeRaceLeagueCombo")
    console.log(event)
    this.updateRaceLeagueSelected()
  }

  getRaceLeagueColumns() {
    return this.raceLeagueColumnDefinition;
  }

  getRaceLeagueTableConfiguration() {
    return this.raceLeagueTableConfiguration;
  }

  onChangeRaceLeagueTable(event:any) {
    console.log("onChangeRaceLeagueTable")
    console.log(event)
    this.raceLeagueUpdated = event
  }

  // Save League
  runnerParticipantsUpdated: RunnerParticipant[] = []
  raceLeagueUpdated: RaceLeague[] = []

  saveLeague(event:any) {
    console.log(this.runnerParticipantsUpdated)
    console.log(this.raceLeagueUpdated)

    let runnerParticipartRequest:any = []
    this.runnerParticipantsUpdated.map(r => {
      runnerParticipartRequest.push({
        "person_id": r.person_id,
        "dorsal": r.dorsal,
        "disqualified_order_race": r.disqualified_order_race
      })
    })

    let racesRequest: any = []
    this.raceLeagueUpdated.map( r => {
      racesRequest.push({
        "name": r.name,
        "order": r.order,
        "race_info_id": r.race_info_id
      })
    })

    let leagueRequest :any = {...this.leagueSelected}
    leagueRequest['runner_participants'] = runnerParticipartRequest
    leagueRequest['races'] = racesRequest

    console.log(leagueRequest)

    this.leagueService.update(leagueRequest).subscribe(
      {
        next:(value) => {
          console.log("update leagueService");
          console.log(value);
          this.notificationService.add({ severity: 'success', summary: 'Successful', detail: 'Se ha actualizado correctamente.', life: 3000 });
        },
        error: err => this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 }),
        complete: () => {
          console.log('complete leagueService')
        }
      }
    )
  }
}
