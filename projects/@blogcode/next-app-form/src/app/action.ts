"use server";

export async function handleActionDemoForm(data: FormData) {
  const values = {
    username: encodeURIComponent(data.get("username") as string),
    firstname: encodeURIComponent(data.get("firstname") as string),
    lastname: encodeURIComponent(data.get("lastname") as string),
  };

  console.log(values);

  // return {
  //   message: "Form submitted",
  //   values,
  // };
}
