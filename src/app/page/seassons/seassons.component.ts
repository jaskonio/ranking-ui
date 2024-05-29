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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seassons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    NgTableComponent
  ],
  templateUrl: './seassons.component.html',
  styleUrl: './seassons.component.scss'
})
export class SeassonsComponent {
  public seassonForm = new FormGroup({
    nameControl: new FormControl<string>('name', [Validators.required, Validators.maxLength(50)])
  });

  public allSeassons: SeasonInfoView[] = [];
  private subscriptionallSeassons: Subscription | undefined;

  public seassonSelected:SeasonInfoView | undefined;
  private subscriptionSeassonSelected: Subscription | undefined;


  public allLeagues: League[] = [];
  private subscriptionallLeagues:  Subscription | undefined;
  public leaguesSelected: League[] = [];

  constructor(private seassonService:SeasonService,
    private messageService:MessageService,
    private leagueService:LeagueService) {
  }

  ngOnInit() {   
    this.subscriptionallSeassons = this.seassonService.allSeasson$.subscribe(items => {
      this.allSeassons = items;
    })

    this.subscriptionSeassonSelected = this.seassonService.seassonSelected$.subscribe(item => {
      this.seassonSelected = item;
      this.updateLeagueSelected();
    })

    this.subscriptionallLeagues = this.leagueService.allLeagues$.subscribe(items => {
      this.allLeagues = items;
    })
  }

  onSeassonFormSubmit() {
    console.log("onSubmitAddNewLeague")
    console.log(this.seassonForm.value)

    this.seassonService.save(this.seassonForm.value).subscribe(
      {
        next: (value) => {
          console.log(value)
        },
        error: err => this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 }),
        complete: () => {
          console.log('end ad league')
        }
      }
    )
  }

  onSaveSeasson(event:any) {
    console.log("onSaveSeasson")
  }

  onSelectedLeagueChange(event:any) {
    this.updateLeagueSelected()
  }

  updateLeagueSelected() {
    this.leaguesSelected = []
    
    this.seassonSelected?.league_ids.map(league_id => {
      this.allLeagues.map( league => {
        if (league.id == league_id) {
          this.leaguesSelected.push(league);
        }
      })
    });
  }

  onSelectSeasson(event:any) {
    this.seassonService.selectedSeasson(event)
  }

  onLeagueTableChanged(event:any) {

  }
}
