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
import { ImageModule } from 'primeng/image';
import { filter } from 'rxjs';

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
    ButtonModule,
    ImageModule,
  ],
  templateUrl: './ng-form.component.html'
})
export class NgFormComponent {
  @Output() newContentEvent = new EventEmitter<{}>();


  @Input() title_form: string = '';
  @Input() form_configuration: CustomFormField[] = [];
  @Input() submitButtonEnabled: boolean = true;
  @Input() data: any = null;

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

  getImageUrl(control_name:string) {
    if (this.customForm.get(control_name) == undefined){
      return ''
    }
    console.log(this.customForm.get(control_name)?.value)
    return this.customForm.get(control_name)?.value
  }

  createFormGroup() {
    this.form_configuration.forEach(field => {

      let defaultValue = ''
      if (this.data != null ){
        defaultValue = this.data[field.control_name]
      }else{
        defaultValue = field['default_value']
      }

      let new_control = new FormControl(defaultValue, field['validators'])
      this.customForm.setControl(field.control_name, new_control)
    });
  }

  onUploadImage(event:any, control_name:string) {
    console.log(event)
    this.customForm.get(control_name)?.setValue(event['originalEvent']['body'])
  }

  onSubmit(){
    console.log("NgFormComponent: ")
    console.log(this.customForm.value)
    this.newContentEvent.emit(this.customForm.value)
  }
}
