import {prisma} from "@/lib/prisma";
import {ProductsTable} from "@/app/admin/products/product-table";
import UsersTable from "@/app/admin/users/users-table";
import {Reveal} from "@/components/ui/Reveal";

export default async function Page() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
        }
    });

    return (
        <Reveal fade duration={1000} className="min-h-screen text-neutral-100">
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
                        Users
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Overview and management of all users.
                    </p>
                </div>

                <UsersTable users={users}/>
            </div>
        </Reveal>
    )
}