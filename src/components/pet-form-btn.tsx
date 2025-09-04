import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type PetFromBtnProps = {
  actionType: "add" | "edit";
};
export default function PetFromBtn({ actionType }: PetFromBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-5 self-end" type="submit" disabled={pending}>
      {actionType === "add" ? "Add new pet" : "Edit pet"}
    </Button>
  );
}
