import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LeagueService } from '../../shared/services/league.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PersonService } from '../../shared/services/person.service';
import { League, LeagueRace, LeagueRunnerParticipant, Person, Race, RaceData } from '../../shared/services/interfaces';
import { RaceService } from '../../shared/services/race.service';
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { ConlumnsDefinition, TableActions, TableConfiguracion } from '../../shared/interfaces/interfaces';
import { TableModule } from 'primeng/table';
import { catchError, forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RequestLeague, RequestLeagueRace, RequestLeagueRunnerParticipant } from '../../shared/services/request_interfaces';

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
    TableModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.scss'
})
export class LeaguesComponent implements OnDestroy{
  allLeagues: League[] = []
  addLeagueForm = new FormGroup({
    'name': new FormControl('', [Validators.required, Validators.maxLength(50)])
  });

  personsFormGroup = new FormGroup({
    'persons': new FormControl<Person[]>([],[])
  });

  allPersons:Person[] = []
  // personSelected:Person[] = []

  runnerParticipantsSelected: LeagueRunnerParticipant[] = []
  
  allRunnerParticipant:LeagueRunnerParticipant[] = []

  allRaces:Race[]= []
  allRacesLeague:LeagueRace[] =[]

  raceLeagueSelected: LeagueRace[] = []

  raceFormGroup = new FormGroup({
    raceLeagueSelectedControl: new FormControl<LeagueRace[]>([], [])
  });

  _leagueSelected:League|undefined

  get leagueSelected() {
    return this._leagueSelected
  }

