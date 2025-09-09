import React from "react";
import { Button } from "./ui/button";

type PetFromBtnProps = {
  actionType: "add" | "edit";
};
export default function PetFromBtn({ actionType }: PetFromBtnProps) {
  return (
    <Button className="mt-5 self-end" type="submit">
      {actionType === "add" ? "Add new pet" : "Edit pet"}
    </Button>
  );
}
