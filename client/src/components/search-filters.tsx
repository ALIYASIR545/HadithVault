import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import AdvancedFilters, { FilterState } from "@/components/advanced-filters";
import AutocompleteSearch from "@/components/autocomplete-search";

interface SearchFiltersProps {
  onSearch?: (query: string, collection?: string, language?: string, filters?: FilterState) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const [language, setLanguage] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({});

  const handleSearch = () => {
    const searchCollection = collection === "all" ? "" : collection;
    const searchLanguage = language === "all" ? "" : language;
    onSearch?.(query, searchCollection, searchLanguage, advancedFilters);
  };

  const handleFilterChange = (filters: FilterState) => {
    setAdvancedFilters(filters);
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6">Search Hadiths</h3>

          <div className="space-y-4">
            <AutocompleteSearch
              value={query}
              onChange={setQuery}
              onSelect={(value) => {
                setQuery(value);
                handleSearch();
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={collection} onValueChange={setCollection}>
                <SelectTrigger data-testid="select-collection">
                  <SelectValue placeholder="All Collections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  <SelectItem value="bukhari">Sahih al-Bukhari</SelectItem>
                  <SelectItem value="muslim">Sahih Muslim</SelectItem>
                  <SelectItem value="abudawud">Sunan Abu Dawood</SelectItem>
                  <SelectItem value="tirmidhi">Jami` at-Tirmidhi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger data-testid="select-language">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="urdu">Urdu</SelectItem>
                  <SelectItem value="roman-urdu">Roman Urdu</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleSearch}
                className="bg-islamic-teal hover:bg-islamic-teal/90 text-white"
                data-testid="button-search"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdvancedFilters onFilterChange={handleFilterChange} />
    </section>
  );
}
