import { Component } from '@angular/core';
import { CustomFormField } from '../../shared/components/form/interfaces';
import { Validators } from '@angular/forms';
import { CrudComponent } from '../../shared/components/crud/crud.component';
import { MessageService } from 'primeng/api';
import { RaceService } from '../../shared/services/race.service';

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
      validators: [Validators.required, Validators.maxLength(30)]
    },
    {
      label: "URL",
      placeholder: "https://sportmaniacs.com/es/races/21ordf-carrera-popular-galapagos-3f/5c35e379-5c34-4f59-ba34-229dac1f0b2e/results",
      control_name: "url",
      control_type: "text",
      default_value: null,
      validators: [Validators.required, Validators.maxLength(150)]
    },
    {
      label: "Plataforma",
      placeholder: "Plataforma",
      control_name: "platform",
      control_type:"dropdown",
      dropdown_options: ['SPORTMANIACS_LATEST', 'VALENCIACIUDADDELRUNNING_LATEST', 'TOPRUN_LATEST'],
      default_value: 'SPORTMANIACS_LATEST',
      validators: [Validators.required]
    },
    {
      label: "Procesado",
      placeholder: "processed",
      control_name: "processed",
      control_type: "checkbox",
      default_value: false,
      validators: [Validators.required]
    },
  ]

  form_configuration = {
    title_form: "",
    fields_configuration: this.fields_configuration,
    submitButtonEnabled: true,
  }

  constructor(public raceService:RaceService) {
  }
}
