export function createFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value?.toString() ?? "");
  });

  return formData;
}
