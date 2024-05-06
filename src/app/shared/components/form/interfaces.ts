export interface CustomInputImageOptions {
  url: any;
  method: string;
  field_parameter: string;
}

export interface CustomFormField {
  label: string;
  placeholder?: string;
  control_name: string;
  control_type: string;
  default_value?: any;
  validators?: any[];
  input_image_options?: CustomInputImageOptions;
}