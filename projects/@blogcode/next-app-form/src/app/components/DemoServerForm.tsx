"use client";

import { FC } from "react";
import { Form } from "@blogcode/next-form/dist/Form";
import { FormProps } from "@blogcode/next-form/dist/types";
import { FormInstance } from "@blogcode/next-form";
import { schema } from "./utils";

export interface FormInnerProps {
  form: FormInstance;
}

export interface DemoFormProps extends Omit<FormProps, "children"> {
  Inner: FC<FormInnerProps>;
}

const formClassName = "w-full max-w-[400px] mx-auto border border-slate-700 rounded-lg p-10 mb-10";

export const DemoServerForm: FC<DemoFormProps> = (props) => {
  const { Inner, ...rest } = props;

  return (
    <Form {...rest} schema={schema} className={formClassName}>
      {(form) => <Inner form={form} />}
    </Form>
  );
};