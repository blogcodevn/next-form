"use client";

import { FC } from "react";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { FormInnerProps } from "./DemoServerForm";

export const ClientForm: FC<FormInnerProps> = (props) => {
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