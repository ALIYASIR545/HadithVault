import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Share2, ArrowLeft, Loader2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageTransition from "@/components/page-transition";
import type { Hadith, HadithCollection } from "@shared/schema";

export default function CollectionPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [displayCount, setDisplayCount] = useState(5);

  // Fetch collection info
  const { data: collection, isLoading: collectionLoading } = useQuery<HadithCollection>({
    queryKey: [`/api/collections/${id}`],
    enabled: !!id,
  });

  // Fetch hadiths for this collection
  const { data: hadiths, isLoading: hadithsLoading } = useQuery<Hadith[]>({
    queryKey: ["/api/hadiths", { collectionId: id }],
    enabled: !!id,
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

  const isLoading = collectionLoading || hadithsLoading;

  const displayedHadiths = hadiths?.slice(0, displayCount) || [];
  const hasMore = hadiths && hadiths.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-islamic-teal" />
          </div>
        ) : collection ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{collection.name}</h1>
              {collection.arabicName && (
                <h2 className="text-2xl font-arabic mb-4 text-slate-600 dark:text-slate-400">
                  {collection.arabicName}
                </h2>
              )}
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                {collection.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>Compiled by {collection.compiler}</span>
                <span>•</span>
                <span>{hadiths?.length || 0} hadiths loaded</span>
              </div>
            </div>

            <div className="space-y-6">
              {displayedHadiths && displayedHadiths.length > 0 ? (
                displayedHadiths.map((hadith: Hadith) => (
                  <Card key={hadith.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {hadith.book || collection.name} - Hadith {hadith.hadithNumber}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{collection.name}</Badge>
                            {hadith.narrator && <Badge variant="outline">{hadith.narrator}</Badge>}
                            {hadith.grade && <Badge variant="outline">{hadith.grade}</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(hadith.id)}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(hadith.id)}
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
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-600 dark:text-slate-300">
                      No hadiths found in this collection.
                    </p>
                  </CardContent>
                </Card>
              )}
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
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Collection not found.</p>
            </CardContent>
          </Card>
        )}
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}