import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  FormHTMLAttributes,
  InputHTMLAttributes,
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
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  onBlur(e: FocusEvent<HTMLInputElement>): void;
  onFocus(e: FocusEvent<HTMLInputElement>): void;
}

export interface FormInstance {
  data: FormData;
  errors: Record<string, FormError>;
  submitting: boolean;
  getValues<
    T extends string | undefined,
    D extends Record<string, unknown> = Record<string, unknown>
  >(name?: T): T extends string ? string : D;
  setValues<T extends string | Record<string, unknown>>(name: T, value?: unknown): void;
  reset(): void;
  validate(name?: string): Promise<FormValidateResult>;
  setError(name: string, message: string): void;
  clearErrors(name?: string): void;
  setSubmitting: Dispatch<SetStateAction<boolean>>;
  getInputProps(name: string, fieldSchema?: FormFieldSchema): FormControlProps;
}

export type FormBaseProps = FormHTMLAttributes<HTMLFormElement>;

export type FormAction<DataType = void> = (data: FormData) => Promise<DataType>;

export type FormRef = HTMLFormElement & FormInstance;

export type FormPrimitive = ReactNode | ReactNode[];

export type FormMode = "change" | "blur" | "submit";

export type FormResolver = (data: Record<string, unknown>, name?: string) => Promise<FormValidateResult>;

export interface FormInitialProps<FormValues extends Record<string, unknown> = Record<string, unknown>> {
  action?: FormAction<unknown>;
  onSubmit?(data: FormData): void;
  onAfterSubmit?(data: unknown): void;
  onError?(error: Record<string, FormError>): void;
  enhanceGetInputProps?(form: FormInstance): Partial<InputHTMLAttributes<HTMLInputElement>>;
  resolver?: FormResolver;
  values?: FormValues;
  schema?: FormScheam;
  ssr?: boolean;
  mode?: FormMode;
}

export interface FormProps extends Omit<FormBaseProps, "onSubmit" | "action" | "children" | "onError">, FormInitialProps {
  children: FormPrimitive | ((form: FormInstance) => FormPrimitive);
}
