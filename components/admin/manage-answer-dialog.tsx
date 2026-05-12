"use client";

import {useState} from "react";
import {AnswerStatus} from "@/app/generated/prisma";
import {updateMessageStatus} from "@/data/admin/messages/actions";
import type {ContactMessageSerialized} from "@/types";

type Props = {
    message: ContactMessageSerialized;
    onCloseAction: () => void;
};

export function ManageMessageDialog({message, onCloseAction}: Props) {
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const isAnswered = message.status === AnswerStatus.ANSWERED;

    async function handleSubmit() {
        if (!answer.trim()) return;
        setLoading(true);
        await updateMessageStatus(
            message.id,
            AnswerStatus.ANSWERED,
            answer,
            message.userId ?? undefined
        );
        setLoading(false);
        onCloseAction();
    }

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm"
            onClick={onCloseAction}
        >
            <div
                className="relative w-full max-w-lg rounded-xl border border-blue-900/50 bg-neutral-950 p-6 shadow-2xl flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-100">Manage Message</h2>
                    <button
                        onClick={onCloseAction}
                        className="text-neutral-500 hover:text-neutral-300 transition-colors text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-blue-900/30 bg-blue-900/10 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                        Sender Information
                    </h3>
                    <p className="text-sm text-neutral-200"><span
                        className="text-neutral-500">Name:</span> {message.sender}
                    </p>
                    <p className="text-sm text-neutral-200"><span
                        className="text-neutral-500">Email:</span> {message.email}
                    </p>
                    <p className="text-sm text-neutral-200"><span
                        className="text-neutral-500">Received:</span> {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-blue-900/30 bg-blue-900/10 p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                        Message
                    </h3>
                    <p className="text-sm text-neutral-200"><span
                        className="text-neutral-500">Subject:</span> {message.subject}</p>
                    <p className="text-sm text-neutral-200"><span
                        className="text-neutral-500">Content:</span> {message.message}</p>
                </div>

                {isAnswered ? (
                    <p className="text-sm text-emerald-400 text-center">✓ This message has already been answered.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                            Reply
                        </h3>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Write your reply to the message..."
                            rows={4}
                            className="w-full rounded-lg border border-blue-900/50 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onCloseAction}
                                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !answer.trim()}
                                className="rounded-lg border border-emerald-500/40 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Sending..." : "Send Reply"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}