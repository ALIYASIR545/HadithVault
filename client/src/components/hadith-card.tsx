import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, Play, Copy, CheckCircle2, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/share-dialog";
import AuthenticityInfo from "@/components/authenticity-info";
import { useReadingProgress } from "@/contexts/ReadingProgressContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import type { Hadith } from "@shared/schema";

interface HadithCardProps {
  hadith: Hadith;
}

export default function HadithCard({ hadith }: HadithCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const { isRead, markAsRead } = useReadingProgress();
  const hadithIsRead = isRead(hadith.id);
  const { isPlaying, isPaused, toggle, stop } = useTextToSpeech({ lang: 'ar-SA', rate: 0.85 });

  // Auto-mark as read after viewing for 3 seconds
  useEffect(() => {
    if (!hadithIsRead) {
      const timer = setTimeout(() => {
        markAsRead(hadith.id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hadith.id, hadithIsRead, markAsRead]);

  const getCollectionName = (collectionId: string) => {
    switch (collectionId) {
      case "bukhari": return "Sahih al-Bukhari";
      case "muslim": return "Sahih Muslim";
      case "abudawud": return "Sunan Abu Dawood";
      default: return "Hadith Collection";
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        // Remove bookmark logic
        const response = await fetch(`/api/bookmarks/${hadith.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsBookmarked(false);
          toast({ title: "Bookmark removed" });
        }
      } else {
        // Add bookmark logic
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hadithId: hadith.id }),
        });
        if (response.ok) {
          setIsBookmarked(true);
          toast({ title: "Hadith bookmarked" });
        }
      }
    } catch (error) {
      toast({ title: "Failed to update bookmark", variant: "destructive" });
    }
  };


  const handleCopyReference = () => {
    const reference = `${getCollectionName(hadith.collectionId)} ${hadith.hadithNumber}${
      hadith.book ? `, ${hadith.book}` : ""
    }${hadith.chapter ? `, ${hadith.chapter}` : ""}`;
    
    navigator.clipboard.writeText(reference);
    toast({ title: "Reference copied to clipboard" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className={`islamic-gradient text-white transition-shadow hover:shadow-xl ${hadithIsRead ? 'opacity-90' : ''}`} data-testid={`card-hadith-${hadith.id}`}>
        <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span
              className="text-sm font-medium text-white bg-white/20 px-3 py-1 rounded-full"
              data-testid={`text-collection-${hadith.id}`}
            >
              {getCollectionName(hadith.collectionId)}
            </span>
            <span
              className="text-sm text-white/80"
              data-testid={`text-number-${hadith.id}`}
            >
              Hadith {hadith.hadithNumber}
            </span>
            {hadithIsRead && (
              <span className="flex items-center text-xs text-green-300">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Read
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              data-testid={`button-bookmark-${hadith.id}`}
              className="text-white hover:bg-white/20"
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? 'fill-islamic-gold text-islamic-gold' : 'text-white'}`}
              />
            </Button>
            <ShareDialog
              title={`${getCollectionName(hadith.collectionId)} - Hadith ${hadith.hadithNumber}`}
              text={`${hadith.englishTranslation}\n\nArabic: ${hadith.arabicText}`}
              buttonVariant="ghost"
              buttonSize="icon"
              buttonClassName="text-white hover:bg-white/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-right" dir="rtl">
            <p
              className="font-arabic text-lg leading-relaxed text-white"
              data-testid={`text-arabic-${hadith.id}`}
            >
              {hadith.arabicText}
            </p>
          </div>

          <div className="border-t border-white/20 pt-4">
            <p
              className="text-white leading-relaxed"
              data-testid={`text-english-${hadith.id}`}
            >
              {hadith.englishTranslation}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-white/70 pt-2 border-t border-white/20">
            <div className="flex items-center space-x-4">
              {hadith.book && (
                <span data-testid={`text-book-${hadith.id}`}>{hadith.book}</span>
              )}
              {hadith.chapter && (
                <span data-testid={`text-chapter-${hadith.id}`}>{hadith.chapter}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-white hover:bg-white/20"
                onClick={() => toggle(hadith.arabicText, hadith.englishTranslation)}
                data-testid={`button-play-${hadith.id}`}
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="mr-1 h-3 w-3" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-1 h-3 w-3" />
                    {isPaused ? 'Resume' : 'Play'}
                  </>
                )}
              </Button>
              <AuthenticityInfo
                hadithId={hadith.id}
                collectionId={hadith.collectionId}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-white hover:bg-white/20"
                onClick={handleCopyReference}
                data-testid={`button-copy-${hadith.id}`}
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </Button>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
