import { handleActionDemoForm } from "./action";
import { DemoForm } from "./components/DemoForm";

export default function Home() {
  return (
    <div className="h-dvh w-dvw flex flex-col items-center justify-center">
      <h1 className="font-bold text-center text-[24px] text-slate-100">Welcome to @blogcode/mono</h1>
      <div className="my-10 text-slate-100">This is demo of app &quot;@blogcode/next-app-form&quot;.</div>
      <div className="mb-10 text-slate-100">Demo package &quot;@blogcode/next-form&quot;.</div>
      <DemoForm action={handleActionDemoForm} />
    </div>
  );
}
