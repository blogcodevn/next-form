"use client";

import { FC } from "react";
import { Controller } from "@blogcode/next-form/Controller";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { FormInnerProps } from "./DemoServerForm";

export const ServerControllerForm: FC<FormInnerProps> = (props) => {
  const { form } = props;

  console.log(form);

  return (
    <>
      <h2 className="text-lg text-center text-slate-200 font-bold mb-4">
        Server Controller Form
      </h2>
      <Controller
        name="name"
        form={form}
        render={({ field }) => (
          <TextInput
            label="Name"
            className="mb-4"
            {...field}
          />
        )}
      />
      <Controller
        name="email"
        form={form}
        render={({ field }) => (
          <TextInput
            label="Email"
            className="mb-4"
            {...field}
          />
        )}
      />
      <Button type="submit" className="min-w-[150px]">
        Submit
      </Button>
    </>
  );
};