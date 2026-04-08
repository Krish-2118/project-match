"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import cloudinary from "@/lib/cloudinary";

export async function uploadImage(base64Image: string) {
    const session = await auth();
    if (!session) return { error: "Authentication required" };

    try {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: "project-match/profiles",
        });
        return { imageUrl: uploadResponse.secure_url };
    } catch (error: unknown) {
        console.error("Cloudinary upload failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Image upload failed";
        return { error: errorMessage };
    }
}

export async function updateProfile(formData: FormData) {
    const session = await auth();
    const userId = session?.user?.id || "test-user-id";

    try {
        const name = formData.get("name") as string;
        const bio = formData.get("bio") as string;
        const skills = formData.get("skills") as string;
        const major = formData.get("major") as string;
        const university = formData.get("university") as string;
        const year = formData.get("year") as string;
        const github = formData.get("github") as string;
        const website = formData.get("website") as string;
        const image = formData.get("image") as string;
        const banner = formData.get("banner") as string;

        const data: Record<string, string> = {
            name,
            bio,
            skills,
            major,
            university,
            year,
            github,
            website,
        };

        if (image) data.image = image;
        if (banner) data.banner = banner;

        await prisma.user.update({
            where: { id: userId },
            data,
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Profile update failed:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
