"use client";
import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import React from "react";

export default function page({ searchParams }) {
  const { success } = React.use(searchParams);
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>Petsoft access requires payment</H1>
      {!success && (
        <Button onClick={() => createCheckoutSession()}>
          Buy life time access for 299$
        </Button>
      )}

      {success && <p className="text-sm text-green-700">payment successfull</p>}
    </main>
  );
}
