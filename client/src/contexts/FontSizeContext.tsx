import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface FontSizeContextType {
  fontSize: FontSize;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const fontSizes: FontSize[] = ['small', 'medium', 'large', 'extra-large'];

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('hadith-font-size');
    return (saved as FontSize) || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('hadith-font-size', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const increaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex < fontSizes.length - 1) {
      setFontSizeState(fontSizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSizeState(fontSizes[currentIndex - 1]);
    }
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  return (
    <FontSizeContext.Provider
      value={{ fontSize, increaseFontSize, decreaseFontSize, setFontSize }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}
