"use client";

import {UserType} from "@/types/index";
import {ColumnDef, DataTable} from "@/components/admin/data-table";
import Image from "next/image";
import {User, LucideChevronsUpDown} from "lucide-react";
import {DeleteUser, UpdateRole} from "@/data/admin/users/actions";
import {toast} from "sonner";
import {AlertDialog, Button, ListBox, Select} from "@heroui/react";
import {Role} from "@/app/generated/prisma";

interface Props {
    users: UserType[];
}

export default function UsersTable({users}: Props) {
    const columns: ColumnDef<UserType>[] = [
        {
            key: "image",
            header: "PREVIEW",
            cell: (row) =>
                row.image ? (
                    <Image
                        src={row.image}
                        alt={row.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10"
                    />
                ) : (
                    <div className="p-2 border border-white/10 rounded-full inline-block">
                        <User size={22}/>
                    </div>
                ),
        },
        {
            key: "id",
            header: "ID",
            cell: (row) => (
                <span className="font-mono text-xs text-neutral-400">
                    #{row.id}
                </span>
            ),
        },
        {
            key: "name",
            header: "Ime",
            cell: (row) => (
                <span className="font-medium text-neutral-200">{row.name}</span>
            ),
        },
        {
            key: "email",
            header: "E-Mail",
            cell: (row) => (
                <span className="text-neutral-400">{row.email}</span>
            ),
        },
        {
            key: "role",
            header: "Role",
            cell: (row) => (
                <Select
                    className="w-[256px] " placeholder={row.role}
                    onSelectionChange={async (selected) => {
                        const role = selected as Role;
                        if (!role || role === row.role) return;
                        const result = await UpdateRole(row.id, role);

                        toast.success("Rola uspješno promijenjena.");

                    }}
                >
                    <Select.Trigger className={"bg-transparent text-white border-white/10 border max-w-[200px]"}>
                        <Select.Value/>
                        <Select.Indicator className="size-3">
                            <LucideChevronsUpDown/>
                        </Select.Indicator>
                    </Select.Trigger>
                    <Select.Popover className={"border border-blue-900/50 bg-blue-900/15 text-white"}>
                        <ListBox>
                            <ListBox.Item id={Role.CUSTOMER} textValue="Customer" className={"hover:text-neutral-900"}>
                                Customer
                                <ListBox.ItemIndicator className={"text-white"}/>
                            </ListBox.Item>
                            <ListBox.Item id={Role.MODERATOR} textValue="Moderator"
                                          className={"hover:text-neutral-900"}>
                                Moderator
                                <ListBox.ItemIndicator className={"text-white"}/>
                            </ListBox.Item>
                            <ListBox.Item id={Role.ADMINISTRATOR} textValue="Administrator"
                                          className={"hover:text-neutral-900"}>
                                Administrator
                                <ListBox.ItemIndicator className={"text-white"}/>
                            </ListBox.Item>
                        </ListBox>
                    </Select.Popover>
                </Select>
            ),
        },
        {
            key: "actions",
            header: "ACTIONS",
            cell: (row) => (
                <AlertDialog>
                    <Button variant="danger" className="px-3 py-1.5 text-xs rounded-md">Delete</Button>
                    <AlertDialog.Backdrop>
                        <AlertDialog.Container>
                            <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#0d0f14]">
                                <AlertDialog.CloseTrigger className={"bg-[#141721]"}/>
                                <AlertDialog.Header>
                                    <AlertDialog.Icon status="danger"/>
                                    <AlertDialog.Heading className={"text-white"}>Delete
                                        user?</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body>
                                    <p>
                                        This will permanently delete the user <strong>{row.name}</strong>.
                                        This action cannot be undone.
                                    </p>
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button slot="close" variant="tertiary">Cancel</Button>
                                    <Button
                                        slot="close"
                                        variant="danger"
                                        onPress={async () => {
                                            const result = await DeleteUser(row.id);
                                            if (result?.error) {
                                                toast.error(result.error);
                                            } else {
                                                toast.success("Korisnik uspješno obrisan.");
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </AlertDialog.Footer>
                            </AlertDialog.Dialog>
                        </AlertDialog.Container>
                    </AlertDialog.Backdrop>
                </AlertDialog>
            ),
            className: "text-right",
        },
    ];

    return (
        <DataTable
            data={users}
            columns={columns}
            keyExtractor={(row) => row.id}
            emptyMessage="Nema korisnika."
        />
    );
}