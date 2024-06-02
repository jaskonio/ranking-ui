import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeasonService } from '../../shared/services/seasson.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { League, SeasonInfoView } from '../../shared/services/interfaces';
import { DropdownModule } from 'primeng/dropdown';
import { LeagueService } from '../../shared/services/league.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

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

  public allSeassons: SeasonInfoView[] = [];

  public seassonSelected:SeasonInfoView | null = null;

  public allLeagues: League[] = [];

  public leaguesSelected: League[] = [];

  private destroy$ = new Subject<void>();

  constructor(public seassonService:SeasonService,
    private messageService:MessageService,
    public leagueService:LeagueService) {
  }

  ngOnInit() {
    this.seassonService.allSeasson$.pipe(takeUntil(this.destroy$)).subscribe(seasons => {
      console.log("allSeasson$")
      this.allSeassons = seasons ?? [];
    });

    this.leagueService.allLeagues$.pipe(takeUntil(this.destroy$)).subscribe(leagues => {
      this.allLeagues = leagues ?? [];
    });
  }

  onSeasonFormSubmit() {
    console.log("onSeasonFormSubmit")
    console.log(this.seassonForm.value)

    this.seassonService.save(this.seassonForm.value).subscribe(
      {
        next: (value) => {
          this.seassonService.reloadData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Temporada guardada correctamente', life: 3000 });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 })
        }
      }
    )
  }

  onSaveSeason(event:any) {
    console.log("onSaveSeasson")
  }

  onSelectedLeagueChange(event:any) {
    this.updateLeagueSelected()
  }

  updateLeagueSelected() {
    if (this.seassonSelected) {
      this.leaguesSelected = this.allLeagues.filter(league => {
        this.seassonSelected?.league_ids.includes(league.id)
      })
    }
  }

  onSelectSeason(event:any) {
    this.seassonService.selectedSeasson(event)
  }

  onLeagueTableChanged(event:any) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
