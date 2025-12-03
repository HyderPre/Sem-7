import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Eye, Palette, Check } from 'lucide-react';
import { useAccessibility, ColorBlindnessType } from '../lib/accessibility-context';

interface AccessibilitySetupScreenProps {
  onComplete: () => void;
}

export const AccessibilitySetupScreen: React.FC<AccessibilitySetupScreenProps> = ({ onComplete }) => {
  const { updateSettings } = useAccessibility();
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [colorBlindnessType, setColorBlindnessType] = useState<ColorBlindnessType>('none');

  const handleNoNeeds = () => {
    updateSettings({
      colorBlindness: 'none',
      lowVision: false,
      largeText: false,
      voiceAssistance: false,
    });
    onComplete();
  };

  const handleColorBlindness = (type: ColorBlindnessType) => {
    setColorBlindnessType(type);
    updateSettings({
      colorBlindness: type,
      lowVision: false,
      largeText: false,
      voiceAssistance: false,
    });
    setTimeout(() => onComplete(), 500);
  };

  const handleLowVision = () => {
    updateSettings({
      colorBlindness: 'none',
      lowVision: true,
      largeText: true,
      voiceAssistance: true,
    });
    setTimeout(() => onComplete(), 500);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8" style={{ backgroundColor: '#f0f9ff' }}>
      <div className="max-w-md w-full mx-auto">
        <h2 className="mb-2" style={{ color: '#0f172a' }}>
          Accessibility Setup
        </h2>
        
        <p className="mb-8" style={{ color: '#475569' }}>
          Do you have any accessibility needs?
        </p>

        {selectedNeed === null && (
          <div className="space-y-4">
            <Card
              className="p-6 cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: '#cbd5e1' }}
              onClick={() => setSelectedNeed('colorblind')}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: '#e0f2fe' }}>
                  <Palette className="w-6 h-6" style={{ color: '#0891b2' }} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#0f172a' }}>
                    Color Blindness
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Adjust colors for better visibility
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: '#cbd5e1' }}
              onClick={handleLowVision}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: '#e0f2fe' }}>
                  <Eye className="w-6 h-6" style={{ color: '#0891b2' }} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#0f172a' }}>
                    Low Vision
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Enable large text and voice assistance
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: '#cbd5e1' }}
              onClick={handleNoNeeds}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: '#e0f2fe' }}>
                  <Check className="w-6 h-6" style={{ color: '#0891b2' }} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#0f172a' }}>
                    No Accessibility Needs
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Continue with default interface
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {selectedNeed === 'colorblind' && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedNeed(null)}
              className="mb-4"
              style={{ color: '#0891b2' }}
            >
              ← Back
            </Button>

            <h3 className="mb-4" style={{ color: '#0f172a' }}>
              Select Color Blindness Type
            </h3>

            <Card
              className="p-6 cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: '#cbd5e1' }}
              onClick={() => handleColorBlindness('protanopia')}
            >
              <h3 className="mb-1" style={{ color: '#0f172a' }}>
                Protanopia (Red-Blind)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Difficulty seeing red colors
              </p>
            </Card>

            <Card
              className="p-6 cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: '#cbd5e1' }}
              onClick={() => handleColorBlindness('deuteranopia')}
            >
              <h3 className="mb-1" style={{ color: '#0f172a' }}>
                Deuteranopia (Green-Blind)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Difficulty seeing green colors
              </p>
            </Card>

            <Card
              className="p-6 cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: '#cbd5e1' }}
              onClick={() => handleColorBlindness('tritanopia')}
            >
              <h3 className="mb-1" style={{ color: '#0f172a' }}>
                Tritanopia (Blue-Blind)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Difficulty seeing blue colors
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
