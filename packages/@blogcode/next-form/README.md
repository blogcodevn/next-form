# @blogcode/next-form

`@blogcode/next-form` is a flexible and powerful form management library for Next.js applications. 
It provides an easy-to-use API for handling form state, validation, and submission in both client-side 
and server-side rendering scenarios.

## CHANGE LOG

- `0.0.6`
  - `createFormData` function support fully type.
- `0.0.5`:
  - Add action function for error `Warning: Extra attributes from the server: action`;
    - If using as CSR, set action as a void function.
  - `throw new Error('React form unexpectedly submitted.')`.
    - Cannot using import via exported to `index.tsx` of package.
    - Import directly to file contain Form will fix this.
    - Removed exported to `index.tsx`. If using Form and Controller, let's import directly to file.
      - `import { Form } from "@blogcode/next-form/Form";`
      - `import { Controller } from "@blogcode/next-form/Controller";`
  - `javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`
    - This error is caused by hot reload so it will not appear in production environment. Therefore we will not try to fix it.
  - The logic handler from server action (`action`) to client (`onAfterSubmit`) removed. 
    - Although it has been tested in a real project and it works fine, in order to fix the Server Action errors listed here, it is temporarily removed.
    - It may reappear in the future if it does not cause errors. We are still working around it.
  - Removed `props.ssr`. Because server and client threads will be used independently, this flag has no effect anymore.
  - Some types have been redefined to better accommodate the new treatment.

- `0.0.4`:
  - Fix `Controller` component does not required `props.form`.
  - That mean when using without `Form` Component wrapped it, you must be passed `form` for `Controller`.

- `0.0.3`:
  - Fix typeof value of `ControllerRenderField` from `unknown` to `string`.

- `0.0.2`:
  - Fix export `value` as set default as empty string for `getInputProps`.
  - Change type of value from `unknown` to `string`.

## Installation

To install `@blogcode/next-form`, run the following command in your project directory:

```sh
npm i @blogcode/next-form
```

Or if you're using yarn:

```sh
yarn add @blogcode/next-form
```

