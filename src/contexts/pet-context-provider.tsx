"use client";

import { addPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

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
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (pet: Omit<Pet, "id">) => void;
  handleEditPet: (id: string, pet: Omit<Pet, "id">) => void;
};
export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  data: pets,
  children,
}: PetContextProviderProps) {
  //state
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  //event handlers/actions
  const handleSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };
  const handleCheckoutPet = (id: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    // setPets((prevPet) => [
    //   ...prevPet,
    //   { ...newPet, id: new Date().toISOString() },
    // ]);
    await addPet(newPet);
  };

  const handleEditPet = (petId: string, editedPet: Omit<Pet, "id">) => {
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === petId ? { id: petId, ...editedPet } : pet,
      ),
    );
  };

  return (
    <PetContext.Provider
      value={{
        pets,
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
