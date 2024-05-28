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
  public seassonForm = new FormGroup({});

  public allSeassons: SeasonInfoView[] | undefined;

  private _seassonSelected:SeasonInfoView | undefined;
  get seassonSelected() {
    return this._seassonSelected;
  }
  set seassonSelected(item) {
    this._seassonSelected = item
  }

  allLeagues: League[]

  leaguesForm = new FormGroup({
    leagueControl: new FormControl<League[]>([], [])
  });

  leaguesSelected:League[] = []

  constructor(private seassonService:SeasonService,
    private messageService:MessageService,
    private leagueService:LeagueService) {
      this.allLeagues = []
  }

  ngOnInit() {
    this.addSeassonForm();
    this.getAllLeagues();
  }

  addSeassonForm() {
    let name_control = new FormControl('', [Validators.required, Validators.maxLength(50)])
    this.seassonForm.setControl('name', name_control)
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

  getAllLeagues() {
    this.leagueService.getAll().subscribe(
      {
        next: (value) => {
          console.log("next reloadAllLeagues")
          console.log(value)
          this.allLeagues = value
        },
        error: err => this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Error al descargar los datos', life: 3000 }),
        complete: () => {
          this.allLeagues
          console.log('end reloadAllLeagues')
        }
      }
    )
  }

  getLeaguesOptions() {
    return this.allLeagues;
  }

  onLeagueControlOptions(event:any) {
    this.updateLeagueSelected()
  }

  updateLeagueSelected(){
    let control = this.leaguesForm.get('leagueControl');

    if (control == undefined || control.value == null) {
      return;
    }

    let itemsSelected:League[] = control.value

    let newitemsSelected:League[] = []
    itemsSelected.map(item => {
      if (this.seassonSelected == undefined || this.seassonSelected.league_ids == undefined || this.seassonSelected.league_ids.length == 0) {
        return
      }

      let leagueIdsSelected:League = item

      this.seassonSelected.league_ids.map(league_id => {
        if (league_id == item.id) {
          leagueIdsSelected = item
        }

          return false
        })

        newitemsSelected.push(leagueIdsSelected)
    });

    this.leaguesSelected = itemsSelected;
  }
}
