"use server";
import prisma from "@/lib/db";
import { Pet } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addPet(pet: Pet) {
  await sleep(1000);
  try {
    await prisma.pet.create({
      data: pet,
    });
  } catch (error) {
    return { message: "Error adding pet" };
  }

  revalidatePath("/app", "layout");
}

export async function updatePet(petId: string, newPetData: Omit<Pet, "id">) {
  await sleep(1000);
  try {
    await prisma.pet.update({
      where: { id: petId },
      data: newPetData,
    });
  } catch (error) {
    return { message: "Error updating pet" };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: string) {
  await sleep(1000);
  try {
    await prisma.pet.delete({
      where: { id: petId },
    });
  } catch (error) {
    return { message: "Error deleting pet" };
  }

  revalidatePath("/app", "layout");
}
