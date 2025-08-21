"use client";

import { createContext, useState } from "react";

type SearchContextProviderProps = {
  children: React.ReactNode;
};
type SearchContextType = {
  handlesChangeSearchQuery: (query: string) => void;
  searchQuery: string;
};
export const SearchContext = createContext<SearchContextType | null>(null);

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(searchQuery);

  const handlesChangeSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ handlesChangeSearchQuery, searchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
