import * as Yup from "yup";
import { FormValidateResult } from "./types";

type YupResolver = (data: Record<string, unknown>, name?: string) => Promise<FormValidateResult>;

export function yupResolver(schema: any): YupResolver {
  return async function validate(data: Record<string, unknown>, name?: string): Promise<FormValidateResult> {
    const result: FormValidateResult = {
      isValid: true,
      errors: {}
    };

    try {
      if (name) {
        const fieldSchema = schema.fields[name];

        if (fieldSchema) {
          await fieldSchema.validate(data[name], { abortEarly: false });
        }
      } else {
        await schema.validate(data, { abortEarly: false });
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        result.isValid = false;

        error.inner.forEach((err) => {
          result.errors[err.path!] = { ...err };
        });
      }
    }

    return result;
  };
}