  set leagueSelected(item) {
    this._leagueSelected = item
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
    },
    {
      "key": "unique_dorsal",
      "value": "Dorsal unico",
      "order": 7,
      "editable": true,
      "type": "checkbox"
    }
  ]

  private runnerParticipantsTableConfiguration:TableConfiguracion = {
    title: "Participantes",
    paginator: true,
    editableRow: true,
    rowsPerPageOptions: [5, 10, 20, 100],
    rows: 5,
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

  private leagueColumnDefinition: ConlumnsDefinition[] = [
    {
      "key": "id",
      "value": "id",
      "order": 0,
      "visible": false,
      "foreign_key": true
    },
    {
      "key": "name",
      "value": "Nombre",
      "order": 1,
      "supportFilter": true,
      "editable": true,
    }
  ]

  private leagueTableConfiguration:TableConfiguracion = {
    title: "Ligas",
    paginator: true,
    editableRow: true,
    rowsPerPageOptions: [5, 10, 50],
    rows: 5,
    showCurrentPageReport: true,
    buttonActions: [
      {
        icon: 'pi-spinner-dotted',
        styles: '',
        typeAction: TableActions.CUSTOM_ACTIONS,
        callback: item=> { return this.processLeague(item, this)}
      },
      {
        icon: 'pi-trash',
        styles: 'p-button-danger',
        typeAction: TableActions.CUSTOM_ACTIONS,
        callback: item=> { return this.deleteLeague(item, this)}
      },
    ]
  }

  constructor(
    private notificationService:MessageService,
    private leagueService:LeagueService,
    private personService:PersonService,
    private raceService:RaceService){
  }

  ngOnInit() {
    this.leagueService.allLeagues$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.allLeagues = data ?? []

      this.allLeagues.forEach( league => {
        if (league.id == this.leagueSelected?.id) {
          this.leagueSelected = league
        }
      })
    });

    this.personService.allPersons$.pipe(takeUntil(this.destroy$)).subscribe( data => {
      this.allPersons = data ?? [];
      console.log(this.allPersons)
    })

    this.raceService.allRaces$.pipe(takeUntil(this.destroy$)).subscribe( data => {
      this.allRaces = data ?? []
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmitAddNewLeague() {
    console.log("onSubmitAddNewLeague")
    console.log(this.addLeagueForm.value)
    this.addLeague(this.addLeagueForm.value)
  }

  getLeagueColumnDefinition() {
    return this.leagueColumnDefinition;
  }

  getLeagueTableConfiguration() {
    return this.leagueTableConfiguration;
  }

  onChangeSelectedLeague(event:any) {
    console.log("onChangeSelectedLeague")
    console.log(this.leagueSelected)

    if (this.leagueSelected != undefined) {
      let pesons_related:Person[] = []
      this.leagueSelected.runner_participants.map( rp => {
        this.allPersons.map(p => {
          if (rp.id == p.id) {
            pesons_related.push(p)
          }
        })
      });

      this.personsFormGroup.get('persons')?.setValue(pesons_related);
      this.updateRunnerParticipantsSelected(pesons_related)
    }
  }

  onSaveAllLeagues() {
    console.log("onSaveAllLeagues")
    console.log(this.allLeagues)

    const allLeagueUpdatedObservables = this.allLeagues.map( league => {
      return this.updateLeague(league)
    })

    forkJoin(allLeagueUpdatedObservables).subscribe({
      complete: () => {
        console.log("complete");
        this.leagueService.reloadData();
        this.notificationService.add({ severity: 'success', summary: 'Successful', detail: 'Se han actualizado las ligas correctamente.', life: 3000 });
      },
      error: (err) => {
        console.error(err);
        this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Ha fallado la actualización de las ligas.', life: 3000 });
      },
    })
  }

  // Runner Participants
  getRunnerParticipantsColumns() {
    return this.runnerParticipantsColumnsDefinition
  }

  getRunnerParticipantsConfiguration() {
    return this.runnerParticipantsTableConfiguration;
  }

  onChangeSelectedPersons(event:any) {
    console.log(event)
    let persons_selected:Person[] = event.value

    this.updateRunnerParticipantsSelected(persons_selected)
  }

  updateRunnerParticipantsSelected(persons_selected:Person[]) {
    let newParticipantSelected = []

    for (let index = 0; index < persons_selected.length; index++) {
      const person_selected = persons_selected[index];
      
      let participanteSelected = this.getParticipanteSelectInLeagueSelectedByPersonId(person_selected.id);

      if (participanteSelected != null) {
        newParticipantSelected.push(participanteSelected)
      }
      else {
        let newParticipant:LeagueRunnerParticipant = {
          id: person_selected.id,
          first_name: person_selected.first_name,
          last_name: person_selected.last_name,
          gender: person_selected.gender,
          photo_url: person_selected.photo_url,
          person_id: person_selected.id,
          category: '', 
          disqualified_order_race: -1,
          dorsal: 0,
          unique_dorsal: true
        }
        newParticipantSelected.push(newParticipant)
      }
    }

    this.runnerParticipantsSelected = newParticipantSelected;
  }

  getParticipanteSelectInLeagueSelectedByPersonId(personId:string) {
    if (this.leagueSelected == undefined || this.leagueSelected.runner_participants == undefined || this.leagueSelected.runner_participants.length == 0) {
      return null
    }

    for (let index = 0; index < this.leagueSelected.runner_participants.length; index++) {
      let runner_participants = this.leagueSelected.runner_participants[index]
      if (personId == runner_participants.person_id) {
        return runner_participants
      }
    }
  
    return null
  }

  // Save League

  saveLeague(event:any) {
    console.log('saveLeague')
    console.log(this.runnerParticipantsSelected)

    if (this.leagueSelected== undefined) {
      return
    }
  
    let runnerParticipartRequest:RequestLeagueRunnerParticipant[] = []
    this.runnerParticipantsSelected.map(r => {
      runnerParticipartRequest.push({
        "person_id": r.person_id,
        "dorsal": r.dorsal,
        "disqualified_order_race": r.disqualified_order_race,
        "category": '',
        "unique_dorsal": true
      })
    })


    let leagueRequest:RequestLeague = {
        id: this.leagueSelected.id,
        name: this.leagueSelected.name,
        order: this.leagueSelected.order,
        runner_participants: runnerParticipartRequest
    }

    this.leagueService.update(leagueRequest).subscribe(
      {
        next:(value) => {
          console.log("update leagueService");
          console.log(value);

          this.leagueService.reloadData();
          this.notificationService.add({ severity: 'success', summary: 'Successful', detail: 'Se ha actualizado correctamente.', life: 3000 });
        },
        error: err => this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 }),
        complete: () => {
          console.log('complete leagueService');
        }
      }
    )
  }

  private addLeague(league:any) {
    this.leagueService.save_item(league).subscribe(
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

  private processLeague(league:League, this$: any) {
    console.log("processLeague")
    console.log(league)

    this.leagueService.process(league).subscribe({
      next(value) {
        console.log(value);
        this$.notificationService.add({ severity: 'success', summary: 'OK', detail: 'Se ha generado el ranking correctamente', life: 3000 })
        this$.leagueService.reloadData();
      },
      error(err) {
        console.error(err);
        this$.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al generar el ranking', life: 3000 })
      }
    })
  }

  private deleteLeague(league:League, this$: LeaguesComponent) {
    console.log("deleteLeague")
    console.log(league)

    this.leagueService.remove(league).subscribe({
      next(value) {
        console.log(value);
        this$.leagueService.reloadData();
        this$.notificationService.add({ severity: 'success', summary: 'Successful', detail: 'Se ha actualizado correctamente.', life: 3000 });
      },
      error(err) {
        console.error(err);
        this$.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'No se ha actualizado la liga.', life: 3000 });
      },
    })
  }

  private updateLeague(league:League) {
    return this.leagueService.update(league).pipe(
      catchError((error:any, caught: Observable<any[]>) => {
        this.notificationService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al actualizar la temporada: ' + league.name, life: 3000 });
        return of(null);
      })
    )
  }
}
