import React, { FormHTMLAttributes, forwardRef, PropsWithChildren, ReactElement, useMemo } from "react";
import { useForm } from "./useForm";
import { FormInitialProps, FormInstance } from "./types";

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
          rs.onSubmit = onSubmit;
        } else {
          rs.action = action as unknown as string;
        }
      } else {
        rs.onSubmit = onSubmit;
      }

      return rs;
    }, [rest]);

    return (
      <form {...formProps} ref={ref}>
        {children(form)}
      </form>
    );
  }
);
