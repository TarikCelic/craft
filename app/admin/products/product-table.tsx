"use client";

import {useState} from "react";
import {DataTable, ColumnDef} from "@/components/admin/data-table";
import type {ProductWithVariantsSerialized} from "@/types";
import {ManageProductDialog} from "@/components/admin/manage-product-dialog";
import Image from "next/image";

export function ProductsTable({
                                  products,
                              }: {
    products: ProductWithVariantsSerialized[];
}) {
    const [managingProduct, setManagingProduct] =
        useState<ProductWithVariantsSerialized | null>(null);

    const columns: ColumnDef<ProductWithVariantsSerialized>[] = [
        {
            key: "image",
            header: "PREVIEW",
            cell: (row) => {
                const thumb = row.variants[0]?.images[0];
                return thumb ? (
                    <Image
                        src={thumb.url}
                        alt={row.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover w-10 h-10"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-neutral-800"/>
                );
            },
        },
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
            key: "name",
            header: "Name",
            cell: (row) => (
                <span className="font-medium text-neutral-200">{row.name}</span>
            ),
        },
        {
            key: "category.name",
            header: "Category",
            cell: (row) => (
                <span className="text-neutral-400">{row.category.name}</span>
            ),
        },
        {
            key: "price",
            header: "Price",
            cell: (row) => (
                <span className="font-semibold text-neutral-100">
          {Number(row.price).toFixed(2)} KM
        </span>
            ),
        },
        {
            key: "variants",
            header: "Variants",
            cell: (row) => (
                <div className="flex gap-1">
                    {row.variants.map((v) => (
                        <span
                            key={v.id}
                            title={v.color}
                            className="w-4 h-4 rounded-full border border-neutral-600 inline-block"
                            style={{backgroundColor: v.color}}
                        />
                    ))}
                </div>
            ),
        },
        {
            key: "materials",
            header: "Materials",
            cell: (row) => (
                <span className="text-xs text-neutral-400">
          {row.materials.join(", ")}
        </span>
            ),
        },
        {
            key: "actions",
            header: "ACTIONS",
            cell: (row) => (
                <button
                    onClick={() => setManagingProduct(row)}
                    className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
                >
                    MANAGE
                </button>
            ),
            className: "text-right",
        },
    ];

    return (
        <>
            <DataTable
                data={products}
                columns={columns}
                keyExtractor={(row) => row.id}
                emptyMessage="No product found."
            />

            {managingProduct && (
                <ManageProductDialog
                    product={managingProduct}
                    onClose={() => setManagingProduct(null)}
                />
            )}
        </>
    );
}
