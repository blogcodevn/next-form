import Joi from "joi";
import { FormValidateResult } from "./types";

export type JoiResolver = (data: Record<string, unknown>, name?: string) => Promise<FormValidateResult>;

export function joiResolver(schema: Joi.ObjectSchema): JoiResolver {
  return async function validate(data: Record<string, unknown>, name?: string): Promise<FormValidateResult> {
    const result: FormValidateResult = {
      isValid: true,
      errors: {}
    };

    try {
      if (name) {
        const fieldSchema = schema.extract(name);

        if (fieldSchema) {
          await fieldSchema.validateAsync(data[name], { abortEarly: false });
        }
      } else {
        await schema.validateAsync(data, { abortEarly: false });
      }
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        result.isValid = false;

        error.details.forEach((err) => {
          const path = err.path.join(".");
          result.errors[path] = { ...err };
        });
      }
    }

    return result;
  }
};
