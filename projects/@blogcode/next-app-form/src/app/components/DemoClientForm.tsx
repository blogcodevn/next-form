/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, FormEvent } from "react";
import { TextInput } from "./TextInput";
import { Button } from "./Button";
import { DemoServerForm, FormInnerProps } from "./DemoServerForm";

export const DemoClientForm: FC = () => {

  const handleSubmit = (e: FormEvent<HTMLFormElement>, values: any) => {
    console.log("Submit at demo", e, values);
  };

  const Inner: FC<FormInnerProps> = ({ form }) => {
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

  return <DemoServerForm Inner={Inner} onSubmit={handleSubmit as any} />;
};