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
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../../core/auth.service';
import { HttpHeaders } from '@angular/common/http';


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
    DropdownModule,
    RadioButtonModule,
    CheckboxModule
  ],
  templateUrl: './ng-form.component.html'
})
export class NgFormComponent {

  @Output() newContentEvent = new EventEmitter<{}|null>();

  @Input() title_form: string = '';
  @Input() form_configuration: CustomFormField[] = [];
  @Input() submitButtonEnabled: boolean = true;
  @Input() data: any = null;

  customForm = new FormGroup({});

  uniqueId:string = '';

  constructor(private cdref: ChangeDetectorRef,
    private authService: AuthService
  ) {
    console.log("constructor")
    this.uniqueId = Math.floor(new Date().getTime() / 1000).toString()
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

    return this.customForm.get(control_name)?.value
  }

  createFormGroup() {
    this.form_configuration.forEach(field => {

      let defaultValue = ''
      if (this.data != null || this.data){
        defaultValue = this.data[field.control_name] == undefined? null : this.data[field.control_name]
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

    if (this.data == null) {
      this.data = {}
    }
      this.form_configuration.forEach(field => {
        this.data[field.control_name] = this.customForm.get(field.control_name)?.value
      });

    this.newContentEvent.emit(this.data)
  }

  cancelButton(){
    this.newContentEvent.emit(null)
  }

  buildHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${this.authService.getToken()}`);

    return headers
  }
}
