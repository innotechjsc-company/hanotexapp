"use client";

import { Search } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import SectionBanner from "@/components/ui/SectionBanner";
import { useSearch } from "../hooks/useSearch";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";

interface SearchScreenProps {
  initialQuery: string;
  initialType: string;
}

export default function SearchScreen({ initialQuery, initialType }: SearchScreenProps) {
  const {
    results,
    loading,
    error,
    pagination,
    searchQuery,
    searchType,
    setSearchQuery,
    performSearch,
    handleSearch,
    handleTypeChange,
  } = useSearch({ initialQuery, initialType });

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Banner */}
      <SectionBanner
        title="Tìm kiếm"
        subtitle={`Kết quả tìm kiếm cho "${initialQuery}"`}
        icon={
          <AnimatedIcon animation="pulse" delay={500}>
            <Search className="h-12 w-12 text-white" />
          </AnimatedIcon>
        }
        variant="default"
        className="mb-8"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <SearchForm
          searchQuery={searchQuery}
          searchType={searchType}
          onSearchQueryChange={setSearchQuery}
          onSearchTypeChange={handleTypeChange}
          onSubmit={handleSearch}
        />

        {/* Results */}
        <SearchResults
          results={results}
          loading={loading}
          error={error}
          pagination={pagination}
          searchType={searchType}
          searchQuery={searchQuery}
          onPageChange={(page) => performSearch(searchQuery, searchType, page)}
        />
      </div>
    </div>
  );
}
