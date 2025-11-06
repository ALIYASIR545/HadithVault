import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ReadingProgressContextType {
  readHadiths: Set<string>;
  markAsRead: (hadithId: string) => void;
  markAsUnread: (hadithId: string) => void;
  isRead: (hadithId: string) => boolean;
  getProgressPercentage: (totalHadiths: number) => number;
  clearProgress: () => void;
}

const ReadingProgressContext = createContext<ReadingProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'hadith-reading-progress';

export function ReadingProgressProvider({ children }: { children: ReactNode }) {
  const [readHadiths, setReadHadiths] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Save to localStorage whenever readHadiths changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readHadiths)));
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  }, [readHadiths]);

  const markAsRead = (hadithId: string) => {
    setReadHadiths((prev) => {
      const newSet = new Set(prev);
      newSet.add(hadithId);
      return newSet;
    });
  };

  const markAsUnread = (hadithId: string) => {
    setReadHadiths((prev) => {
      const newSet = new Set(prev);
      newSet.delete(hadithId);
      return newSet;
    });
  };

  const isRead = (hadithId: string) => {
    return readHadiths.has(hadithId);
  };

  const getProgressPercentage = (totalHadiths: number) => {
    if (totalHadiths === 0) return 0;
    return Math.round((readHadiths.size / totalHadiths) * 100);
  };

  const clearProgress = () => {
    setReadHadiths(new Set());
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ReadingProgressContext.Provider
      value={{
        readHadiths,
        markAsRead,
        markAsUnread,
        isRead,
        getProgressPercentage,
        clearProgress,
      }}
    >
      {children}
    </ReadingProgressContext.Provider>
  );
}

export function useReadingProgress() {
  const context = useContext(ReadingProgressContext);
  if (context === undefined) {
    throw new Error('useReadingProgress must be used within a ReadingProgressProvider');
  }
  return context;
}
