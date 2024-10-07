import { ChangeEvent, FocusEvent, FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { FormError, FormFieldSchema, FormInitialProps, FormInstance, FormValidateResult } from "./types";
import { validate as validateAll } from './validate';
import { createFormData } from "./createFormData";

export type UseFormProps<FormValues extends Record<string, unknown>> = FormInitialProps<FormValues>;

export function useForm<FormValues extends Record<string, unknown>>(props: UseFormProps<FormValues>) {
  const {
    values: initialValues = {},
    schema = {},
    mode,
    ssr,
    enhanceGetInputProps,
    onSubmit,
    onError,
    action,
    onAfterSubmit,
    resolver,
  } = props;

  const [formValues, setFormValues] = useState<FormValues>(initialValues as FormValues);
  const [errors, setErrors] = useState<Record<string, FormError>>({});
  const [submitting, setSubmitting] = useState(false);

  const schemaRef = useRef(schema);

  const data = useMemo(() => createFormData(formValues), [formValues]);

  const validate = useCallback(async (name?: string, newValues?: Record<string, unknown>) => {
    const dataToValidate = newValues ?? formValues;
    let validated: FormValidateResult;

    if (resolver) {
      validated = await resolver(dataToValidate, name);
    } else {
      validated = validateAll(dataToValidate, schemaRef.current, name);
    }

    if (name) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        
        if (validated.errors[name]) {
          nextErrors[name] = validated.errors[name];
        } else {
          delete nextErrors[name];
        }

        return nextErrors;
      });
    } else {
      setErrors(() => validated.errors);
    }

    return validated;
  }, [formValues, schemaRef.current]);

  const getValues = useCallback(
    <T extends string | undefined, D extends FormValues = FormValues>(
      name?: T
    ): T extends string ? string : D => {
      type GetValueResult = T extends string ? string : D;

      if (name) {
        return formValues[name] as GetValueResult;
      }

      return formValues as GetValueResult;
    },
    [formValues]
  );

  const reset = useCallback(() => {
    setFormValues(initialValues as FormValues);
    setErrors({});
  }, [initialValues]);

  const setError = useCallback((name: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: { message },
    }));
  }, [setErrors]);

  const getInputProps = useCallback((name: string, fieldSchema?: FormFieldSchema) => {
    if (fieldSchema) {
      schemaRef.current = Object.assign({}, {
        ...schemaRef.current,
        [name]: {
          ...(schemaRef.current[name] || {}),
          ...fieldSchema
        }
      });
    }

    const baseProps = {
      name,
      error: errors[name]?.message,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setFormValues((prev) => {
          const nextValues = { ...prev, [name]: target.value };

          if (!mode || mode === "change") {
            validate(name, nextValues);
          }

          return nextValues;
        })
      },
      onBlur: (e: FocusEvent<HTMLInputElement>) => {
        if (!mode || mode === "blur") {
          validate(name);
        }
      },
      onFocus() {},
    };

    const enhancedProps = enhanceGetInputProps?.(formInstance) ?? {};

    return {
      ...baseProps,
      ...enhancedProps,
    };
  }, [errors, validate, mode, enhanceGetInputProps, setFormValues, validate]);

  const clearErrors = useCallback((name?: string) => {
    setErrors((prev) => {
      if (name) {
        const nextError = { ...prev };
        delete nextError[name];
        return nextError;
      }

      return {};
    });
  }, [setErrors]);

  const setValues = useCallback(<T extends string | Record<string, unknown>>(name: T, value?: unknown) => {
    setFormValues((prev) => {
      const isSingle = typeof name === "string";
      const keyValidate = isSingle ? name : undefined;
      const nextValues = { ...prev, ...(isSingle ? { [name]: value } : name) as Record<string, unknown> };

      if (!mode || mode === "change") {
        validate(keyValidate, nextValues);
      }

      return nextValues;
    });
  }, [setFormValues, mode, validate]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }

      const validated = await validate();
      setSubmitting(true);

      try {
        if (validated.isValid) {
          await onSubmit?.(data);
        } else {
          onError?.(validated.errors);
        }
      } catch (e) {
        onError?.(e as unknown as Record<string, FormError>);
      } finally {
        setSubmitting(false);
      }
    },
    [data, onError, onSubmit, validate]
  );

  const handleAction = useCallback(async (form: FormData) => {
    const validated = await validate();

    if (!validated.isValid) {
      onError?.(validated.errors);
      return;
    }

    setSubmitting(true);

    if (onSubmit) {
      await onSubmit(form);
      setSubmitting(false);
      return;
    }

    if (action) {
      try {
        const result = await action(form);
        onAfterSubmit?.(result);
      } catch (e) {
        onError?.(e as unknown as Record<string, FormError>);
      } finally {
        setSubmitting(false);
      }
    } else {
      onAfterSubmit?.(form);
      setSubmitting(false);
    }
  }, [action, onError, onAfterSubmit, onSubmit, validate]);

  const formInstance = useMemo(
    () => ({
      data,
      errors,
      submitting,
      getValues,
      setValues,
      setError,
      clearErrors,
      reset,
      validate,
      getInputProps,
      setSubmitting,
    } as FormInstance),
    [data, errors, submitting, ssr, getValues, setError, clearErrors, getInputProps, validate, reset]
  );

  const formProps = useMemo(() => ({
    onSubmit: ssr ? undefined : handleSubmit,
    action: ssr ? handleAction : undefined,
  }), [ssr, handleAction, handleSubmit]);

  return {
    form: formInstance,
    formProps,
  }
}