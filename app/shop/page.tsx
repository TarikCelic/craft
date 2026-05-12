import {unstable_cache} from "next/cache";
import {prisma} from "@/lib/prisma";
import ShopClient from "@/components/shop/ShopClient";
import {Prisma, RoomType} from "../generated/prisma";
import {ProductWithVariantsSerialized, ShopSearchParams} from "@/types";

const getCachedProducts = unstable_cache(
    async (where: Prisma.ProductWhereInput, orderBy: Prisma.ProductOrderByWithRelationInput) => {
        return prisma.product.findMany({
            where,
            include: {
                category: true,
                variants: {
                    include: {
                        images: {take: 1},
                    },
                },
            },
            orderBy,
        });
    },
    ["products-list"],
    {revalidate: 3600, tags: ["products-list"]}
);

interface Props {
    searchParams: ShopSearchParams;
}

export default async function ShopPage({searchParams}: Props) {
    const params = await searchParams;

    const onSale = params.onSale;
    const min = params.min ? Number(params.min) : undefined;
    const max = params.max ? Number(params.max) : undefined;

    const rooms = params.room
        ? Array.isArray(params.room)
            ? params.room
            : [params.room]
        : [];

    const materials = params.material
        ? Array.isArray(params.material)
            ? params.material
            : [params.material]
        : [];

    const colors = params.color
        ? Array.isArray(params.color)
            ? params.color
            : [params.color]
        : [];

    const categoryRecord = params.category
        ? await prisma.category.findFirst({
            where: {name: params.category},
        })
        : null;

    const where: Prisma.ProductWhereInput = {};

    if (categoryRecord) where.categoryId = categoryRecord.id;
    if (rooms.length > 0) {
        where.RoomType = {hasSome: rooms as RoomType[]};
    }
    if (materials.length > 0) {
        where.materials = {hasSome: materials};
    }
    if (onSale === "true") {
        where.salePrice = {not: null};
    }
    if (colors.length > 0) {
        where.variants = {
            some: {color: {in: colors}},
        };
    }
    if (min !== undefined || max !== undefined) {
        where.price = {};
        if (min !== undefined) where.price.gte = min;
        if (max !== undefined) where.price.lte = max;
    }

    const sortMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
        "price-asc": {price: "asc"},
        "price-desc": {price: "desc"},
        newest: {createdAt: "desc"},
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput =
        sortMap[params.sort ?? ""] ?? {createdAt: "desc"};

    const products = await getCachedProducts(where, orderBy);

    const serializedProducts: ProductWithVariantsSerialized[] = products.map(
        (product) => ({
            ...product,
            price: product.price.toString(),
            salePrice: product.salePrice?.toString() ?? null,
        })
    );

    return <ShopClient products={serializedProducts}/>;
}