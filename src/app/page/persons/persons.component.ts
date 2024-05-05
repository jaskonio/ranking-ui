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
    ButtonModule],
  providers: [MessageService],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.scss'
})
export class PersonsComponent {
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
    private personService: PersonService,
    private messageService: MessageService
  ){
    this.loadPersonTable()
  }

  loadPersonTable(){
    this.personService.getAll().subscribe( persons => {
      console.log(persons)
      this.personsList = persons;
    });
  }

  personForm = new FormGroup({
    first_name:  new FormControl('', Validators.required),
    last_name: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    photo_url: new FormControl(null)
  });

  onUpload(event: any) {
    console.log("File Uploaded")
    console.log(event)
    this.personForm.controls.photo_url.setValue(event['originalEvent']['body'])
    console.log(this.personForm.value)
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  sendPerson() {
    console.log("sendPerson")
    console.log(this.personForm.value)
    this.personService.add(this.personForm.value).subscribe(res => { console.log(res)})

    this.loadPersonTable()
  }

  buildNameOfImage() {
    return Math.floor(new Date().getTime() / 1000).toString()
  }

  buildUrlToUploadImage() {
    let name = this.buildNameOfImage()
    let url="http://127.0.0.1:8000/image?image_name=" + name
    return url
  }
}
