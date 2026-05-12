"use client";
import {makeOrder} from "@/data/cart/actions";
import {useState} from "react";
import {
    X,
    MapPin,
    User,
    Phone,
    Mail,
    Home,
    ChevronRight,
    Package,
    Check,
} from "lucide-react";
import {Reveal} from "@/components/ui/Reveal";

interface CheckoutModalProps {
    open: boolean;
    userID: string | undefined;
    onClose: () => void;
    total: number;
    onSuccess: () => void;
}

interface ShippingForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    note: string;
}

const INITIAL_FORM: ShippingForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    note: "",
};

export default function CheckoutModal({open, userID, onClose, total, onSuccess}: CheckoutModalProps) {
    const [form, setForm] = useState<ShippingForm>(INITIAL_FORM);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<ShippingForm>>({});

    if (!open) return null;

    const validate = (): boolean => {
        const newErrors: Partial<ShippingForm> = {};
        if (!form.firstName.trim()) newErrors.firstName = "Required field";
        if (!form.lastName.trim()) newErrors.lastName = "Required field";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
        if (!form.phone.trim()) newErrors.phone = "Required field";
        if (!form.address.trim()) newErrors.address = "Required field";
        if (!form.city.trim()) newErrors.city = "Required field";
        if (!form.postalCode.trim()) newErrors.postalCode = "Required field";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof ShippingForm, value: string) => {
        setForm((prev) => ({...prev, [field]: value}));
        if (errors[field]) setErrors((prev) => ({...prev, [field]: undefined}));
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        await makeOrder({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            note: form.note,
        });
        onSuccess();
        setSubmitted(true);
    };

    const handleClose = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setSubmitted(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <Reveal direction={"fromDown"}
                    className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
                <div
                    className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-900/8 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Package size={16} className="text-blue-600"/>
                        </div>
                        <div>
                            <p className="text-base font-semibold text-gray-900 leading-tight">Shipping Information</p>
                            <p className="text-xs text-gray-400">Fill in the shipment details</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                    >
                        <X size={16}/>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-5">
                    {submitted ? (
                        <SuccessScreen onClose={handleClose}/>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Field
                                    label="First Name"
                                    icon={<User size={13} className="text-gray-400"/>}
                                    value={form.firstName}
                                    onChange={(v) => handleChange("firstName", v)}
                                    error={errors.firstName}
                                    placeholder="e.g. Amir"
                                />
                                <Field
                                    label="Last Name"
                                    value={form.lastName}
                                    onChange={(v) => handleChange("lastName", v)}
                                    error={errors.lastName}
                                    placeholder="e.g. Hodzic"
                                />
                            </div>

                            <Field
                                label="Email Address"
                                icon={<Mail size={13} className="text-gray-400"/>}
                                value={form.email}
                                onChange={(v) => handleChange("email", v)}
                                error={errors.email}
                                placeholder="email@example.com"
                                type="email"
                            />

                            <Field
                                label="Phone Number"
                                icon={<Phone size={13} className="text-gray-400"/>}
                                value={form.phone}
                                onChange={(v) => handleChange("phone", v)}
                                error={errors.phone}
                                placeholder="+387 61 000 000"
                                type="tel"
                            />

                            <Field
                                label="Address"
                                icon={<Home size={13} className="text-gray-400"/>}
                                value={form.address}
                                onChange={(v) => handleChange("address", v)}
                                error={errors.address}
                                placeholder="Street and number"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Field
                                    label="City"
                                    icon={<MapPin size={13} className="text-gray-400"/>}
                                    value={form.city}
                                    onChange={(v) => handleChange("city", v)}
                                    error={errors.city}
                                    placeholder="e.g. Sarajevo"
                                />
                                <Field
                                    label="Postal Code"
                                    value={form.postalCode}
                                    onChange={(v) => handleChange("postalCode", v)}
                                    error={errors.postalCode}
                                    placeholder="71000"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Note (optional)
                                </label>
                                <textarea
                                    value={form.note}
                                    onChange={(e) => handleChange("note", e.target.value)}
                                    placeholder="Special delivery instructions..."
                                    rows={2}
                                    className="w-full px-3 py-2.5 border border-neutral-900/10 rounded-xl text-sm text-gray-800 outline-none focus:border-blue-400 resize-none transition-colors placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {!submitted && (
                    <div className="px-6 py-4 border-t border-neutral-900/8 shrink-0 bg-white">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">Total to pay</span>
                            <span className="text-base font-bold text-gray-900">{total.toFixed(2)} KM</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            Confirm Order
                            <ChevronRight size={15}/>
                        </button>
                    </div>
                )}
            </Reveal>
        </div>
    );
}

function Field({label, icon, value, onChange, error, placeholder, type = "text"}: {
    label: string;
    icon?: React.ReactNode;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder?: string;
    type?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${icon ? "pl-8" : "pl-3"} pr-3 py-2.5 border rounded-xl text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-300
                        ${error ? "border-red-400 focus:border-red-500 bg-red-50/30" : "border-neutral-900/10 focus:border-blue-400"}`}
                />
            </div>
            {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
    );
}

function SuccessScreen({onClose}: { onClose: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <Check size={32} strokeWidth={2} className="text-green-500"/>
            </div>
            <div>
                <p className="text-lg font-semibold text-gray-900">Order Confirmed!</p>
                <p className="text-sm text-gray-400 mt-1">We will contact you soon via your email address.</p>
            </div>
            <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors"
            >
                Close
            </button>
        </div>
    );
}