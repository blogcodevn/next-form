export function createFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  function appendToFormData(key: string, value: unknown) {
    if (value === null || value === undefined) {
      formData.append(key, '');
    } else if (value instanceof Blob || value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        appendToFormData(`${key}[${index}]`, item);
      });
    } else if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
        appendToFormData(`${key}[${subKey}]`, subValue);
      });
    } else {
      formData.append(key, String(value));
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    appendToFormData(key, value);
  });

  return formData;
}