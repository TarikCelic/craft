"use server";

import {prisma} from "@/lib/prisma";

import path from "path";
import fs from "fs/promises";
import {RoomType} from "@/app/generated/prisma";
import {revalidateTag} from "next/cache";

type Result =
    | { success: true; productId: number }
    | { success: false; error: string };

export const addProduct = async (formData: FormData) => {
    try {
        const name = formData.get("name") as string;
        const dimensions = formData.get("dimensions") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const categoryName = formData.get("category") as string;
        const roomTypes = JSON.parse(
            formData.get("roomTypes") as string,
        ) as RoomType[];
        const materials = JSON.parse(
            formData.get("materials") as string,
        ) as string[];

        const variantsRAW = JSON.parse(formData.get("variants") as string) as {
            color: string;
            vID: number;
        }[];

        if (
            !name ||
            !description ||
            isNaN(price) ||
            !categoryName ||
            !materials.length
        ) {
            return {success: false, error: "Sva polja su obavezna."};
        }

        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    name,
                    description,
                    price,
                    dimensions,
                    materials,
                    RoomType: roomTypes,
                    category: {
                        connectOrCreate: {
                            where: {name: categoryName},
                            create: {name: categoryName},
                        },
                    },
                },
            });

            for (const variant of variantsRAW) {
                const images = formData.getAll(`images_${variant.vID}`) as File[];

                const dbVariant = await tx.variant.create({
                    data: {
                        color: variant.color,
                        productId: product.id,
                    },
                });

                let imgCounter = 0;
                for (const image of images) {
                    if (image.size === 0) {
                        throw new Error("Morate imati barem jednu sliku.");
                    }

                    const relativeDir = `/products/${product.id}/${dbVariant.id}`;
                    const uploadDir = path.join(process.cwd(), "public", relativeDir);

                    await fs.mkdir(uploadDir, {recursive: true});

                    const fileName = `${Date.now()}-${image.name.replaceAll(" ", "_")}`;
                    const fullPath = path.join(uploadDir, fileName);
                    const fileUrl = `${relativeDir}/${fileName}`;

                    const buffer = Buffer.from(await image.arrayBuffer());
                    await fs.writeFile(fullPath, buffer);
                    await tx.image.create({
                        data: {
                            url: fileUrl,
                            variantId: dbVariant.id,
                            order: imgCounter,
                        },
                    });

                    imgCounter++;
                }
            }
            return product;
        });
        revalidateTag('products-list', {});
        return {success: true, productId: result.id};
    } catch (error) {
        console.error("Greška pri kreiranju proizvoda:", error);

        const message =
            error instanceof Error ? error.message : "Neuspješno spremanje podataka.";

        return {success: false, error: message};
    }
};
export const getCategories = async (): Promise<
    { id: number; name: string }[]
> => {
    return prisma.category.findMany({orderBy: {name: "asc"}});
};
