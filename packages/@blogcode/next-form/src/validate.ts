import { FormError, FormFieldSchema, FormValidateResult } from "./types";

export function validateField(
  name: string,
  value: unknown,
  schema: Record<string, FormFieldSchema>
): FormError | null {
  const fieldSchema = schema[name];

  if (!fieldSchema) {
    return null;
  }

  if (fieldSchema.required && !value) {
    return {
      message: typeof fieldSchema.required === "string"
        ? fieldSchema.required
        : `${name} is required`
    };
  }

  if (fieldSchema.min !== undefined) {
    const numValue = Number(value).valueOf();
    const [min, message] = Array.isArray(fieldSchema.min)
      ? fieldSchema.min
      : [fieldSchema.min, `Must be at least ${fieldSchema.min}`];

    if (Number.isNaN(numValue) || Number.isFinite(numValue)) {
      return { message: "Value must be a number" };
    }

    if (numValue < min) {
      return { message };
    }
  }

  if (fieldSchema.max !== undefined) {
    const numValue = Number(value).valueOf();
    const [max, message] = Array.isArray(fieldSchema.max)
      ? fieldSchema.max
      : [fieldSchema.max, `Must be at most ${fieldSchema.max}`];

    if (Number.isNaN(numValue) || Number.isFinite(numValue)) {
      return { message: "Value must be a number" };
    }

    if (numValue > max) {
      return { message };
    }
  }

  if (fieldSchema.minLength !== undefined) {
    const [min, message] = Array.isArray(fieldSchema.minLength)
      ? fieldSchema.minLength
      : [fieldSchema.minLength, `Must be at least ${fieldSchema.minLength}`];

    if (typeof value === "string" && value.length < min) {
      return { message };
    }

    if (typeof value === "number" && value.toString().length < min) {
      return { message };
    }

    if (Array.isArray(value) && value.length < min) {
      return { message };
    }

    if (value instanceof File && value.size < min) {
      return { message };
    }

    if (typeof value === "object" && !!value && Object.keys(value).length < min) {
      return { message };
    }
  }

  if (fieldSchema.maxLength !== undefined) {
    const [max, message] = Array.isArray(fieldSchema.maxLength)
      ? fieldSchema.maxLength
      : [fieldSchema.maxLength, `Must be at most ${fieldSchema.maxLength}`];

    if (typeof value === "string" && value.length > max) {
      return { message };
    }

    if (typeof value === "number" && value.toString().length > max) {
      return { message };
    }

    if (Array.isArray(value) && value.length > max) {
      return { message };
    }

    if (value instanceof File && value.size > max) {
      return { message };
    }

    if (typeof value === "object" && !!value && Object.keys(value).length > max) {
      return { message };
    }
  }

  if (fieldSchema.pattern) {
    const [pattern, message] = Array.isArray(fieldSchema.pattern)
      ? fieldSchema.pattern
      : [fieldSchema.pattern, "Invalid format value"];

    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;

    if (!regex.test(value?.toString() ?? "")) {
      return { message };
    }
  }

  if (fieldSchema.oneOf) {
    const [values, message] = Array.isArray(fieldSchema.oneOf[0])
      ? fieldSchema.oneOf
      : [fieldSchema.oneOf, `Must be one of: ${(fieldSchema.oneOf as Array<string | number>).join(', ')}`];

    if (!values.includes(value)) {
      return { message };
    }
  }

  return null;
}

function validateSingle(
  name: string,
  value: unknown,
  schema: Record<string, FormFieldSchema>,
  result: FormValidateResult
) {
  const error = validateField(name, value, schema);

  if (error) {
    result.isValid = false;
    result.errors[name] = error;
  }
}

export function validate(
  data: Record<string, unknown>,
  schema: Record<string, FormFieldSchema>,
  name?: string
): FormValidateResult {
  const result: FormValidateResult = {
    isValid: true,
    errors: {}
  };

  if (name) {
    validateSingle(name, data[name], schema, result);
    return result;
  }
  
  Object.keys(schema).forEach((name) => validateSingle(name, data[name], schema, result));
  return result;
}
