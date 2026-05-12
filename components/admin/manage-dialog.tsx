"use client";

import {useState, useTransition} from "react";
import {X, MinusCircle} from "lucide-react";


export interface ManageDialogField {
    label: string;
    value: React.ReactNode;
}

export interface ManageDialogSection {
    title: string;
    fields: ManageDialogField[];
    extra?: React.ReactNode;
}

export interface ManageDialogAction<TStatus extends string> {
    status: TStatus;
    label: string;
    colorClass: string;
}

export interface ManageDialogConfig<TStatus extends string> {

    id: number;
    title: string;

    sections: ManageDialogSection[];

    items?: React.ReactNode;

    currentStatus: TStatus;
    statusLabel: string;
    statusColorClass: string;

    actions: ManageDialogAction<TStatus>[];
    isFinal: boolean;
    requiresReason?: (status: TStatus) => boolean;
    reasonPlaceholder?: string;

    onSubmit: (
        status: TStatus,
        reason?: string,
    ) => Promise<{ success: boolean; error?: string }>;
    onClose: () => void;
}


function SectionTitle({children}: { children: React.ReactNode }) {
    return (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {children}
        </p>
    );
}

function MetaField({
                       label,
                       value,
                   }: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="mt-0.5 text-sm text-neutral-300">{value}</p>
        </div>
    );
}

export function ManageDialog<TStatus extends string>({
                                                         id,
                                                         title,
                                                         sections,
                                                         items,
                                                         currentStatus,
                                                         statusLabel,
                                                         statusColorClass,
                                                         actions,
                                                         isFinal,
                                                         requiresReason,
                                                         reasonPlaceholder = "Unesite razlog...",
                                                         onSubmit,
                                                         onClose,
                                                     }: ManageDialogConfig<TStatus>) {
    const [selectedStatus, setSelectedStatus] = useState<TStatus | null>(null);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const needsReason = selectedStatus
        ? (requiresReason?.(selectedStatus) ?? false)
        : false;

    function handleSelect(status: TStatus) {
        setSelectedStatus(status);
        setReason("");
        setError(null);
    }

    function handleSubmit() {
        if (!selectedStatus) return;

        if (needsReason && !reason.trim()) {
            setError("Ovo polje je obavezno.");
            return;
        }

        startTransition(async () => {
            const result = await onSubmit(
                selectedStatus,
                needsReason ? reason : undefined,
            );

            if (!result.success) {
                setError(result.error ?? "Došlo je do greške.");
            } else {
                onClose();
            }
        });
    }

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-neutral-900/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-neutral-950 shadow-2xl shadow-neutral-900/60">

                <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
                    <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-500">
              #{String(id).padStart(6, "0")}
            </span>
                        <h2 className="text-base font-semibold text-neutral-100">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {sections.map((section) => (
                        <div
                            key={section.title}
                            className="border-b border-neutral-800 px-6 py-4"
                        >
                            <SectionTitle>{section.title}</SectionTitle>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {section.fields.map((field) => (
                                    <MetaField
                                        key={field.label}
                                        label={field.label}
                                        value={field.value}
                                    />
                                ))}
                            </div>
                            {section.extra && <div className="mt-3">{section.extra}</div>}
                        </div>
                    ))}

                    <div className="border-b border-neutral-800 px-6 py-4">
                        <SectionTitle>Trenutni status</SectionTitle>
                        <span
                            className={[
                                "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-medium",
                                statusColorClass,
                            ].join(" ")}
                        >
              {statusLabel}
            </span>
                    </div>

                    {items && (
                        <div className="border-b border-neutral-800 px-6 py-4">
                            <SectionTitle>Stavke</SectionTitle>
                            {items}
                        </div>
                    )}

                    <div className="px-6 py-4">
                        {isFinal ? (
                            <div
                                className="rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-3 text-sm text-neutral-500">
                                Stavka je u finalnom stanju i ne može se više mijenjati.
                            </div>
                        ) : (
                            <>
                                <SectionTitle>Promjena statusa</SectionTitle>
                                <div className="flex flex-wrap gap-2">
                                    {actions.map(({status, label, colorClass}) => (
                                        <button
                                            key={status}
                                            onClick={() => handleSelect(status)}
                                            className={[
                                                "rounded border px-4 py-2 text-sm font-medium transition-all duration-150",
                                                colorClass,
                                                selectedStatus === status
                                                    ? "ring-2 ring-white/20 ring-offset-1 ring-offset-neutral-950"
                                                    : "",
                                            ].join(" ")}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {needsReason && (
                                    <div className="mt-4">
                                        <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                                            Razlog <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => {
                                                setReason(e.target.value);
                                                setError(null);
                                            }}
                                            rows={3}
                                            placeholder={reasonPlaceholder}
                                            className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-colors focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <p className="mt-3 flex items-center gap-1.5 text-sm text-red-400">
                                        <MinusCircle size={20}/>
                                        {error}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {!isFinal && (
                    <div className="border-t border-neutral-800 px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
                            >
                                Odustani
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedStatus || isPending}
                                className="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-semibold text-neutral-900 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                    Čuvanje...
                  </span>
                                ) : (
                                    "Sačuvaj promjene"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
