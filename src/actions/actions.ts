"use server";
import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { checkAuth, getPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

// --- user actions ---
export async function logIn(prevState: unknown, formData: unknown) {
  //we need prevState: unknown, because we use useFormState
  await sleep(1000);
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials",
          };
        }
        default: {
          return {
            message: "Could not sign in auth",
          };
        }
      }
    }
    throw error; // when signin is succesfull, next auth uses redirect. nextjs redirect works by throwing an error, so thats wjy login is succesful, but we see error, because we catch it here, althou everything is ok.  so we have to rethrow it to make redirect actually happen
  }
}

export async function logOut() {
  await sleep(1000);
  await signOut({ redirectTo: "/" });
}

export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000);

  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }

  const formDataObject = Object.fromEntries(formData.entries());

  const validatedFormData = authSchema.safeParse(formDataObject);
  if (!validatedFormData.success) {
    return { message: "Invalid form data" };
  }

  const { email, password } = validatedFormData.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { message: "Email already exists" };
      }
      return { message: "error 1" };
    }
    return { message: "error 2" };
  }
  await signIn("credentials", formData);
}

// --- pet actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "server side validation failed",
    };
  }
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return { message: "Error adding pet: " + error };
  }

  revalidatePath("/app", "layout");
}

export async function updatePet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  //authentication chech
  const session = await checkAuth();

  //validation
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

  //authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized",
    };
  }

  //database mutation
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

  //authentication chech
  const session = await checkAuth();

  //validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "server side validation failed: petId",
    };
  }

  //authorization check (user owns pet)
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized",
    };
  }

  //database mutation
  try {
    await prisma.pet.delete({
      where: { id: validatedPetId.data },
    });
  } catch (error) {
    return { message: "Error deleting pet: " + error };
  }

  revalidatePath("/app", "layout");
}
