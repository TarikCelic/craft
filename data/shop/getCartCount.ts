import { prisma } from "@/lib/prisma";
import getUser from "@/utils/getUser";

export async function getCartCount(): Promise<number> {
  const user = await getUser();
  if (!user) return 0;

  const result = await prisma.cartItem.aggregate({
    where: {
      cart: { userId: user.id },
    },
    _sum: { quantity: true },
  });

  return result._sum.quantity ?? 0;
}
