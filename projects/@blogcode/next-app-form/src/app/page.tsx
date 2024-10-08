import { handleActionDemoForm } from "./action";
import { DemoServerForm } from "./components/DemoServerForm";
import { ServerForm } from "./components/ServerForm";
import { ServerControllerForm } from "./components/ServerControllerForm";

export default function Home() {

  return (
    <div className="h-dvh w-dvw flex flex-col items-center justify-start overflow-y-auto">
      <h1 className="font-bold text-center text-[30px] text-slate-100 mt-[60px]">Welcome to @blogcode/mono</h1>
      <div className="my-10 text-slate-100">This is demo of app &quot;@blogcode/next-app-form&quot;.</div>
      <div className="mb-10 text-slate-100">Demo package &quot;@blogcode/next-form&quot;.</div>
      <DemoServerForm Inner={ServerForm} action={handleActionDemoForm} />
      <DemoServerForm Inner={ServerControllerForm} action={handleActionDemoForm} />
      {/* <DemoForm Inner={ClientForm} onSubmit={handleSubmit} /> */}
    </div>
  );
}
