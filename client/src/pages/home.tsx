import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import DailyHadith from "@/components/daily-hadith";
import SearchFilters from "@/components/search-filters";
import CollectionsGrid from "@/components/collections-grid";
import RecentHadiths from "@/components/recent-hadiths";
import QuickStats from "@/components/quick-stats";
import PreferencesModal from "@/components/preferences-modal";
import SearchResults from "../components/search-results";
import IslamicCalendar from "@/components/islamic-calendar";
import PrayerTimes from "@/components/prayer-times";
import PageTransition from "@/components/page-transition";

export default function Home() {
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCollection, setSearchCollection] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string, collection?: string) => {
    setSearchQuery(query);
    setSearchCollection(collection || "");
    setIsSearching(!!query);
  };

  return (
    <div className="min-h-screen bg-[hsl(215,28%,22%)]">
      <Header onOpenPreferences={() => setIsPreferencesOpen(true)} />

      <PageTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DailyHadith />
          </div>
          <div className="space-y-6">
            <IslamicCalendar />
            <PrayerTimes />
          </div>
        </div>

        <SearchFilters onSearch={handleSearch} />

        {isSearching ? (
          <SearchResults query={searchQuery} collectionId={searchCollection} />
        ) : (
          <>
            <CollectionsGrid />
            <RecentHadiths />
            <QuickStats />
          </>
        )}
        </main>
      </PageTransition>

      <Footer />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );
}
