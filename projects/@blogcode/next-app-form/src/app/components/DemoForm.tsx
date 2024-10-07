"use client";

import { FC } from "react";
import { Form } from "@blogcode/next-form";

export interface DemoFormProps {
  action: (data: FormData) => Promise<unknown>;
}

export const DemoForm: FC<DemoFormProps> = (props) => {
  const { action } = props;

  return (
    <Form
      action={action}
      className="w-full max-w-[400px] mx-auto border border-slate-700 rounded-lg p-8"
    >
      {(form) => {
        console.log(form.errors);
        return (
          <>
            <div className="w-full text-sm mb-6">
              <label className="block text-slate-200 mb-1">Username:</label>
              <div className="flex items-center border border-slate-600 rounded h-10 min-h-[40px]">
                <input
                  className="w-full h-full bg-transparent outline-0 px-2 text-slate-200"
                  placeholder="Enter your username"
                  {...form.getInputProps("username", {
                    required: true,
                    minLength: [4, "Username must be at least 4 characters"],
                  })}
                />
              </div>
              {!!form.errors.username?.message && (
                <div className="text-xs text-red-500 mt-1">{form.errors.username.message}</div>
              )}
            </div>
            <div className="w-full text-sm mb-6">
              <label className="block text-slate-200 mb-1">Firstname:</label>
              <div className="flex items-center border border-slate-600 rounded h-10 min-h-[40px]">
                <input
                  className="w-full h-full bg-transparent outline-0 px-2 text-slate-200"
                  placeholder="Enter your fullname"
                  {...form.getInputProps("firstname", {
                    required: "Firstname is required",
                    maxLength: [10, "Firstname must be at most 10 characters"],
                  })}
                />
              </div>
              {!!form.errors.firstname?.message && (
                <div className="text-xs text-red-500 mt-1">{form.errors.firstname.message}</div>
              )}
            </div>
            <div className="w-full text-sm mb-6">
              <label className="block text-slate-200 mb-1">Lastname:</label>
              <div className="flex items-center border border-slate-600 rounded h-10 min-h-[40px]">
                <input
                  className="w-full h-full bg-transparent outline-0 px-2 text-slate-200"
                  placeholder="Enter your lastname"
                  {...form.getInputProps("lastname", {
                    required: "Lastname is required",
                    pattern: [/^[A-Za-z]+$/, "Lastname must be alphabetic characters"],
                  })}
                />
              </div>
              {!!form.errors.lastname?.message && (
                <div className="text-xs text-red-500 mt-1">{form.errors.lastname.message}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full h-10 bg-slate-800 text-slate-200 rounded-lg transition-all active:scale-95"
            >
              Submit
            </button>
          </>
        );
      }}
    </Form>
  );
};
