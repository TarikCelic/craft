"use client";
import {useState} from "react";
import {DataTable} from "@/components/admin/data-table";
import {ManageMessageDialog} from "@/components/admin/manage-answer-dialog";
import {ContactMessageSerialized, ColumnDef} from "@/types"

const STATUS_COLORS: Record<string, string> = {
    UNANSWERED: "text-amber-400",
    ANSWERED: "text-emerald-400",
};
type Props = {
    msgs: ContactMessageSerialized[];
};

export function MessagesTable({msgs}: Props) {
    const [managingAnswer, setManagingAnswer] = useState<ContactMessageSerialized | null>(null);
    const columns: ColumnDef<ContactMessageSerialized>[] = [
        {
            key: "id",
            header: "ID",
            cell: (row) => (
                <span className="font-mono text-xs text-neutral-400">
                    #{String(row.id).padStart(6, "0")}
                </span>
            ),
        },
        {
            key: "sender",
            header: "Pošiljaoc",
            cell: (row) => (
                <p className="font-medium text-neutral-200">{row.sender}</p>
            ),
        },
        {
            key: "subject",
            header: "Predmet",
            cell: (row) => (
                <span className="text-neutral-400">{row.subject}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => (
                <span className={`text-xs font-medium ${STATUS_COLORS[row.status]}`}>
                    {row.status === "UNANSWERED" ? "Neodgovoreno" : row.status === "ANSWERED" ? "Odgovoreno" : row.status}
                </span>
            ),
        },
        {
            key: "createdAt",
            header: "Primljeno",
            cell: (row) => (
                <span className="text-neutral-400">
                    {new Date(row.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: "actions",
            header: "",
            cell: (row) => (
                <button
                    onClick={() => setManagingAnswer(row)}
                    className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
                >
                    Upravljaj
                </button>
            ),
            className: "text-right",
        },
    ];
    return (
        <>
            <DataTable
                data={msgs}
                columns={columns}
                keyExtractor={(row) => row.id}
                emptyMessage="Nema poruka."
            />
            {managingAnswer && (
                <ManageMessageDialog
                    message={managingAnswer}
                    onCloseAction={() => setManagingAnswer(null)}
                />
            )}
        </>
    );
}