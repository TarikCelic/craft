"use client";

import {useState, useTransition} from "react";
import Image from "next/image";
import {toast} from "sonner";
import {X, ImageIcon} from "lucide-react";
import {deleteProduct, setSalePrice} from "@/data/admin/products/actions";
import type {ProductWithVariantsSerialized} from "@/types";
import {AlertDialog, Button} from "@heroui/react";

type Props = {
    product: ProductWithVariantsSerialized;
    onClose: () => void;
};

function SectionTitle({children}: { children: React.ReactNode }) {
    return (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {children}
        </p>
    );
}

function Field({label, value}: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="mt-0.5 text-sm text-neutral-300">{value}</p>
        </div>
    );
}

export function ManageProductDialog({product, onClose}: Props) {
    const [saleInput, setSaleInput] = useState(product.salePrice ?? "");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleSalePrice() {
        startTransition(async () => {
            const val = saleInput === "" ? null : Number(saleInput);
            if (val !== null && (isNaN(val) || val <= 0)) {
                toast.error("Enter a valid price.");
                return;
            }
            const result = await setSalePrice(product.id, val);
            if (result.success) {
                toast.success(val ? "Sale price updated." : "Sale price removed.");
                onClose();
            } else {
                toast.error(result.error);
            }
        });
    }

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteProduct(product.id);
            if (result.success) {
                toast.success("Product deleted.");
                onClose();
            } else {
                toast.error(result.error);
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
                            #{String(product.id).padStart(6, "0")}
                        </span>
                        <h2 className="text-base font-semibold text-neutral-100">
                            Manage Product
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                    >
                        <X size={20} strokeWidth={1.5}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="border-b border-neutral-800 px-6 py-4">
                        <SectionTitle>Basic Information</SectionTitle>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <Field label="Name" value={product.name}/>
                            <Field label="Category" value={product.category.name}/>
                            <Field label="Price" value={`${product.price} KM`}/>
                            <Field label="Dimensions" value={product.dimensions ?? "?"}/>
                            <Field label="Materials" value={product.materials.join(", ") || "?"}/>
                            <Field
                                label="Sale Price"
                                value={
                                    product.salePrice ? (
                                        <span className="text-emerald-400">{product.salePrice} KM</span>
                                    ) : (
                                        <span className="text-neutral-600">None</span>
                                    )
                                }
                            />
                        </div>
                        {product.description && (
                            <div className="mt-4 rounded-lg border border-neutral-700 bg-neutral-900/40 px-3 py-2.5">
                                <p className="text-xs font-medium text-neutral-400">Description</p>
                                <p className="mt-0.5 text-sm text-neutral-300">{product.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="border-b border-neutral-800 px-6 py-4">
                        <SectionTitle>Variants ({product.variants.length})</SectionTitle>
                        <div className="flex flex-col gap-3">
                            {product.variants.map((variant) => {
                                const image = variant.images[0];
                                return (
                                    <div
                                        key={variant.id}
                                        className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3"
                                    >
                                        <div
                                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                                            {image ? (
                                                <Image
                                                    src={image.url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="56px"
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-full w-full items-center justify-center text-neutral-600">
                                                    <ImageIcon size={20} strokeWidth={1.5}/>
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-neutral-200">
                                                Variant #{variant.id}
                                            </p>
                                            <div className="mt-0.5 flex items-center gap-1.5">
                                                <div
                                                    className="h-3 w-3 rounded-full border border-neutral-700"
                                                    style={{backgroundColor: variant.color}}
                                                />
                                                <span className="text-xs text-neutral-500">{variant.color}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-neutral-500 shrink-0">
                                            {variant.images.length} images
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-b border-neutral-800 px-6 py-4">
                        <SectionTitle>Set Sale Price</SectionTitle>
                        <div className="flex gap-3 items-center">
                            <input
                                type="number"
                                value={saleInput}
                                onChange={(e) => setSaleInput(e.target.value)}
                                placeholder="e.g. 199.99"
                                step="0.01"
                                min={0}
                                max={product.price}
                                className="w-40 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20"
                            />
                            <button
                                onClick={handleSalePrice}
                                disabled={isPending}
                                className="rounded-lg border border-emerald-500/40 px-4 py-2 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/10 disabled:opacity-40"
                            >
                                Update Sale
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-neutral-600">
                            Leave empty to remove the sale price.
                        </p>
                    </div>

                    <div className="px-6 py-4">
                        <SectionTitle>Danger Zone</SectionTitle>
                        <AlertDialog>
                            <Button variant="danger" className={"rounded-md"}>Delete Product</Button>
                            <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                    <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#0d0f14]">
                                        <AlertDialog.CloseTrigger className={"bg-[#141721]"}/>
                                        <AlertDialog.Header>
                                            <AlertDialog.Icon status="danger"/>
                                            <AlertDialog.Heading className={"text-white"}>Delete product
                                                permanently?</AlertDialog.Heading>
                                        </AlertDialog.Header>
                                        <AlertDialog.Body>
                                            <p>
                                                This will permanently delete this product along with all its variants
                                                and images from disk. This action cannot be undone.
                                            </p>
                                        </AlertDialog.Body>
                                        <AlertDialog.Footer>
                                            <Button slot="close" variant="tertiary">Cancel</Button>
                                            <Button
                                                slot="close"
                                                variant="danger"
                                                onPress={handleDelete}
                                                isDisabled={isPending}
                                            >
                                                {isPending ? "Deleting..." : "Yes, delete"}
                                            </Button>
                                        </AlertDialog.Footer>
                                    </AlertDialog.Dialog>
                                </AlertDialog.Container>
                            </AlertDialog.Backdrop>
                        </AlertDialog>
                    </div>
                </div>

                <div className="border-t border-neutral-800 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}