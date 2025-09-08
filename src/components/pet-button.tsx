"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";
import { flushSync } from "react-dom";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function PetButton({
  actionType,
  children,
  onClick,
  disabled,
}: PetButtonProps) {
  const [open, setOpen] = useState(false);
  if (actionType === "checkout") {
    return (
      <Button onClick={onClick} disabled={disabled} variant="secondary">
        {children}
      </Button>
    );
  } else {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {actionType === "add" ? (
            <Button size="icon">
              <PlusIcon className="size-6" />
            </Button>
          ) : (
            <Button variant="secondary">{children}</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "add" ? "Add a new pet" : "Edit a new pet"}
            </DialogTitle>
          </DialogHeader>
          <PetForm
            actionType={actionType}
            onFormSubmission={() => flushSync(() => setOpen(false))}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
