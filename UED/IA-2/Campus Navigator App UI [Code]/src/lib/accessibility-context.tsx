import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'none';

export interface AccessibilitySettings {
  colorBlindness: ColorBlindnessType;
  lowVision: boolean;
  largeText: boolean;
  voiceAssistance: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    colorBlindness: 'none',
    lowVision: false,
    largeText: false,
    voiceAssistance: false,
  });

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
