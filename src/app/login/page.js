"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const WELCOME_STORAGE_KEY = "taskify:show-welcome";

const cardClass =
  "rounded-[24px] border border-black/5 bg-[#E9E9E9] shadow-[2px_6px_10px_rgba(0,0,0,0.08),6px_12px_22px_rgba(0,0,0,0.12)]";
const inputGroupClass =
  "space-y-4 rounded-[24px] border border-black/5 bg-[#F0F0F0] p-3 shadow-[2px_6px_10px_rgba(0,0,0,0.05),5px_10px_18px_rgba(0,0,0,0.08)]";
const fieldClass =
  "h-14 w-full rounded-[24px] border border-black/5 bg-[#F0F0F0] px-5 text-base text-black placeholder:text-black/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 focus:border-black/10 focus:scale-[1.01] focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),2px_6px_10px_rgba(0,0,0,0.08)]";
const buttonClass =
  "h-14 w-full cursor-pointer rounded-[24px] border border-black/5 bg-[#F0F0F0] text-base font-semibold text-black shadow-[2px_6px_10px_rgba(0,0,0,0.08),6px_12px_22px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_8px_12px_rgba(0,0,0,0.09),8px_16px_28px_rgba(0,0,0,0.14)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[3px_8px_12px_rgba(0,0,0,0.09),8px_16px_28px_rgba(0,0,0,0.14)] active:translate-y-px active:shadow-[1px_4px_8px_rgba(0,0,0,0.1),4px_9px_16px_rgba(0,0,0,0.12)]";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [today, setToday] = useState("");
  const router = useRouter();

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem(WELCOME_STORAGE_KEY, "true");
      toast.success("Logged in!");
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#D7D7D7] px-4 py-5 text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
        <header className="grid gap-3 py-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Link
            href="/login"
            className="justify-self-start font-camood text-2xl font-semibold tracking-[0.24em] text-black"
          >
            TASKIFY
          </Link>

          <p className="justify-self-center text-sm font-semibold text-black/70 sm:text-lg">
            {today || "\u00A0"}
          </p>

          <div className="hidden sm:block" />
        </header>

        <main className="flex flex-1 items-center justify-center py-8">
          <section className={`${cardClass} w-full max-w-115 p-6 sm:p-8`}>
            <div className="mb-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
                Welcome Back
              </p>
              <div className="space-y-2">
                <h1 className="font-camood text-4xl font-semibold text-black sm:text-[2.75rem]">
                  Login
                </h1>
                <p className="max-w-sm text-sm leading-6 text-black/60">
                  Step back into your task flow with the same calm workspace you
                  left behind.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className={inputGroupClass}>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="px-1 text-sm font-semibold text-black/70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    className={fieldClass}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="px-1 text-sm font-semibold text-black/70"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`${fieldClass} pr-14`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-black/55 transition-colors duration-200 hover:text-black"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className={buttonClass}>
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-black/60">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-black transition-opacity duration-200 hover:opacity-70"
              >
                Sign up
              </Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
