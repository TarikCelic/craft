"use client";

import {ReactNode} from "react";
import {DataTableProps} from "@/types";
import {Reveal} from "@/components/ui/Reveal";


export function DataTable<T>({
                                 data,
                                 columns,
                                 keyExtractor,
                                 emptyMessage = "Nema podataka.",
                                 isLoading = false,
                             }: DataTableProps<T>) {
    return (
        <Reveal fade duration={1000}
                className="w-full overflow-hidden rounded-lg border border-blue-900/50 bg-blue-900/5">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-blue-900/50 bg-blue-900/15">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={[
                                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400",
                                    col.className ?? "",
                                ].join(" ")}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        Array.from({length: 5}).map((_, i) => (
                            <tr key={i} className="border-b border-blue-900/50">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3">
                                        <div className="h-4 animate-pulse rounded bg-neutral-800"/>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-12 text-center text-neutral-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr
                                key={keyExtractor(row)}
                                className="border-b border-blue-900/10 transition-colors last:border-0 hover:bg-blue-900/15"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={[
                                            "px-4 py-3 text-neutral-200",
                                            col.className ?? "",
                                        ].join(" ")}
                                    >
                                        {col.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </Reveal>
    );
}
