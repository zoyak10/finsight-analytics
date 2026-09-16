import React, { createContext, useContext, useState, useEffect } from 'react';

type IntroMode = 'motion' | 'video';

interface IntroContextType {
  isOpen: boolean;
  mode: IntroMode;
  setMode: (mode: IntroMode) => void;
  playIntro: (customMode?: IntroMode) => void;
  closeIntro: () => void;
  hasSeenIntro: boolean;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

const STORAGE_KEY = 'finsight_intro_seen';

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<IntroMode>('motion');
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  // Default to a fallback or custom video if available, plus allows pasting any video url/mp4
  const [videoUrl, setVideoUrl] = useState<string>('/intro.mp4');

  useEffect(() => {
    // Check if seen in current session
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Auto trigger intro on first landing
      setIsOpen(true);
    } else {
      setHasSeenIntro(true);
    }
  }, []);

  const playIntro = (customMode?: IntroMode) => {
    if (customMode) {
      setMode(customMode);
    }
    setIsOpen(true);
  };

  const closeIntro = () => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenIntro(true);
  };

  return (
    <IntroContext.Provider
      value={{
        isOpen,
        mode,
        setMode,
        playIntro,
        closeIntro,
        hasSeenIntro,
        videoUrl,
        setVideoUrl,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return context;
}
