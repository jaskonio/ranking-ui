import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CustomFormField } from './interfaces';

@Component({
  selector: 'app-ng-form',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    ChipModule,
		FormsModule,
		InputMaskModule,
		InputNumberModule,
		InputTextareaModule,
		InputTextModule,
		FileUploadModule,
    ReactiveFormsModule,
    ButtonModule],
  templateUrl: './ng-form.component.html'
})
export class NgFormComponent {
  @Output() newContentEvent = new EventEmitter<{}>();


  @Input() title_form: string = '';
  @Input() form_configuration: CustomFormField[] = [];

  customForm = new FormGroup({});

  constructor(private cdref: ChangeDetectorRef) {
    console.log("constructor")
  }

  ngOnInit() {
    console.log("ngOnInit")
    this.createFormGroup()
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }

  createFormGroup() {
    this.form_configuration.forEach(field => {

      let new_control = new FormControl(field['default_value'], field['validators'])
      this.customForm.setControl(field.control_name, new_control)
    });
  }

  onUploadImage(event:any, control_name:string) {
    console.log(event)
    this.customForm.get(control_name)?.setValue(event['originalEvent']['body'])
  }

  onSubmit(){
    console.log("NgFormComponent: " + this.customForm.value)
    this.newContentEvent.emit(this.customForm.value)
  }
}
