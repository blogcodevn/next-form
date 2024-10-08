"use client";

import { FC } from "react";
import { Button } from "./Button";
import { TextInput } from "./TextInput";
import { FormInnerProps } from "./DemoServerForm";

export const ServerForm: FC<FormInnerProps> = (props) => {
  const { form } = props;

  return (
    <>
      <h2 className="text-lg text-center text-slate-200 font-bold mb-4">
        Server Form
      </h2>
      <TextInput
        label="Name"
        className="mb-4"
        {...form.getInputProps("name")}
      />
      <TextInput
        label="Email"
        className="mb-4"
        {...form.getInputProps("email")}
      />
      <Button type="submit" className="min-w-[150px]">
        Submit
      </Button>
    </>
  );
};
