"use server";

import fs from "fs";
import path from "path";
import {revalidatePath} from "next/cache";
import getUser from "@/utils/getUser";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";

function createResponse(ok: boolean, message: string) {
    return {ok, message};
}

function ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}

async function saveAvatarFile(file: File): Promise<string> {
    const uploadDir = path.join(process.cwd(), "public", "avatars");
    ensureDirectoryExists(uploadDir);

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const filename = `avatar-${Date.now()}-${Math.random().toString(36).substr(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return `/avatars/${filename}`;
}

export async function updateName(name: string) {
    try {
        const user = await getUser();
        if (!user) return createResponse(false, "Not authenticated.");

        if (!name || name.trim().length === 0) {
            return createResponse(false, "Name cannot be empty.");
        }
        if (name.trim().length > 50) {
            return createResponse(false, "Name must be 50 characters or less.");
        }

        await prisma.user.update({
            where: {id: user.id},
            data: {name: name.trim()},
        });

        revalidatePath("/");
        return createResponse(true, "Name updated.");
    } catch (error) {
        console.error("updateName error:", error);
        return createResponse(false, "Failed to update name.");
    }
}

export async function updatePassword({
                                         oldPassword,
                                         newPassword,
                                     }: {
    oldPassword: string;
    newPassword: string;
}) {
    try {
        const user = await getUser();
        if (!user) return createResponse(false, "Not authenticated.");

        const fullUser = await prisma.user.findUnique({
            where: {id: user.id},
            select: {password: true},
        });

        if (!fullUser?.password) {
            return createResponse(false, "Cannot change password for this account.");
        }

        const valid = await bcrypt.compare(oldPassword, fullUser.password);
        if (!valid) {
            return createResponse(false, "Current password is incorrect.");
        }

        if (newPassword.length < 8) {
            return createResponse(false, "Password must be at least 8 characters.");
        }

        const hashed = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: {id: user.id},
            data: {password: hashed},
        });

        return createResponse(true, "Password changed successfully.");
    } catch (error) {
        console.error("updatePassword error:", error);
        return createResponse(false, "Failed to update password.");
    }
}

export async function updateAvatar(formData: FormData) {
    try {
        const user = await getUser();
        if (!user) return createResponse(false, "Not authenticated.");

        const file = formData.get("avatar") as File | null;
        if (!file || !(file instanceof File)) {
            return createResponse(false, "No valid avatar file provided.");
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return createResponse(
                false,
                "Only JPEG, PNG, WEBP or GIF images are allowed.",
            );
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return createResponse(false, "File size must be less than 2MB.");
        }

        const imageUrl = await saveAvatarFile(file);

        if (user.image && user.image.startsWith("/avatars/")) {
            const oldPath = path.join(process.cwd(), "public", user.image);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }


        await prisma.user.update({
            where: {id: user.id},
            data: {image: imageUrl},
        });

        revalidatePath("/");
        return {ok: true, message: "Avatar updated.", imageUrl};
    } catch (error) {
        console.error("updateAvatar error:", error);
        return createResponse(false, "Failed to update avatar.");
    }
}

export async function deleteAvatar() {
    try {
        const user = await getUser();
        if (!user) return createResponse(false, "Not authenticated.");

        if (user.image && user.image.startsWith("/avatars/")) {
            const oldPath = path.join(process.cwd(), "public", user.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await prisma.user.update({
            where: {id: user.id},
            data: {image: null},
        });

        revalidatePath("/");
        return createResponse(true, "Avatar deleted.");
    } catch (error) {
        console.error("deleteAvatar error:", error);
        return createResponse(false, "Failed to delete avatar.");
    }
}
