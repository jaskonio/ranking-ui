import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LeagueService } from '../../shared/services/league.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PersonService } from '../../shared/services/person.service';
import { League, PersonResponse, RaceResponse, RunnerParticipant } from '../../shared/services/interfaces';
import { RaceService } from '../../shared/services/race.service';
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { ConlumnsDefinition, TableConfiguracion } from '../../shared/interfaces/interfaces';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-leagues',
  standalone: true,
  providers: [NotificationService],
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
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.scss'
})
export class LeaguesComponent {
  allLeagues: League[] | undefined
  addLeagueForm = new FormGroup({});

  allPersons:PersonResponse[] = []
  allRunnerParticipant:RunnerParticipant[] = []

  allRaces:RaceResponse[]= []

  formGroupPersons = new FormGroup({
    participantsSelectedControl: new FormControl<RunnerParticipant[]>([], [])
  });

  _leagueSelected:League|undefined

  get leagueSelected() {
    return this._leagueSelected
  }

  set leagueSelected(item) {
    this._leagueSelected = item

    let personSelected:RunnerParticipant[] = []

    if (this.leagueSelected?.runner_participants) {
      // this.participantsSelected = this.leagueSelected.runner_participants
      this.leagueSelected?.runner_participants.map( rp => {
        this.allRunnerParticipant.map( p => {
          if(rp.person_id == p.id) {
            personSelected.push(p)
          }
        })
      })
    }

    this.formGroupPersons.get('participantsSelectedControl')?.setValue(personSelected)
    this.updateRunnerParticipantsSelected()
  }

  _racesSelected:any|undefined

  get racesSelected() {
    return this._racesSelected
  }

  set racesSelected(item) {
    this._racesSelected = item
  }

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
  constructor(
    private notificationService:NotificationService,
    private leagueService:LeagueService,
    private personService:PersonService,
    private raceService:RaceService){
  }

  ngOnInit() {
    this.addLeagueForm = new FormGroup({});
    let name_control = new FormControl('', [Validators.required, Validators.maxLength(20)])
    this.addLeagueForm.setControl('name', name_control)

    this.reloadAllLeagues()
    this.reloadAllPersons()
    this.reloadAllRaces()
  }

  onSubmitAddNewLeague() {
    console.log("onSubmitAddNewLeague")
    console.log(this.addLeagueForm.value)

    this.leagueService.save_item(this.addLeagueForm.value).subscribe(
      {
        next: (value) => {
          console.log(value)
        },
        error: err => this.notificationService.notification =  { severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 },
        complete: () => {
          console.log('end ad league')
        }
      }
    )
  }

  reloadAllLeagues() {
    this.leagueService.getAll().subscribe(
      {
        next: (value) => {
          console.log("next reloadAllLeagues")
          console.log(value)
          this.allLeagues = value
        },
        error: err => this.notificationService.notification =  { severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 },
        complete: () => {
          this.allLeagues
          console.log('end reloadAllLeagues')
        }
      }
    )
  }

  reloadAllPersons() {
    this.personService.get_data().subscribe(
      {
        next:(value) => {
          console.log("reloadAllPersons")
          console.log(value)
          this.allPersons = value
          this.allRunnerParticipant = this.allPersons.map(p => {
            let rp: RunnerParticipant = p
            rp.person_id = p.id
            rp.dorsal = -1
            rp.disqualified_order_race = -1
            return rp
          })
        },
        error: err => this.notificationService.notification =  { severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 },
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
        },
        error: err => this.notificationService.notification =  { severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 },
        complete: () => {
          this.allLeagues
          console.log('end reloadAllRaces')
        }
      }
    )
  }

  getRunnerParticipants() {
    return this.allRunnerParticipant
  }

  getRunnerParticipantsColumns() {
    return this.runnerParticipantsColumnsDefinition
  }

  runnerParticipantsSelected: RunnerParticipant[] = []

  onChangeRunnerParticipantCombo(event:any) {
    this.updateRunnerParticipantsSelected()
  }

  updateRunnerParticipantsSelected() {
    let control = this.formGroupPersons.get('participantsSelectedControl')
    if (control == undefined) {
      return;
    }

    this.runnerParticipantsSelected = control.value == null? [] : control.value
  }

  onChangeRunnerParticipantTable(event:any) {
    console.log(event)
  }

  getRunnerParticipantsConfiguration() {
    let configuration:TableConfiguracion = {
      title: "Participantes",
      paginator: true,
      editableRow: true,
      rowsPerPageOptions: [5, 10, 20, 100],
      rows: 10,
      showCurrentPageReport: true,
    }

    return configuration
  }

  onClickRunnerParticipant(event: any) {
    console.log("onClickRunnerParticipant")
    console.log(event)
  }

  getRacesFromLeague() {
    if(this.leagueSelected?.races == undefined) {
      return []
    }

    return this.leagueSelected?.races
  }
}
