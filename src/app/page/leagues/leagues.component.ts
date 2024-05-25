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
import { League, PersonResponse, RaceResponse } from '../../shared/services/interfaces';
import { RaceService } from '../../shared/services/race.service';
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { ConlumnsDefinition, TableConfiguracion } from '../../shared/interfaces/interfaces';

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
    NgTableComponent
  ],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.scss'
})
export class LeaguesComponent {
  allLeagues: League[] = []
  addLeagueForm = new FormGroup({});

  allPersons:PersonResponse[] = []
  allRaces:RaceResponse[]= []

  _leagueSelected:League|undefined

  get leagueSelected() {
    return this._leagueSelected
  }

  set leagueSelected(item) {
    this._leagueSelected = item
  }

  _personsSelected:any|undefined

  get personsSelected() {
    return this._personsSelected
  }

  set personsSelected(item) {
    this._personsSelected = item
  }

  _racesSelected:any|undefined

  get racesSelected() {
    return this._racesSelected
  }

  set racesSelected(item) {
    this._racesSelected = item
  }

  constructor(
    private notificationService:NotificationService,
    private leagueService:LeagueService,
    private personService:PersonService,
    private raceService:RaceService  ){

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
          console.log("reloadAllLeagues")
          console.log(value)
          this.allLeagues = value
        },
        error: err => this.notificationService.notification =  { severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 },
        complete: () => {
          this.allLeagues
          console.log('end getAll')
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
          console.log("reloadAllRaces")
          console.log(value)
          this.allRaces = value
        },
        error: err => this.notificationService.notification =  { severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 },
        complete: () => {
          this.allLeagues
          console.log('end getAll')
        }
      }
    )
  }

  getRunnerParticipants() {
    if(this.leagueSelected?.runner_participants == undefined) {
      return []
    }

    return this.leagueSelected?.runner_participants
  }

  getRunnerParticipantsColumns() {
    let columns: ConlumnsDefinition[] = [
      {
        "key": "id",
        "value": "ID",
        "order": 99,
        "sortable": true,
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
        "sortable": true,
        "supportImageKey": "photo_url",
        "activeSortable": true,
        "supportFilter": true
      },
      {
        "key": "last_name",
        "value": "Apellido",
        "order": 3,
        "sortable": true,
        "supportFilter": true
      },
      {
        "key": "gender",
        "value": "Genero",
        "order": 4,
        "sortable": true
      }
    ]

    return columns
  }

  getRunnerParticipantsConfiguration() {
    let configuration:TableConfiguracion = {
      title: "Participantes"
    }

    return configuration
  }

  onClickRunnerParticipant(event: any) {
    console.log("onClickRunnerParticipant")
    console.log(event)
  }
}
