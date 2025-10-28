import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import SignOutBtn from "@/components/sign-out-btn";
import { checkAuth } from "@/lib/server-utils";
import React from "react";

export default async function Page() {
  const session = await checkAuth();

  return (
    <main>
      <H1 className="my-8 text-white">Account </H1>
      <ContentBlock className="flex h-[500px] flex-col items-center justify-center gap-4 p-8">
        <p>Logged in as {session.user.email}</p>
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
}
