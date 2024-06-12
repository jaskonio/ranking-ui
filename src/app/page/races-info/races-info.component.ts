import { Component } from '@angular/core';
import { CustomFormField } from '../../shared/components/form/interfaces';
import { Validators } from '@angular/forms';
import { CrudComponent } from '../../shared/components/crud/crud.component';
import { MessageService } from 'primeng/api';
import { RaceService } from '../../shared/services/race.service';
import { ActionsCrud } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-races-info',
  standalone: true,
  imports: [CrudComponent],
  providers: [MessageService],
  templateUrl: './races-info.component.html',
  styleUrl: './races-info.component.scss'
})
export class RacesInfoComponent {

  fields_configuration: CustomFormField[] = [
    {
      label: "Nombre carrera",
      placeholder: "4º Carrera de ...",
      control_name: "name",
      control_type:"text",
      default_value: null,
      validators: [Validators.required, Validators.maxLength(60)]
    },
    {
      label: "URL",
      placeholder: "https://sportmaniacs.com/es/races/21ordf-carrera-popular-galapagos-3f/5c35e379-5c34-4f59-ba34-229dac1f0b2e",
      control_name: "url",
      control_type: "text",
      default_value: null,
      validators: [Validators.required, Validators.maxLength(250)]
    },
    {
      label: "Plataforma",
      placeholder: "Plataforma",
      control_name: "platform",
      control_type:"dropdown",
      dropdown_options: ['SPORTMANIACS_LATEST', 'SPORTMANIACS_V1', 'SPORTMANIACS_V2', 'VALENCIACIUDADDELRUNNING_LATEST', 'TOPRUN_LATEST'],
      default_value: 'SPORTMANIACS_V1',
      validators: [Validators.required]
    },
    {
      label: "Procesado",
      placeholder: "processed",
      control_name: "processed",
      control_type: "checkbox",
      default_value: false,
      visible: false
    },
  ]

  form_configuration = {
    title_form: "",
    fields_configuration: this.fields_configuration,
    submitButtonEnabled: true,
  }

  crudActions: ActionsCrud[] = [{
    icon: "pi-spinner-dotted",
    actions: "process",
    callback: (item: any) => {
      console.log(item)
      item['processed'] = true
      return this.raceService.process_race(item)
    },
  }]

  constructor(public raceService:RaceService) {
  }
}
