import "server-only";

import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function checkAuth() {
  const session = await auth();
  //middleware will handle this, but some ppl complain thath middleware is not running everytime on server pages
  if (!session?.user) redirect("/login");

  return session;
}
