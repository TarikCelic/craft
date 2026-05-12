"use client";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {X, User, Camera, Eye, EyeOff, Check, Loader2} from "lucide-react";
import {
    updateName,
    updatePassword,
    updateAvatar,
    deleteAvatar,
} from "@/data/account/edit/actions";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {Reveal} from "@/components/ui/Reveal";

type Tab = "profile" | "password";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
};

export default function EditProfileModal({isOpen, onClose, user}: Props) {
    const {update} = useSession();
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [tab, setTab] = useState<Tab>("profile");

    const [name, setName] = useState(user.name ?? "");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            requestAnimationFrame(() => setAnimating(true));
        } else {
            setAnimating(false);
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const switchTab = (t: Tab) => {
        setTab(t);
        setSuccess(null);
        setError(null);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleProfileSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            let newImage: string | undefined;

            if (avatarFile) {
                const formData = new FormData();
                formData.append("avatar", avatarFile);
                const res = await updateAvatar(formData);
                if (!res.ok) throw new Error(res.message);
                if ("imageUrl" in res) newImage = res.imageUrl;
            }

            if (name !== user.name) {
                const res = await updateName(name);
                if (!res.ok) throw new Error(res.message);
            }

            await update({image: newImage, name});
            router.refresh();
            setAvatarFile(null);
            setAvatarPreview(null);
            setSuccess("Profile updated successfully.");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        if (newPassword !== confirmPassword) {
            setError("New passwords don't match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await updatePassword({oldPassword, newPassword});
            if (!res.ok) throw new Error(res.message);
            setSuccess("Password changed successfully.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    async function photoDelete() {
        const res = await deleteAvatar();
        if (!res.ok) return setError(res.message);
        await update();
        router.refresh();
        setAvatarPreview(null);
        setAvatarFile(null);
    }

    const currentAvatar = avatarPreview ?? user.image;

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: animating ? 1 : 0,
            }}
        >
            <div
                className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <Reveal direction={"fromDown"}
                    className="relative w-full max-w-md bg-white  rounded-3xl shadow-2xl border border-neutral-100  overflow-hidden"

            >
                <div className="flex items-center justify-between px-6 pt-6 pb-0">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                        Edit Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all"
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div className="flex gap-6 px-6 mt-5 border-b border-neutral-100 dark:border-zinc-800">
                    {(["profile", "password"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => switchTab(t)}
                            className={`pb-3 text-sm font-medium capitalize transition-all relative ${
                                tab === t
                                    ? "text-neutral-900 dark:text-neutral-100"
                                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                            }`}
                        >
                            {t}
                            {tab === t && (
                                <span
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-neutral-100 rounded-full"/>
                            )}
                        </button>
                    ))}
                </div>

                <div className="px-6 py-6 space-y-5">
                    {tab === "profile" ? (
                        <>
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative group">
                                    <div
                                        className="w-24 h-24 rounded-full overflow-hidden bg-neutral-900 dark:bg-zinc-800 flex items-center justify-center text-white">
                                        {currentAvatar ? (
                                            <Image
                                                src={currentAvatar}
                                                alt="Avatar"
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <User size={28}/>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileRef.current?.click()}
                                        className="absolute inset-0 rounded-full bg-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                    >
                                        <Camera size={20}/>
                                    </button>
                                </div>
                                <div className="flex gap-6 items-center">
                                    {" "}
                                    <button
                                        onClick={() => fileRef.current?.click()}
                                        className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline underline-offset-2"
                                    >
                                        Change photo
                                    </button>
                                    {" "}
                                    <button
                                        onClick={photoDelete}
                                        className="text-xs text-red-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline underline-offset-2"
                                    >
                                        Delete photo
                                    </button>
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all placeholder:text-neutral-400"
                                    placeholder="Your name"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <PasswordField
                                label="Current Password"
                                value={oldPassword}
                                onChange={setOldPassword}
                                show={showOld}
                                onToggle={() => setShowOld((v) => !v)}
                                placeholder="Enter current password"
                            />
                            <PasswordField
                                label="New Password"
                                value={newPassword}
                                onChange={setNewPassword}
                                show={showNew}
                                onToggle={() => setShowNew((v) => !v)}
                                placeholder="Min. 8 characters"
                            />
                            <PasswordField
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                show={showConfirm}
                                onToggle={() => setShowConfirm((v) => !v)}
                                placeholder="Repeat new password"
                            />
                        </>
                    )}

                    {error && (
                        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-2.5">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                            <Check size={14}/> {success}
                        </p>
                    )}

                    <button
                        onClick={tab === "profile" ? handleProfileSave : handlePasswordSave}
                        disabled={loading}
                        className="w-full py-3 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin"/>
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </Reveal>
        </div>
    );
}

function PasswordField({
                           label,
                           value,
                           onChange,
                           show,
                           onToggle,
                           placeholder,
                       }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    placeholder: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {label}
            </label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all placeholder:text-neutral-400"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
            </div>
        </div>
    );
}