**[Check demo code at here](https://github.com/blogcodevn/next-form/blob/develop/projects/%40blogcode/next-app-form/src/app/page.tsx)**

## Features

- Easy form state management with useForm hook
- Built-in form validation
- Support for both client-side and server-side rendering
- Flexible form submission handling
- Integration with popular validation libraries (Zod, Yup, Joi)
- Customizable input props
- Controlled and uncontrolled component support

## useForm hook

The `useForm` hook is the core of `@blogcode/next-form`. It provides form state management, validation, and submission handling.

### Basic usage

```tsx
import { useForm } from '@blogcode/next-form';

function MyForm() {
  const { form, formProps } = useForm({
    values: { name: '', email: '' },
    onSubmit: (e, data) => {
      console.log(data);
    },
  });

  return (
    <form {...formProps}>
      <input {...form.getInputProps('name')} />
      <input {...form.getInputProps('email')} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### UseFormProps

The `useForm` hook accepts the following props:

- `action?: FormAction<unknown>`: A function to handle form submission on the server-side.
- `onSubmit?(data: FormData): void`: A function to handle form submission on the client-side.
- `onAfterSubmit?(data: unknown): void`: A function called after successful form submission.
- `onError?(error: Record<string, FormError>): void`: A function to handle validation or submission errors.
- `enhanceGetInputProps?(form: FormInstance): Partial<InputHTMLAttributes<HTMLInputElement>>`: A function to customize input props.
- `resolver?: FormResolver`: A custom validation resolver function.
- `values?: FormValues`: Initial form values.
- `schema?: FormSchema`: A schema object for built-in validation.
- `ssr?: boolean`: Enable server-side rendering support.
- `mode?: FormMode`: Validation mode (`'change'`, `'blur'`, or `'submit'`).

### Using with built-in schema

`@blogcode/next-form` provides a built-in validation system using a schema object:

```tsx
const { form, formProps } = useForm({
  values: { name: '', email: '' },
  schema: {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  },
  onSubmit: (e, data) => {
    console.log(data);
  },
});
```

### Using with SSR

For server-side rendering support, use the `ssr` prop and provide an `action` function:

```tsx
const { form, formProps } = useForm({
  ssr: true,
  action: async (formData) => {
    // Handle server-side form submission
    const result = await submitToServer(formData);
    return result;
  },
  onAfterSubmit: (result) => {
    console.log('Server response:', result);
  },
  onError: (errors) => {
    console.error('Submission errors:', errors);
  },
});
```

### Using with CSR

For client-side rendering, use the `onSubmit` prop:

```tsx
const { form, formProps } = useForm({
  onSubmit: (e, formData) => {
    // Handle client-side form submission
    console.log('Form data:', formData);
  },
  onError: (errors) => {
    console.error('Validation errors:', errors);
  },
});
```

## Form component

The `Form` component is a wrapper that simplifies form creation and management.

### Using with children as ReactElement

```tsx
import { Form } from '@blogcode/next-form';

function MyForm() {
  return (
    <Form
      values={{ name: '', email: '' }}
      onSubmit={(e, data) => console.log(data)}
    >
      <input name="name" />
      <input name="email" type="email" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Using with children as function

```tsx
import { Form } from '@blogcode/next-form';

function MyForm() {
  return (
    <Form
      values={{ name: '', email: '' }}
      onSubmit={(e, data) => console.log(data)}
    >
      {(form) => (
        <>
          <input {...form.getInputProps('name')} />
          <input {...form.getInputProps('email')} type="email" />
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
```

## Controller component

The `Controller` component allows you to create controlled inputs with ease:

```tsx
import { Form, Controller } from '@blogcode/next-form';

function MyForm() {
  return (
    <Form
      values={{ name: '', email: '' }}
      onSubmit={(e, data) => console.log(data)}
    >
      <Controller
        name="name"
        render={({ field, fieldState }) => (
          <input
            {...field}
            placeholder="Name"
            style={{ borderColor: fieldState.error ? 'red' : 'initial' }}
          />
        )}
      />
      <Controller
        name="email"
        render={({ field, fieldState }) => (
          <input
            {...field}
            type="email"
            placeholder="Email"
            style={{ borderColor: fieldState.error ? 'red' : 'initial' }}
          />
        )}
      />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Using with Validation Libraries

`@blogcode/next-form` can be integrated with popular validation libraries for more advanced validation scenarios.

### Zod

```tsx
import { z } from 'zod';
import { useForm } from '@blogcode/next-form';
import { zodResolver } from '@blogcode/next-form/zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

function MyForm() {
  const { form, formProps } = useForm({
    resolver: zodResolver(schema),
    onSubmit: (data) => console.log(data),
  });

  // ... rest of the component
}
```

### Yup

```tsx
import * as yup from 'yup';
import { useForm } from '@blogcode/next-form';
import { yupResolver } from '@blogcode/next-form/yup';

const schema = yup.object().shape({
  name: yup.string().required().min(2),
  email: yup.string().required().email(),
});

function MyForm() {
  const { form, formProps } = useForm({
    resolver: yupResolver(schema),
    onSubmit: (data) => console.log(data),
  });

  // ... rest of the component
}
```

### Joi


```tsx
import Joi from 'joi';
import { useForm } from '@blogcode/next-form';
import { joiResolver } from '@blogcode/next-form/joi';

const schema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().required().email(),
});

function MyForm() {
  const { form, formProps } = useForm({
    resolver: joiResolver(schema),
    onSubmit: (data) => console.log(data),
  });

  // ... rest of the component
}
```

## Known issues

- When using the `Controller` component, the `onChange` and `onBlur` handlers may not behave correctly in all scenarios. 
We are working on resolving this issue in future updates.
