import {getProducts} from "@/data/shop/actions";
import {ProductsTable} from "./product-table";
import {Reveal} from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const raw = await getProducts();

    const products = raw.map((p) => ({
        ...p,
        price: p.price.toString(),
        salePrice: p.salePrice?.toString() ?? null,
    }));

    return (
        <Reveal fade duration={1000} className="min-h-screen text-neutral-100">
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
                        Products
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Overview and management of all products.
                    </p>
                </div>

                <ProductsTable products={products}/>
            </div>
        </Reveal>
    );
}
