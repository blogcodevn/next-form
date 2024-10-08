import React, { FormHTMLAttributes, forwardRef, ReactElement, useMemo } from "react";
import { FormInitialProps, FormInstance } from "./types";
import { useForm } from "./useForm";

interface FormBaseProps extends FormHTMLAttributes<HTMLFormElement> {}

export interface FormProps
  extends Omit<FormBaseProps, "children" | keyof FormInitialProps>,
    FormInitialProps {
      children(form: FormInstance): ReactElement;
    }

export const Form = forwardRef<HTMLFormElement, FormProps>(
  function ServerForm(props, ref) {
    const {
      action,
      values,
      schema,
      mode,
      resolver,
      onSubmit,
      onError,
      onAfterSubmit,
      enhanceGetInputProps,
      children,
      ...rest
    } = props;

    const form = useForm({
      values,
      schema,
      mode,
      resolver,
      onSubmit,
      onError,
      onAfterSubmit,
      enhanceGetInputProps,
    });

    const formProps = useMemo(() => {
      const rs: Omit<FormBaseProps, "children"> = { ...rest };

      if (action !== undefined) {
        if (typeof action === "string") {
          rs.action = action;
          rs.onSubmit = form.handleSubmit(onSubmit as any);
        } else {
          rs.action = action as unknown as string;
        }
      } else {
        rs.onSubmit = form.handleSubmit(onSubmit as any);
      }

      return rs;
    }, [rest, onSubmit, action, form]);

    return (
      <form {...formProps} ref={ref}>
        {children(form)}
      </form>
    );
  }
);
