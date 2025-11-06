import { useQuery } from "@tanstack/react-query";
import { Sun, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShareDialog from "@/components/share-dialog";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import type { Hadith } from "@shared/schema";

export default function DailyHadith() {
  const { data: dailyHadith, isLoading } = useQuery<Hadith>({
    queryKey: ["/api/daily-hadith"],
  });
  const { isPlaying, isPaused, toggle } = useTextToSpeech({ lang: 'ar-SA', rate: 0.85 });

  if (isLoading) {
    return (
      <section className="mb-8">
        <Card className="p-6 islamic-gradient text-white">
          <div className="animate-pulse">
            <div className="h-6 bg-white bg-opacity-20 rounded mb-4 w-32"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white bg-opacity-20 rounded w-full"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-3/4"></div>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  if (!dailyHadith) {
    return (
      <section className="mb-8">
        <Card className="p-6 islamic-gradient text-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Sun className="mr-2 h-5 w-5" />
            Daily Hadith
          </h2>
          <p className="text-white/80">No daily hadith available at the moment.</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <Card className="islamic-gradient rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Sun className="mr-2 h-5 w-5" />
            Daily Hadith
          </h2>

          <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-right mb-3" dir="rtl">
              <p 
                className="font-arabic text-lg leading-relaxed"
                data-testid="text-arabic-daily"
              >
                {dailyHadith.arabicText}
              </p>
            </div>

            <div className="border-t border-white border-opacity-20 pt-3">
              <p 
                className="text-sm leading-relaxed"
                data-testid="text-english-daily"
              >
                {dailyHadith.englishTranslation}
              </p>
              <div className="flex justify-between items-center mt-3 text-xs opacity-90">
                <span data-testid="text-hadith-reference">
                  {dailyHadith.collectionId === "bukhari" ? "Sahih al-Bukhari" :
                   dailyHadith.collectionId === "muslim" ? "Sahih Muslim" :
                   "Hadith Collection"} {dailyHadith.hadithNumber}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-islamic-gold transition-colors text-white p-1"
                    onClick={() => toggle(dailyHadith.arabicText, dailyHadith.englishTranslation)}
                    data-testid="button-play-daily"
                  >
                    {isPlaying && !isPaused ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <ShareDialog
                    title={`${dailyHadith.collectionId === "bukhari" ? "Sahih al-Bukhari" :
                     dailyHadith.collectionId === "muslim" ? "Sahih Muslim" :
                     "Hadith Collection"} - ${dailyHadith.hadithNumber}`}
                    text={`${dailyHadith.englishTranslation}\n\nArabic: ${dailyHadith.arabicText}`}
                    buttonVariant="ghost"
                    buttonSize="sm"
                    buttonClassName="hover:text-islamic-gold transition-colors text-white p-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
