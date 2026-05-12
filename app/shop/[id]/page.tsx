import {notFound} from "next/navigation";
import {prisma} from "@/lib/prisma";
import ProductPageClient from "./ProductPageClient";
import getUser from "@/utils/getUser";
import type {ProductWithVariantsSerialized, SerializedProduct} from "@/types";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({params}: Props) {
    const {id} = await params;

    const raw = await prisma.product.findUnique({
        where: {id: Number(id)},
        include: {
            category: true,
            variants: {
                include: {
                    images: {orderBy: {order: "asc"}},
                },
            },
        },
    });

    if (!raw) notFound();

    const product: ProductWithVariantsSerialized = {
        ...raw,
        price: raw.price.toString(),
        salePrice: raw.salePrice?.toString() ?? null,
    };

    const similar = await prisma.product.findMany({
        where: {
            categoryId: raw.categoryId,
            id: {not: raw.id},
        },
        include: {
            variants: {
                include: {
                    images: {orderBy: {order: "asc"}},
                },
            },
            category: true,
        },
        take: 8,
    });

    const serializedSimilar: SerializedProduct[] = similar.map((p) => ({
        ...p,
        price: p.price.toNumber(),
        salePrice: p.salePrice ? p.salePrice.toNumber() : null,
        createdAt: p.createdAt.toISOString(),
        materials: p.materials ?? [],
    }));

    return (
        <ProductPageClient
            product={product}
            similar={serializedSimilar}
        />
    );
}
