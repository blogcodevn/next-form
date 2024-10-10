import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  FormEvent,
  FormHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  SetStateAction
} from "react";

export interface FormError {
  message: string;
}

export interface FormValidateResult {
  isValid: boolean;
  errors: Record<string, FormError>;
}

export interface FormFieldSchema {
  required?: true | string;
  min?: number | [number, string];
  max?: number | [number, string];
  minLength?: number | [number, string];
  maxLength?: number | [number, string];
  pattern?: RegExp | string | [RegExp, string];
  oneOf? : any[] | [any[], string];
}

export type FormScheam = Record<string, FormFieldSchema>;

export interface FormControlProps {
  name: string;
  error?: string;
  value: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  onBlur(e: FocusEvent<HTMLInputElement>): void;
  onFocus(e: FocusEvent<HTMLInputElement>): void;
}

export type FormBaseValues = Record<string, unknown>;

export interface FormInstance {
  data: FormData;
  errors: Record<string, FormError>;
  submitting: boolean;
  getValues<
    T extends string | undefined,
    D extends Record<string, unknown> = Record<string, unknown>
  >(name?: T): T extends string ? string : D;
  setValues<T extends string | FormBaseValues>(name: T, value?: unknown): void;
  reset(): void;
  validate(name?: string): Promise<FormValidateResult>;
  setError(name: string, message: string): void;
  clearErrors(name?: string): void;
  setSubmitting: Dispatch<SetStateAction<boolean>>;
  getInputProps(name: string, fieldSchema?: FormFieldSchema): FormControlProps;
}

export type FormBaseProps = FormHTMLAttributes<HTMLFormElement>;

export type FormAction<DataType = void> = (data: FormData) => DataType | Promise<DataType>;

export type FormPrimitive = ReactNode | ReactNode[];

export type FormMode = "change" | "blur" | "submit";

export type FormResolver = (data: FormBaseValues, name?: string) => Promise<FormValidateResult>;

export interface FormInitialProps<FormValues extends FormBaseValues = FormBaseValues> {
  action?: string | FormAction<void>;
  onSubmit?(e: FormEvent<HTMLFormElement>): void;
  onAfterSubmit?(result: unknown, data: FormValues): void;
  onError?(error: Record<string, FormError>): void;
  enhanceGetInputProps?(form: FormInstance): Partial<HTMLAttributes<FormBaseControlElement>>;
  resolver?: FormResolver;
  values?: FormValues;
  schema?: FormScheam;
  mode?: FormMode;
}

export type FormBaseControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLDivElement;
