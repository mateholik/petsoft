"use client";
import { usePetContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import Image from "next/image";
import React, { useTransition } from "react";
import PetButton from "./pet-button";
import { deletePet } from "@/actions/actions";
import { toast } from "sonner";

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <div className="flex h-full w-full flex-col">
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar pet={selectedPet} />
          <OtherInfo pet={selectedPet} />
          <Notes pet={selectedPet} />
        </>
      )}
    </div>
  );
}

type Props = {
  pet: Pet;
};
function TopBar({ pet }: Props) {
  const { handleCheckoutPet } = usePetContext();
  return (
    <div className="border-light flex items-center border-b bg-white px-8 py-5">
      <Image
        src={pet?.imageUrl || ""}
        alt="pet Image"
        width={75}
        height={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />
      <h2 className="ml-5 text-3xl leading-7 font-semibold">{pet.name}</h2>

      <div className="ml-auto space-x-2">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton
          actionType="checkout"
          onClick={async () => await handleCheckoutPet(pet.id)}
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
}

function OtherInfo({ pet }: Props) {
  return (
    <div className="flex justify-around px-5 py-10 text-center">
      <div>
        <h3 className="text-[13px] font-medium text-zinc-700 uppercase">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet.ownerName}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium text-zinc-700 uppercase">Age</h3>
        <p className="mt-1 text-lg text-zinc-800"> {pet.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: Props) {
  return (
    <div className="border-light mx-8 mb-9 flex-1 rounded-md border bg-white px-7 py-5">
      {pet?.notes}
    </div>
  );
}

function EmptyView() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-2xl font-medium">No pet selected</p>
    </div>
  );
}
