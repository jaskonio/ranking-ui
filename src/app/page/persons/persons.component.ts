import { Component } from '@angular/core';
import { PersonService } from '../../shared/services/person.service';
import { PersonResponse } from '../../shared/services/interfaces';
import { Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomFormField } from '../../shared/components/form/interfaces';
import { CrudComponent } from '../../shared/components/crud/crud.component';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CrudComponent],
  providers: [MessageService],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.scss'
})
export class PersonsComponent {
  fields_configuration: CustomFormField[] = [
    {
      label: "Nombre",
      placeholder: "Nombre",
      control_name: "first_name",
      control_type:"text",
      default_value: null,
      validators: [Validators.required]
    },
    {
      label: "Apellido",
      placeholder: "Apellido",
      control_name: "last_name",
      control_type: "text",
      default_value: null,
      validators: [Validators.required]
    },
    {
      label: "Genero",
      placeholder: "Genero",
      control_name: "gender",
      control_type:"text",
      default_value: 'M',
      validators: [Validators.required]
    },
    {
      label: "Foto",
      control_name: "photo_url",
      control_type:"image",
      validators: [Validators.required],
      input_image_options: {
        url: () => {
          return 'http://localhost:8000/image?image_name=' + Math.floor(new Date().getTime() / 1000).toString()
        },
        method: 'post',
        field_parameter: 'file_image'
      }
    }
  ]

  form_configuration = {
    title_form: "",
    fields_configuration: this.fields_configuration,
    submitButtonEnabled: false,
  }

  personsList: PersonResponse[] = [];

  constructor(
    public personService: PersonService
  ){
  }
}
