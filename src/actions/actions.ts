"use server";
import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// --- user actions ---
export async function login(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());
  await signIn("credentials", authData);
  console.log(authData);
}

// --- pet actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "server side validation failed",
    };
  }
  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    return { message: "Error adding pet: " + error };
  }

  revalidatePath("/app", "layout");
}

export async function updatePet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(newPetData);
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPet.success) {
    return {
      message: "server side validation failed: newPetData",
    };
  }
  if (!validatedPetId.success) {
    return {
      message: "server side validation failed: petId",
    };
  }

  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
      data: validatedPet.data,
    });
  } catch (error) {
    return { message: "Error updating pet: " + error };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: "server side validation failed: petId",
    };
  }

  try {
    await prisma.pet.delete({
      where: { id: validatedPetId.data },
    });
  } catch (error) {
    return { message: "Error deleting pet: " + error };
  }

  revalidatePath("/app", "layout");
}
