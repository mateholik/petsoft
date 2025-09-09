"use client";

import { addPet, deletePet, updatePet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};
type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  handleSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleAddPet: (pet: Omit<Pet, "id">) => Promise<void>;
  handleEditPet: (id: string, pet: Omit<Pet, "id">) => Promise<void>;
};
export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  //state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          const newPet: Pet = {
            id: (Math.random() * 1000000).toFixed(0),
            ...payload,
          };
          return [...state, newPet];
        case "remove":
          return state.filter((pet) => pet.id !== payload);
        case "edit":
          return state.map((pet) =>
            pet.id === payload.id ? { ...pet, ...payload.newPetData } : pet,
          );
        default:
          return state;
      }
    },
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  //event handlers/actions
  const handleSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleAddPet = async (newPetData: Omit<Pet, "id">) => {
    setOptimisticPets({ action: "add", payload: newPetData });
    const error = await addPet(newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (petId: string, newPetData: Omit<Pet, "id">) => {
    setOptimisticPets({
      action: "edit",
      payload: { id: petId, newPetData },
    });
    const error = await updatePet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (id: string) => {
    setOptimisticPets({ action: "remove", payload: id });
    const error = await deletePet(id);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        handleSelectedPetId,
        selectedPet,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
