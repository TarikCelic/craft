import {unstable_cache} from "next/cache";
import ProductsInOneRow from "@/components/ui/ProductsInOneRow";
import {prisma} from "@/lib/prisma";

const getCachedSaleProducts = unstable_cache(
    async () => {
        const products = await prisma.product.findMany({
            where: {
                salePrice: {not: null},
            },
            select: {
                id: true,
                name: true,
                price: true,
                salePrice: true,
                categoryId: true,
                variants: {
                    select: {
                        id: true,
                        color: true,
                        images: {
                            select: {url: true},
                            orderBy: {order: "asc"},
                            take: 1,
                        },
                    },
                    take: 1,
                },
            },
        });

        return products.map((p) => ({
            ...p,
            price: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
        }));
    },
    ["sale-products"],
    {revalidate: 3600}
);

const SaleGrid = async () => {
    const products = await getCachedSaleProducts();

    return (
        <ProductsInOneRow
            header="ON SALE"
            paragraf="Make sure you don't skip this."
            products={products}
        />
    );
};

export default SaleGrid;