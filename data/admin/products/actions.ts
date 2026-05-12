"use server";

import {prisma} from "@/lib/prisma";
import {revalidatePath, revalidateTag} from "next/cache";
import path from "path";
import fs from "fs/promises";
import type {ActionResult} from "@/types";

export async function getProduct(id: number) {
    return prisma.product.findUnique({
        where: {id},
        include: {
            category: true,
            variants: {
                include: {images: true},
            },
        },
    });
}


export async function updateProduct(
    id: number,
    data: {
        name?: string;
        description?: string;
        dimensions?: string;
        price?: number;
        salePrice?: number | null;
        materials?: string[];
        categoryName?: string;
    },
): Promise<ActionResult<{ productId: number }>> {
    try {
        const updated = await prisma.product.update({
            where: {id},
            data: {
                ...(data.name && {name: data.name}),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...(data.dimensions !== undefined && {dimensions: data.dimensions}),
                ...(data.price !== undefined && {price: data.price}),
                ...(data.salePrice !== undefined && {salePrice: data.salePrice}),
                ...(data.materials && {materials: data.materials}),
                ...(data.categoryName && {
                    category: {
                        connectOrCreate: {
                            where: {name: data.categoryName},
                            create: {name: data.categoryName},
                        },
                    },
                }),
            },
        });

        revalidatePath("/admin/products");
        revalidatePath(`/shop/${id}`);
        revalidateTag('products-list', {});

        return {success: true, data: {productId: updated.id}};
    } catch (error) {
        console.error(error);
        return {success: false, error: "Greška pri ažuriranju proizvoda."};
    }
}

export async function setSalePrice(
    id: number,
    salePrice: number | null,
): Promise<ActionResult> {
    try {
        await prisma.product.update({
            where: {id},
            data: {salePrice},
        });

        revalidatePath("/admin/products");
        revalidatePath(`/shop/${id}`);
        revalidateTag('products-list', {});

        return {success: true, data: undefined};
    } catch (error) {
        console.error(error);
        return {success: false, error: "Greška pri postavljanju cijene."};
    }
}

export async function deleteProduct(id: number): Promise<ActionResult> {
    try {
        const variants = await prisma.variant.findMany({
            where: {productId: id},
            include: {images: true},
        });

        await prisma.product.delete({where: {id}});

        const productDir = path.join(
            process.cwd(),
            "public",
            "products",
            String(id),
        );
        await fs.rm(productDir, {recursive: true, force: true});

        revalidatePath("/admin/products");
        revalidatePath("/shop");
        revalidateTag('products-list', {});

        return {success: true, data: undefined};
    } catch (error) {
        console.error(error);
        return {success: false, error: "Greška pri brisanju proizvoda."};
    }
}
