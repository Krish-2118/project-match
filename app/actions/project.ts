"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";

export type CreateProjectFieldErrors = {
  server?: string[];
  title?: string[];
  description?: string[];
  tags?: string[];
  imageUrl?: string[];
};

export type CreateProjectResult =
  | { success: true }
  | { error: CreateProjectFieldErrors };

const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.string().min(2, "Add at least one tag"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function uploadProjectImage(base64Image: string) {
  const session = await auth();
  if (!session) return { error: "Authentication required" };

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

export async function createProject(
  formData: FormData,
): Promise<CreateProjectResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: { server: ["Please sign in to create a project."] } };
  }

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
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: { server: ["Database error. Please try again."] } };
  }
}
