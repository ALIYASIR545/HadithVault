import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageTransition from "@/components/page-transition";
import HadithCard from "@/components/hadith-card";
import type { Hadith } from "@shared/schema";

const RECENT_HADITHS_KEY = 'hadith-recent-hadiths';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

interface RecentHadithEntry {
  id: string;
  timestamp: number;
}

export default function RecentPage() {
  const [, navigate] = useLocation();
  const [recentHadithIds, setRecentHadithIds] = useState<string[]>([]);

  const { data: allHadiths, isLoading } = useQuery<Hadith[]>({
    queryKey: ["/api/hadiths"],
  });

  // Load recent hadith IDs from localStorage and filter by 24 hours
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_HADITHS_KEY);
      if (saved) {
        const allRecent: RecentHadithEntry[] = JSON.parse(saved);
        const now = Date.now();

        // Filter to only include hadiths viewed in last 24 hours
        const last24Hours = allRecent.filter(
          entry => (now - entry.timestamp) < TWENTY_FOUR_HOURS_MS
        );

        // Update localStorage to remove old entries
        if (last24Hours.length !== allRecent.length) {
          localStorage.setItem(RECENT_HADITHS_KEY, JSON.stringify(last24Hours));
        }

        // Extract just the IDs
        setRecentHadithIds(last24Hours.map(entry => entry.id));
      }
    } catch (error) {
      console.error('Failed to load recent hadiths:', error);
    }
  }, []);

  // Filter hadiths to only show recent ones
  const recentHadiths = allHadiths?.filter(h => recentHadithIds.includes(h.id)) || [];

  return (
    <div className="min-h-screen bg-[hsl(215,28%,22%)]">
      <Header onOpenPreferences={() => {}} />

      <PageTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Recent Hadiths</h1>
            <p className="text-slate-600 dark:text-slate-300">
              Hadiths you've viewed in the last 24 hours
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-islamic-teal" />
            </div>
          ) : recentHadiths.length > 0 ? (
            <div className="space-y-6">
              {recentHadiths.map((hadith) => (
                <HadithCard key={hadith.id} hadith={hadith} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No recent hadiths yet. Browse collections to get started!
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/collections")}
              >
                Browse Collections
              </Button>
            </div>
          )}
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
