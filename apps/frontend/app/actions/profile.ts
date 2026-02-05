"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";

import cloudinary from "@/lib/cloudinary";

async function getCurrentUserSafe() {
  try {
    return await currentUser();
  } catch {
    return null;
  }
}

export async function uploadImage(base64Image: string) {
  const user = await getCurrentUserSafe();
  if (!user) return { error: "Authentication required" };

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
  const user = await getCurrentUserSafe();
  const userId = user?.id || "test-user-id";

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

export async function seedData() {
  const user = await getCurrentUserSafe();
  const userId = user?.id || "test-user-id";
  const userEmail = user?.emailAddresses[0]?.emailAddress || "test@example.com";

  // 1. Ensure the main user exists first!
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: userEmail,
      name: user?.firstName ? `${user.firstName} ${user.lastName}` : "Test User",
      image: user?.imageUrl,
    },
  });

  const projects = [
    {
      title: "EcoTrack AI",
      description:
        "An AI-powered app that tracks your carbon footprint based on daily habits and suggests personalized reductions.",
      tags: "Next.js, AI, Sustainability",
      ownerId: userId,
    },
    {
      title: "EduBlock",
      description:
        "Blockchain-based platform for verifying academic credentials and peer-to-peer tutoring rewards.",
      tags: "Web3, Education, React",
      ownerId: userId,
    },
    {
      title: "MindFull",
      description:
        "A mental health companion app using biomimetic interface design and soothing generative audio.",
      tags: "UI/UX, Wellness, Flutter",
      ownerId: userId,
    },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }

  const users = [
    {
      name: "Alex Rivera",
      email: "alex@example.com",
      bio: "Full-stack developer with a passion for clean code and UX. Looking to join a project in the AI space.",
      skills: "React, Node.js, Python",
      major: "Computer Science",
      university: "Stanford",
      year: "Junior",
    },
    {
      name: "Sarah Chen",
      email: "sarah@example.com",
      bio: "Product designer and researcher. I love building interfaces that feel human and accessible.",
      skills: "Figma, User Research, HTML/CSS",
      major: "HCI",
      university: "CMU",
      year: "Senior",
    },
    {
      name: "Jordan Smith",
      email: "jordan@example.com",
      bio: "Data scientist interested in social impact. Experienced with large datasets and visualization.",
      skills: "R, SQL, Tableau",
      major: "Mathematics",
      university: "MIT",
      year: "Sophomore",
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: { ...u, id: crypto.randomUUID() },
    });
  }

  revalidatePath("/");
}
