import z from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";

export const petFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Max chars 100" }),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner name is required" })
      .max(100, { message: "Max chars 100" }),
    imageUrl: z.union([
      z.literal(""),
      z.url({ message: "Invalid URL" }).trim(),
    ]),
    age: z.coerce.number().int().positive().max(99999),
    notes: z.union([
      z.literal(""),
      z.string().trim().max(1000, { message: "Max chars 100" }),
    ]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));

export type TPetForm = z.infer<typeof petFormSchema>;
