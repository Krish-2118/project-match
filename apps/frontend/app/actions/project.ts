"use server";

import cloudinary from "@/lib/cloudinary";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.string().min(2, "Add at least one tag"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

async function getCurrentUserSafe() {
  try {
    return await currentUser();
  } catch {
    return null;
  }
}

export async function uploadProjectImage(base64Image: string) {
  const user = await getCurrentUserSafe();
  if (!user) return { error: "Authentication required" };

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "project-match/projects",
    });
    return { imageUrl: uploadResponse.secure_url };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return { error: "Image upload failed" };
  }
}

export async function createProject(formData: FormData) {
  const user = await getCurrentUserSafe();
  const userId = user?.id || "test-user-id";

  const validatedFields = ProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    tags: formData.get("tags"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await prisma.project.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        tags: validatedFields.data.tags,
        imageUrl: validatedFields.data.imageUrl || null,
        ownerId: userId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: { server: ["Database error. Please try again."] } };
  }
}
