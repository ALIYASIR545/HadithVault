import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Hadith } from "@/../../shared/schema";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Share2, Search, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  query: string;
  collectionId?: string;
}

export default function SearchResults({ query, collectionId }: SearchResultsProps) {
  const { toast } = useToast();
  const [displayCount, setDisplayCount] = useState(5);

  const { data: hadiths, isLoading, error } = useQuery<Hadith[]>({
    queryKey: ["/api/hadiths", { search: query, collectionId }],
    enabled: !!query,
  });

  const handleBookmark = (hadithId: string) => {
    toast({
      title: "Bookmarked",
      description: "Hadith has been added to your bookmarks.",
    });
  };

  const handleShare = (hadithId: string) => {
    toast({
      title: "Shared",
      description: "Hadith link has been copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Searching...</h2>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Search Error</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error searching hadiths. Please try again.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!hadiths || hadiths.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-5 w-5" />
          <h2 className="text-2xl font-bold">No Results Found</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-slate-600 dark:text-slate-300">
              No hadiths found for "{query}". Try searching with different keywords.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const displayedHadiths = hadiths?.slice(0, displayCount) || [];
  const hasMore = hadiths && hadiths.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5" />
        <h2 className="text-2xl font-bold">
          Search Results for "{query}" ({hadiths.length} found)
        </h2>
      </div>

      <div className="grid gap-6">
        {displayedHadiths.map((hadith: Hadith) => (
          <Card key={hadith.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {hadith.book} - Hadith {hadith.hadithNumber}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{hadith.collectionId}</Badge>
                    {hadith.narrator && <Badge variant="outline">{hadith.narrator}</Badge>}
                    {hadith.grade && <Badge variant="outline">{hadith.grade}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(hadith.id)}
                    data-testid={`bookmark-${hadith.id}`}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(hadith.id)}
                    data-testid={`share-${hadith.id}`}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Arabic Text */}
                <div>
                  <h4 className="font-medium text-sm text-slate-400 mb-2">
                    Arabic
                  </h4>
                  <p className="text-right text-lg leading-relaxed font-arabic text-white">
                    {hadith.arabicText}
                  </p>
                </div>

                {/* English Translation */}
                <div>
                  <h4 className="font-medium text-sm text-slate-400 mb-2">
                    English Translation
                  </h4>
                  <p className="text-white leading-relaxed">
                    {hadith.englishTranslation}
                  </p>
                </div>

                {/* Urdu Translation */}
                {hadith.urduTranslation && (
                  <div>
                    <h4 className="font-medium text-sm text-slate-400 mb-2">
                      Urdu Translation
                    </h4>
                    <p className="text-right text-white leading-relaxed font-urdu">
                      {hadith.urduTranslation}
                    </p>
                  </div>
                )}

                {/* Roman Urdu Translation */}
                {hadith.romanUrduTranslation && (
                  <div>
                    <h4 className="font-medium text-sm text-slate-400 mb-2">
                      Roman Urdu
                    </h4>
                    <p className="text-white leading-relaxed">
                      {hadith.romanUrduTranslation}
                    </p>
                  </div>
                )}

                {/* Chapter Info */}
                {hadith.chapter && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <BookOpen className="h-4 w-4 inline mr-1" />
                      {hadith.chapter}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            size="lg"
            className="bg-islamic-teal hover:bg-islamic-teal/90"
          >
            <ChevronDown className="h-5 w-5 mr-2" />
            See More ({hadiths.length - displayCount} remaining)
          </Button>
        </div>
      )}
    </section>
  );
}