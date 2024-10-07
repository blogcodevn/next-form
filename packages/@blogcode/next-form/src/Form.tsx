import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useImperativeHandle,
  useRef,
} from "react";
import { FormBaseProps, FormProps, FormRef } from "./types";
import { useForm } from "./useForm";

export const Form = forwardRef<FormRef, FormProps>(
  function Form(props, ref) {
    const {
      children,
      values: initialValues = {},
      schema = {},
      mode,
      ssr = true,
      autoComplete = "off",
      enhanceGetInputProps,
      onSubmit,
      onError,
      action,
      onAfterSubmit,
      ...rest
    } = props;

    const { form, formProps } = useForm({
      values: initialValues,
      schema,
      mode,
      ssr,
      enhanceGetInputProps,
      onSubmit,
      onError,
      action,
      onAfterSubmit,
    });

    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => ({
      ...formRef.current,
      ...form,
    } as FormRef), [formRef.current, form])

    return (
      <form
        {...rest}
        {...formProps as FormBaseProps}
        ref={formRef}
        autoComplete={autoComplete}
      >
        {(() => {
          if (typeof children === "function") {
            return children(form);
          }

          const childrenArray = Children.toArray(children);

          return childrenArray.map((child, index) => {
            return isValidElement(child)
              ? cloneElement(child, {
                ...child.props,
                key: child.key || index,
                form: form,
              })
              : null;
          });
        })()}
      </form>
    );
  }
);

Form.displayName = "@blogcode/next-form/Form";
