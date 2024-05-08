import { Component } from '@angular/core';
import { PersonService } from '../../shared/services/person.service';
import { PersonResponse } from '../../shared/services/interfaces';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CustomFormField } from '../../shared/components/form/interfaces';
import { CrudModule } from '../../shared/components/crud/crud.module';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [
    CommonModule,
    CrudModule],
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

  constructor(
    public personService: PersonService
  ){
    // this.loadPersonTable()
  }

  loadPersonTable(){
    this.personService.get_data().subscribe( persons => {
      console.log(persons)
      this.personsList = persons;
    });
  }

  sendPerson(content:any) {
    console.log("sendPerson")
    this.personService.save_item(content).subscribe(res => { console.log(res)})

    this.loadPersonTable()
  }

  onSubmitPersonForm(event:any) {
    console.log("PersonsComponent: ")
    console.log(event)
    this.sendPerson(event)
  }
}
