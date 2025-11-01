"use client";
import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import React, { use, useTransition } from "react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function Page({ searchParams }: PageProps) {
  const { success, cancelled } = use(searchParams) ?? {};

  const [isPending, startTransition] = useTransition();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>Petsoft access requires payment</H1>
      {!success && (
        <Button
          disabled={isPending}
          onClick={async () =>
            await startTransition(async () => await createCheckoutSession())
          }
        >
          Buy life time access for 299$
        </Button>
      )}

      {success && <p className="text-sm text-green-700">Payment successful</p>}
      {cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled. You can try again
        </p>
      )}
    </main>
  );
}
