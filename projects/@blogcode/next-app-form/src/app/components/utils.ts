import { FormScheam } from "@blogcode/next-form";

export const schema: FormScheam = {
  name: {
    required: true,
    minLength: [3, "Name must be at least 3 characters"],
  },
  email: {
    required: true,
    minLength: [3, "Email must be at least 3 characters"],
    pattern: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"],
  },
};

export const formClassName = "w-full max-w-[400px] mx-auto border border-slate-700 rounded-lg p-10 mb-10";
