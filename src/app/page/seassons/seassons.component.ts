import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeasonService } from '../../shared/services/seasson.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { League, Season } from '../../shared/services/interfaces';
import { DropdownModule } from 'primeng/dropdown';
import { LeagueService } from '../../shared/services/league.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { Observable, Subject, catchError, combineLatest, forkJoin, of, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConlumnsDefinition, TableActions, TableConfiguracion } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-seassons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    NgTableComponent,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './seassons.component.html',
  styleUrl: './seassons.component.scss'
})
export class SeassonsComponent {
  public seassonForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(50)])
  });

  public allSeasonItems: Season[] = [];

  public seassonItemSelected:Season | null = null;

  public allLeagues: League[] = [];

  public leaguesSelected: League[] = [];

  public seasonTableEditEnable: boolean = true;

  public leagueTableEditEnable: boolean = false;

  private destroy$ = new Subject<void>();

  private leagueColumnDefinition: ConlumnsDefinition[] = [
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

  private leagueTableConfiguration:TableConfiguracion = {
    title: "Ligas",
    paginator: true,
    editableRow: true,
    rowsPerPageOptions: [5, 10, 20, 100],
    rows: 5,
    showCurrentPageReport: true,
  }

  private seasonColumnDefinition: ConlumnsDefinition[] = [
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

  private seasonTableConfiguration:TableConfiguracion = {
    title: "Temporadas",
    paginator: true,
    editableRow: true,
    rowsPerPageOptions: [5, 10, 20, 100],
    rows: 5,
    showCurrentPageReport: true,
    buttonActions: [
      {
        icon: 'pi-trash',
        styles: 'p-button-danger',
        typeAction: TableActions.CUSTOM_ACTIONS,
        callback: item=> { return this.deleteSeason(item, this)}
      },
    ]
  }

  constructor(public seassonService:SeasonService,
    private messageService:MessageService,
    public leagueService:LeagueService) {
  }

  ngOnInit() {
    combineLatest([
      this.leagueService.allLeagues$,
      this.seassonService.allSeasson$
    ]).pipe(takeUntil(this.destroy$)).subscribe(([leagues, seasons]) => {
      console.log("allSeasson$");
      this.allLeagues = leagues ?? []
      this.allSeasonItems = []

      if (seasons == null) {
        return;
      }

      seasons.forEach(season => {
        let item: Season = {
          id: season.id,
          name: season.name,
          order: season.order,
          leagues: []
        }

        // this.allLeagues.forEach(league => {
        //   if (season.league_ids.includes(league.id)) {
        //     item.leagues.push(league)
        //   }
        // })

        this.allSeasonItems.push(item)
      });

      if (this.seassonItemSelected) {
        this.allSeasonItems.forEach(season => {
          if (season.id == this.seassonItemSelected?.id) {
            this.seassonItemSelected = season
          }
        })
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSeasonColumnDefinition() {
    return this.seasonColumnDefinition;
  }

  getSeasonTableConfiguration() {
    return this.seasonTableConfiguration;
  }

  onSaveAllSeasons() {
    const updateSeasonObservables = this.allSeasonItems.map( season => {
      let seasonUpdated:Season = {
        id: season.id,
        name: season.name,
        order: season.order,
        leagues: season.leagues
      }

      return (this.updateSeason(seasonUpdated))
    })

    forkJoin(updateSeasonObservables).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Se han guardado las temporadas',
          life: 3000
        });

        this.seassonService.reloadData();
      },
      error: (ee) => {
        console.error(ee)
        this.messageService.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'Error al guardar las temporadas',
          life: 3000
        });
      }
    })
  }

  onSelectSeason(event:any) {
    this.seassonItemSelected = event.value

    if (this.seassonItemSelected != null) {
      this.leaguesSelected = this.seassonItemSelected.leagues
    }
  }

  getLeagueColumnDefinition() {
    return this.leagueColumnDefinition;
  }

  getLeagueTableConfiguration() {
    return this.leagueTableConfiguration;
  }

  onSeasonFormSubmit() {
    console.log("onSeasonFormSubmit")
    console.log(this.seassonForm.value)

    let lastSeason = this.allSeasonItems.sort( (a,b) =>  a.order - b.order).at(-1);

    let order = 0;
    if (lastSeason) {
      order = lastSeason.order + 1
    }

    let season = {
      'name':  this.seassonForm.value.name,
      'order': order
    }

    this.seassonService.save(season).subscribe(
      {
        next: (value) => {
          this.seassonService.reloadData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Temporada guardada correctamente', life: 3000 });
          this.seassonForm.get('name')?.reset();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 });
        }
      }
    )
  }

  onSaveSeason(event:any) {
    console.log("onSaveSeasson")
    console.log(this.seassonItemSelected)
    console.log(this.leaguesSelected)

    if (!this.seassonItemSelected) {
      return;
    }

    let seasonUpdated:Season = {
      id: this.seassonItemSelected.id,
      name: this.seassonItemSelected.name,
      order: this.seassonItemSelected.order,
      leagues: this.leaguesSelected
    }

    this.updateSeason(seasonUpdated).subscribe(
      {
        next: (value) => {
          this.seassonService.reloadData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Temporada actualziada correctamente', life: 3000 });
        }
      }
    )
  }

  private updateSeason(seasson:Season) {
    return this.seassonService.update(seasson).pipe(
      catchError((error:any, caught: Observable<any[]>) => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al actualizar la temporada: ' + seasson.name, life: 3000 });
        return of(null);
      })
    )
  }

  deleteSeason(season:Season, this$: SeassonsComponent) {
    console.log("deleteSeason")
    console.log(season)

    this.seassonService.remove(season).subscribe({
      next(value) {
        console.log(value);
        this$.seassonService.reloadData();
        this$.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Se ha actualizado correctamente.', life: 3000 });
      },
      error(err) {
        console.error(err)
      },
    })
  }

  onClickRowEvent(event:TableActions) {
    console.log('onActiveEditMode')

    if(event == TableActions.SAVE) {
      this.seasonTableEditEnable = false;
    }
    else if(event == TableActions.EDIT) {
      this.seasonTableEditEnable = true;
    }
  }

  onClickRowEventLeagueTable(event:TableActions) {
    console.log('onClickRowEventLeagueTable')

    if(event == TableActions.SAVE) {
      this.leagueTableEditEnable = false;
    }
    else if(event == TableActions.EDIT) {
      this.leagueTableEditEnable = true;
    }
  }
}
