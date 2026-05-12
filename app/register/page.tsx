"use client";
import React, {useState} from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import {RegisterUser} from "@/data/auth/actions";
import {toast} from "sonner";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {Reveal} from "@/components/ui/Reveal";

const CraftLogin = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPW, setConfirmPW] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await RegisterUser(name, email, password, confirmPW);
            if (user?.error) throw new Error(user.error);

            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error)
                throw new Error("Registracija uspješna, ali login nije uspio.");

            toast.success("Uspješno ste se registrovali!");
            setTimeout(() => router.push("/account"), 1000);
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : "Greška prilikom registracije.",
            );
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white flex font-sans antialiased text-slate-900">
            <Reveal direction={"fromLeft"}
                    className="hidden lg:flex lg:w-[45%] bg-[#F8F9FA] p-16 flex-col justify-between border-r border-slate-100">
                <div>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-500"></div>
                        <span className="text-2xl font-bold tracking-tighter uppercase italic relative w-36">
              <Image src={Logo} alt=""/>
            </span>
                    </Link>
                </div>
                <div className="max-w-md">
          <span className="text-blue-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">
            New Collection 2026
          </span>
                    <h1 className="text-6xl font-light leading-[1.1] mb-6 tracking-tight">
                        Minimalism is a <br/>
                        <span className="font-medium">state of mind.</span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed font-light">
                        Bringing the essence of Scandinavian comfort to your workspace.
                        Quality materials, ethical sourcing, and timeless design.
                    </p>
                </div>
                <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Living Room</span>
                    <span>Workspace</span>
                    <span>Bedroom</span>
                </div>
            </Reveal>

            <Reveal fade duration={1000} className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-[400px]">
                    <div className="mb-12">
                        <h2 className="text-3xl font-light mb-2">Welcome</h2>
                        <p className="text-slate-400 font-light">
                            Please enter your credentials to sign in.
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleLogin}>
                        <div className="relative group">
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent"
                                placeholder="Name"
                                required
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-0 -top-3.5 text-slate-400 text-xs uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                            >
                                Name
                            </label>
                        </div>
                        <div className="relative group">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent"
                                placeholder="Email"
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 -top-3.5 text-slate-400 text-xs uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                            >
                                Email Address
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent"
                                placeholder="Password"
                                required
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-0 -top-3.5 text-slate-400 text-xs uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                            >
                                Password
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                type="password"
                                id="confirmPW"
                                value={confirmPW}
                                onChange={(e) => setConfirmPW(e.target.value)}
                                className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent"
                                placeholder="Confirm Password"
                                required
                            />
                            <label
                                htmlFor="confirmPW"
                                className="absolute left-0 -top-3.5 text-slate-400 text-xs uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                            >
                                Confirm Password
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 border-slate-200 rounded-none text-blue-500 focus:ring-0 transition-all"
                                />
                                <span className="text-sm text-slate-400 group-hover:text-slate-600">
                  Keep me signed in
                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 py-5 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-900 transition-all duration-500 ease-in-out shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Prijavljivanje..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-16 flex flex-col gap-4">
                        <p className="text-slate-400 text-sm font-light">
                            Already have an account? <br/>
                            <Link
                                href="/login"
                                className="text-blue-500 font-bold hover:text-neutral-900 transition-colors border-b border-blue-500/20 hover:border-neutral-900"
                            >
                                Log in to continue.
                            </Link>
                        </p>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};

export default CraftLogin;
