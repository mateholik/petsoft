import "server-only";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import prisma from "@/lib/db";
import { Pet, User } from "@prisma/client";

export async function checkAuth() {
  const session = await auth();
  //middleware will handle this, but some ppl complain thath middleware is not running everytime on server pages
  if (!session?.user) redirect("/login");

  return session;
}

export const getPetById = async (petId: Pet["id"]) => {
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
  });

  return pet;
};

export const getsPetByUserId = async (userId: User["id"]) => {
  const pets = await prisma.pet.findMany({
    where: {
      id: userId,
    },
  });

  return pets;
};

export const getUserByEmail = async (userEmail: User["email"]) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  return user;
};
