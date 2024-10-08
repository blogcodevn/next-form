import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import {
  FormBaseControlElement,
  FormBaseValues,
  FormError,
  FormFieldSchema,
  FormInitialProps,
  FormInstance,
  FormValidateResult
} from "./types";
import { validate as validateAll } from "./validate";
import { createFormData } from "./createFormData";

export type UseFormProps<FormValues extends FormBaseValues> = FormInitialProps<FormValues>;

export function useForm<FormValues extends FormBaseValues>(props?: UseFormProps<FormValues>) {
  const {
    values = {},
    schema = {},
    mode,
    enhanceGetInputProps,
    onSubmit,
    onError,
    onAfterSubmit,
    resolver,
  } = props || {};

  const [formValues, setFormValues] = useState<FormValues>(values as FormValues);
  const [formErrors, setFormErrors] = useState<Record<string, FormError>>({});
  const [submitting, setSubmitting] = useState(false);
  const schemaRef = useRef(schema);

  const data = useMemo(() => createFormData(formValues), [formValues]);

  const validate = useCallback(async function validate(name?: string, newValues?: FormValues) {
    const dataToValidate = newValues ?? formValues;
    let validated: FormValidateResult;

    if (resolver) {
      validated = await resolver(dataToValidate, name);
    } else {
      validated = validateAll(dataToValidate, schemaRef.current, name);
    }

    if (name) {
      setFormErrors((prev) => {
        const nextErrors = { ...prev };

        if (validated.errors[name]) {
          nextErrors[name] = validated.errors[name];
        } else {
          delete nextErrors[name];
        }

        return nextErrors;
      });
    } else {
      setFormErrors(() => validated.errors);
    }

    return validated;
  }, [setFormErrors, resolver, formValues, schemaRef.current]);

  const getInputProps = useCallback(function getInputProps(name: string, rules?: FormFieldSchema) {
    if (rules) {
      schemaRef.current = {
        ...(schemaRef.current ?? {}),
        [name]: {
          ...(schemaRef.current?.[name] ?? {}),
          ...rules
        }
      };
    }

    const onChange = (e: ChangeEvent<FormBaseControlElement>) => {
      const target = e.target as HTMLInputElement;

      setFormValues((prev) => {
        const nextValues = { ...prev, [name]: target.value };

        if (!mode || mode === "change") {
          validate(name, nextValues);
        }

        return nextValues;
      })
    };

    const onBlur = (e: FocusEvent<FormBaseControlElement>) => {
      if (!mode || mode === "blur") {
        validate(name);
      }
    };

    const enhancedProps: HTMLAttributes<FormBaseControlElement> = enhanceGetInputProps?.(form as FormInstance) ?? {};

    return {
      ...enhancedProps,
      name,
      value: (formValues[name] ?? "") as string,
      error: formErrors[name]?.message,
      onChange,
      onBlur,
      onFocus() {},
    };
  }, [mode, formValues, formErrors, schemaRef.current, setFormValues, validate, enhanceGetInputProps]);

  const getValues = useCallback(
    function getValues<T extends string | undefined, D extends FormValues = FormValues>(
      name?: T
    ): T extends string ? string : D {
      type GetValueResult = T extends string ? string : D;

      if (name) {
        return formValues[name] as GetValueResult;
      }

      return formValues as GetValueResult;
    },
    [formValues]
  );

  const reset = useCallback(function reset() {
    setFormValues(values as FormValues);
    setFormErrors({});
  }, [values, setFormValues, setFormErrors]);

  const setError = useCallback(function setError(name: string, message: string) {
    setFormErrors((prev) => ({
      ...prev,
      [name]: { message },
    }));
  }, [setFormErrors]);

  const clearErrors = useCallback(function clearErrors(name?: string) {
    setFormErrors((prev) => {
      if (name) {
        const nextError = { ...prev };
        delete nextError[name];
        return nextError;
      }

      return {};
    });
  }, [setFormErrors]);

  const setValues = useCallback(function setValues<T extends string | FormValues>(name: T, value?: unknown) {
    setFormValues((prev) => {
      const isSingle = typeof name === "string";
      const keyValidate = isSingle ? name : undefined;
      const nextValues = { ...prev, ...(isSingle ? { [name]: value } : name) as FormValues };

      if (!mode || mode === "change") {
        validate(keyValidate, nextValues);
      }

      return nextValues;
    });
  }, [setFormValues, mode, validate]);

  const handleSubmit = useCallback(function handleSubmit(submit: any) {
    return async function handleSubmitForm(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      e.stopPropagation();

      const validated = await validate();
      setSubmitting(true);

      try {
        if (validated.isValid) {
          const result = await onSubmit?.(e);
          onAfterSubmit?.(result, formValues);
        } else {
          onError?.(validated.errors);
        }
      } catch (e) {
        onError?.(e as unknown as Record<string, FormError>);
      } finally {
        setSubmitting(false);
      }
    };
  }, [formValues, validate, onError, setSubmitting, onSubmit]);

  const form = useMemo(
    () => ({
      data,
      errors: formErrors,
      submitting,
      setSubmitting,
      getInputProps,
      validate,
      getValues,
      reset,
      setError,
      clearErrors,
      setValues,
      handleSubmit,
    }),
    [
      data,
      formErrors,
      submitting,
      setSubmitting,
      getInputProps,
      validate,
      getValues,
      reset,
      setError,
      clearErrors,
      setValues,
      handleSubmit
    ]
  );

  return form;
}
