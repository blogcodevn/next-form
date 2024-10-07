import { z } from "zod";
import { FormValidateResult } from "./types";

export type ZodResolver = (data: Record<string, unknown>, name?: string) => Promise<FormValidateResult>;

export function zodResolver(schema: z.ZodObject<any, any>): ZodResolver {
  return async function validate(data: Record<string, unknown>, name?: string): Promise<FormValidateResult> {
    const result: FormValidateResult = {
      isValid: true,
      errors: {}
    };

    try {
      if (name) {
        const fieldSchema = schema.shape[name];

        if (!fieldSchema) {
          await fieldSchema.parseAsync(data[name]);
        }
      } else {
        await schema.parseAsync(data);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        result.isValid = false;

        error.errors.forEach((err) => {
          const path = err.path.join('.');
          result.errors[path] = { ...err };
        });
      }
    }

    return result;
  };
}