"use server";

import {signIn, signOut} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";
import {AuthError} from "next-auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function LoginUser(email: string, password: string) {
    if (!email || !password) return {error: "Morate popuniti sva polja."};

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return {error: "Netačna email adresa ili lozinka."};
        }

        return {success: true};
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Netačna email adresa ili lozinka."};
                default:
                    return {error: "Došlo je do greške prilikom prijavljivanja."};
            }
        }
        throw error;
    }
}

export async function RegisterUser(
    name: string,
    email: string,
    password: string,
    confirmPW: string,
) {

    email = email.trim().toLowerCase();
    
    if (!email || !password || !name)
        return {error: "You have to provide all credentials."};

    if (!emailRegex.test(email)) return {error: "Incorrect email"};

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50)
        return {error: "Name should be longer than 2 characters."};

    if (password.length < 6)
        return {error: "Password should be at least 6 characters long."};

    if (confirmPW !== password) return {error: "Passwords must match"};
    try {
        const hashed = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
            },
        });

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return {success: true};
    } catch (error: any) {
        console.log("REG ERROR: ", error);
        if (error?.code === "P2002") {
            return {error: "Korisnik sa tim emailom već postoji."};
        }
        return {error: "Došlo je do greške prilikom registrovanja."};
    }
}

export async function LogoutUser() {
    await signOut({redirect: false});
}
