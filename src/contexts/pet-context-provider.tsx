"use client";

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
};
export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  console.log(selectedPetId);

  const handleSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
