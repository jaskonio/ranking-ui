import { Component } from '@angular/core';
import { PersonService } from '../../shared/services/person.service';
import { PersonResponse } from '../../shared/services/interfaces';
import { ConlumnsDefinition } from '../../shared/components/table/interfaces';
import { NgTableComponent } from '../../shared/components/table/ng-table.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NgFormComponent } from '../../shared/components/form/ng-form.component';
import { CustomFormField } from '../../shared/components/form/interfaces';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [NgTableComponent,
    CommonModule,
		FormsModule,
		InputMaskModule,
		InputNumberModule,
		InputTextareaModule,
		InputTextModule,
		FileUploadModule,
    ReactiveFormsModule,
    ButtonModule,
    NgFormComponent],
  providers: [MessageService],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.scss'
})
export class PersonsComponent {
  title_form = "Añadir Nueva Persona"
  form_configuration: CustomFormField[] = [
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

  personsList: PersonResponse[] = [];
  personsColumns: ConlumnsDefinition[] = [
    {
      "key": "first_name",
      "value": "Nombre",
      "order": 1,
      "sortable": true,
      "supportImageKey": "photo_url",
      "activeSortable": true
    },
    {
      "key": "last_name",
      "value": "Apellido",
      "order": 2,
      "sortable": true
    },
    {
      "key": "gender",
      "value": "Genero",
      "order": 3,
      "sortable": true
    }
  ]


  constructor(
    private personService: PersonService
  ){
    this.loadPersonTable()
  }

  loadPersonTable(){
    this.personService.getAll().subscribe( persons => {
      console.log(persons)
      this.personsList = persons;
    });
  }

  sendPerson(content:any) {
    console.log("sendPerson")
    this.personService.add(content).subscribe(res => { console.log(res)})

    this.loadPersonTable()
  }

  onSubmitPersonForm(event:any) {
    console.log("PersonsComponent: ")
    console.log(event)
    this.sendPerson(event)
  }
}
