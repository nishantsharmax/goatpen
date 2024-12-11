import { Metadata } from "next";
import { redirect } from "next/navigation";
import LogInForm from "./loginForm";
import { isLoggedIn } from "../utils/server-auth";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function Login() {
  if (isLoggedIn()) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-black from-35% via-orange-700 via-60% to-black to-100% bg-fixed pt-44 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_.1px,transparent_0.5px),linear-gradient(to_bottom,#ffffff1a_.1px,transparent_0.5px)] bg-[size:40px_40px]"></div>

      <div className="w-full max-w-md rounded-lg bg-white/10 p-6 shadow-lg backdrop-blur-lg sm:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome</h1>
          <p className="mt-2 text-sm text-gray-200">
            Please enter your credentials to log in.
          </p>
        </div>
        <LogInForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            The password matches the one set at docker runtime.
          </p>
        </div>
      </div>
    </div>
  );
}
