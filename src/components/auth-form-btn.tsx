"use client";
import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type AuthFormBtnProps = {
  text: string;
};

export default function AuthFormBtn({ text }: AuthFormBtnProps) {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>{text}</Button>;
}
