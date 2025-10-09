"use client";

import { useSearchParams } from "next/navigation";
import { SearchScreen } from "@/screens/search-screen";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  
  return <SearchScreen initialQuery={query} initialType={type} />;
}
