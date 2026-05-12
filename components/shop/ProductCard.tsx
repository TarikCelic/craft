import Image from "next/image";
import Link from "next/link";
import { ProductWithVariantsSerialized } from "@/types";

export default function ProductCard({
  product,
}: {
  product: ProductWithVariantsSerialized;
}) {
  const mainImage = product.variants[0]?.images[0]?.url || "/placeholder.jpg";

  return (
    <Link href={`/shop/${product.id}`} className="group flex flex-col w-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f5f5f5]">
        <div className="block w-full h-full">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 tracking-tight mt-2">
            {product.name}
          </h3>
          <div className="flex justify-between items-start mb-1">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              {product.category.name}
            </span>
          </div>
        </div>
        <div className="flex gap-1  mt-4">
          {product.variants.map((v) => (
            <div
              key={v.id}
              className="w-4 h-4 rounded-full  outline-offset-2 border border-neutral-900/25"
              style={{ backgroundColor: v.color || "#000" }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 px-1">
        {!product.salePrice ? (
          <span className="text-2xl font-neutral-900 text-blue-600">
            {product.price.toString()} KM
          </span>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-neutral-900 text-blue-600">
                {product.salePrice.toString()} KM
              </span>
              <span className=" text-gray-500 line-through">
                {product.price.toString()} KM
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
