import { ChangeEvent, FC, FocusEvent, ReactElement, useCallback, useEffect, useMemo } from "react";
import { FormError, FormFieldSchema, FormInstance } from "./types";

export interface ControllerRenderField {
  name: string;
  value: string;
  error?: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  onBlur(e: FocusEvent<HTMLInputElement>): void;
  onFocus(e: FocusEvent<HTMLInputElement>): void;
}

export interface ControllerRenderFieldState {
  error?: string;
}

export interface ControllerRenderFormState {
  errors?: Record<string, FormError>;
  submitting: boolean;
}

export interface ControllerRenderProps {
  field: ControllerRenderField;
  fieldState: ControllerRenderFieldState;
  formState: ControllerRenderFormState;
}

export interface ControllerProps {
  name: string;
  form?: FormInstance;
  rules?: FormFieldSchema;
  render(props: ControllerRenderProps): ReactElement;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
  onBlur?(e: FocusEvent<HTMLInputElement>): void;
}

export const Controller: FC<ControllerProps> = (props) => {
  const { form, name, rules, render, onChange, onBlur } = props;

  useEffect(() => {
    if (rules) {
      form!.getInputProps(name, rules);
    }
  }, [form, name, rules]);

  const inputProps = useMemo(() => form!.getInputProps(name), [form, name]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    inputProps.onChange(e);
    onChange?.(e);
  }, [inputProps, onChange]);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    inputProps.onBlur(e);
    onBlur?.(e);
  }, [inputProps, onBlur]);

  const renderProps = {
    field: {
      ...inputProps,
      onChange: handleChange,
      onBlur: handleBlur,
    },
    fieldState: {
      error: form!.errors[name]?.message,
    },
    formState: {
      errors: form!.errors,
      submitting: form!.submitting,
    },
  };

  return render(renderProps);
};

Controller.displayName = "@blogcode/next-form/Controller";
