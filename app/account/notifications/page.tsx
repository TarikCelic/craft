import { prisma } from "@/lib/prisma";
import getUser from "@/utils/getUser";
import { redirect } from "next/navigation";
import ClientMessages from "./ClientMessages";

export default async function page() {
  const user = await getUser();
  if (!user) redirect("/login");

  const messages = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ClientMessages messages={messages} />;
}
