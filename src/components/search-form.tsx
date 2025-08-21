"use client";

import { useSearchContext } from "@/lib/hooks";

export default function SearchForm() {
  const { handlesChangeSearchQuery, searchQuery } = useSearchContext();
  return (
    <form className="h-full w-full">
      <input
        value={searchQuery}
        onChange={(e) => handlesChangeSearchQuery(e.target.value)}
        placeholder="Search pets"
        className="h-full w-full rounded-md bg-white/20 px-5 transition outline-none placeholder:text-white/50 hover:bg-white/30 focus:bg-white/50"
        type="search"
      />
    </form>
  );
}
