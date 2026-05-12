import { prisma } from "@/lib/prisma";
import getUser from "@/utils/getUser";
import { redirect } from "next/navigation";
import FavouritesClient from "./FavouritesClient";
import { SerializedProduct } from "@/types";

export default async function Page() {
  const user = await getUser();

  if (!user) redirect("/login");

  const favourites = await prisma.favourites.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          category: true,
          variants: {
            take: 1,
            include: {
              images: { take: 1 },
            },
          },
        },
      },
    },
  });

  const serializedProducts: SerializedProduct[] = favourites.map((fav) => {
    const p = fav.product;

    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      description: p.description,
      dimensions: p.dimensions,
      materials: p.materials,
      createdAt: p.createdAt.toISOString(),
      variants: p.variants.map((v) => ({
        id: v.id,
        color: v.color,
        images: v.images.map((img) => ({ url: img.url })),
      })),
    };
  });

  return <FavouritesClient products={serializedProducts} />;
}
