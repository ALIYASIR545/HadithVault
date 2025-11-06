import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const {
    lang = 'ar-SA', // Arabic (Saudi Arabia)
    rate = 0.9,
    pitch = 1,
    volume = 1,
  } = options;
  const [shouldUseEnglish, setShouldUseEnglish] = useState(false);

  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentTextRef = useRef<string>('');

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, englishTranslation?: string) => {
    if (!isSupported || !text) {
      console.warn('Text-to-speech not supported or text is empty');
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Small delay to ensure clean state
      setTimeout(() => {
        // Get available voices and try to select an Arabic one
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);

        // Try to find an Arabic voice
        const arabicVoice = voices.find(voice =>
          voice.lang.startsWith('ar') ||
          voice.lang === 'ar-SA' ||
          voice.lang === 'ar-EG'
        );

        let textToSpeak = text;
        let languageToUse = lang;

        if (!arabicVoice && englishTranslation) {
          // No Arabic voice available, use English translation
          textToSpeak = englishTranslation;
          languageToUse = 'en-US';
          console.log('No Arabic voice found. Speaking English translation instead.');
        } else if (arabicVoice) {
          console.log('Using Arabic voice:', arabicVoice.name, arabicVoice.lang);
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = languageToUse;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        if (arabicVoice && languageToUse === 'ar-SA') {
          utterance.voice = arabicVoice;
        }

        utterance.onstart = () => {
          console.log('Speech started', {
            text: text.substring(0, 50) + '...',
            lang: utterance.lang,
            voice: utterance.voice?.name
          });
          setIsPlaying(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          console.log('Speech ended normally');
          setIsPlaying(false);
          setIsPaused(false);
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', {
            error: event.error,
            charIndex: event.charIndex,
            elapsedTime: event.elapsedTime
          });
          setIsPlaying(false);
          setIsPaused(false);
        };

        // Handle boundary events for debugging
        utterance.onboundary = (event) => {
          console.log('Speech boundary:', event.name, event.charIndex);
        };

        utteranceRef.current = utterance;
        currentTextRef.current = text;

        window.speechSynthesis.speak(utterance);
        console.log('Utterance queued, speaking:', utterance.speaking, 'pending:', utterance.pending);
      }, 100);
    } catch (error) {
      console.error('Error in speak function:', error);
    }
  }, [isSupported, lang, rate, pitch, volume]);

  const pause = useCallback(() => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);

  const resume = useCallback(() => {
    if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPlaying, isPaused]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const toggle = useCallback((text?: string, englishTranslation?: string) => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else if (text) {
      speak(text, englishTranslation);
    } else if (currentTextRef.current) {
      speak(currentTextRef.current);
    }
  }, [isPlaying, isPaused, pause, resume, speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    isSupported,
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop,
    toggle,
  };
}
