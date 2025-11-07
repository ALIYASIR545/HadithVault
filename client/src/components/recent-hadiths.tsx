import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import HadithCard from "@/components/hadith-card";
import type { Hadith } from "@shared/schema";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RECENT_HADITHS_KEY = 'hadith-recent-hadiths';
const MAX_RECENT_HADITHS = 10;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface RecentHadithEntry {
  id: string;
  timestamp: number;
}

export default function RecentHadiths() {
  const [, setLocation] = useLocation();
  const [recentHadithIds, setRecentHadithIds] = useState<string[]>([]);
  const [recentHadiths, setRecentHadiths] = useState<Hadith[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recent hadith IDs from localStorage on mount and filter by 24 hours
  useEffect(() => {
    const loadRecentHadiths = async () => {
      try {
        const saved = localStorage.getItem(RECENT_HADITHS_KEY);
        if (!saved) {
          setIsLoading(false);
          return;
        }

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
        const ids = last24Hours.map(entry => entry.id);
        setRecentHadithIds(ids);

        // Fetch only the specific hadiths we need (first 3 for home page)
        const hadithsToFetch = ids.slice(0, 3);
        const fetchedHadiths: Hadith[] = [];

        for (const id of hadithsToFetch) {
          try {
            const response = await fetch(`/api/hadiths/${id}`);
            if (response.ok) {
              const hadith = await response.json();
              fetchedHadiths.push(hadith);
            }
          } catch (error) {
            console.error(`Failed to fetch hadith ${id}:`, error);
          }
        }

        setRecentHadiths(fetchedHadiths);
      } catch (error) {
        console.error('Failed to load recent hadiths:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentHadiths();
  }, []);

  // No longer needed - hadiths are tracked in hadith-card component

  const handleClearRecent = () => {
    setRecentHadithIds([]);
    setRecentHadiths([]);
    localStorage.removeItem(RECENT_HADITHS_KEY);
  };

  const handleViewAll = () => {
    // Navigate to dedicated recent hadiths page
    setLocation('/recent');
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">Recent Hadiths</h3>
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Recent Hadiths</h3>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                data-testid="button-clear-recent"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Recent Hadiths?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all recently viewed hadiths from your history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearRecent}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="ghost"
            className="text-islamic-teal hover:text-islamic-teal/80 font-medium"
            onClick={handleViewAll}
            data-testid="button-view-all"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {recentHadiths.length > 0 ? (
          recentHadiths.map((hadith) => (
            <HadithCard key={hadith.id} hadith={hadith} />
          ))
        ) : (
          <p className="text-center text-slate-500 py-8">No recent hadiths yet. Browse collections to get started!</p>
        )}
      </div>
    </section>
  );
}
