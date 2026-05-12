import {prisma} from "@/lib/prisma"
import UsersTable from "@/app/admin/users/users-table";
import {MessagesTable} from "@/app/admin/messages/msgs-table";
import {Reveal} from "@/components/ui/Reveal";

export default async function Page() {
    const msgs = (await prisma.message.findMany({
        select: {
            id: true,
            userId: true,
            sender: true,
            subject: true,
            email: true,
            status: true,
            message: true,
            createdAt: true,
            updatedAt: true,
        }
    })).map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
    }));

    return (
        <Reveal fade duration={1000} className="min-h-screen text-neutral-100">
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
                        Messages
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Here you can answer on all unanswered questions.
                    </p>
                </div>

                <MessagesTable msgs={msgs}/>
            </div>
        </Reveal>
    )
}