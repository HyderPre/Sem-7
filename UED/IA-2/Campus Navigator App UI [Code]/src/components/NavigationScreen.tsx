import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Navigation, Volume2, VolumeX, User, ArrowRight, MapPin } from 'lucide-react';
import { useAccessibility } from '../lib/accessibility-context';
import { getColorPalette } from '../lib/color-palettes';

interface NavigationScreenProps {
  onNavigate: (screen: string) => void;
}

export const NavigationScreen: React.FC<NavigationScreenProps> = ({ onNavigate }) => {
  const { settings } = useAccessibility();
  const palette = getColorPalette(settings.colorBlindness);
  const textSize = settings.largeText ? '1.125rem' : '1rem';
  const [voiceEnabled, setVoiceEnabled] = useState(settings.voiceAssistance);
  const [currentStep, setCurrentStep] = useState(0);

  const navigationSteps = [
    { instruction: 'Head north on Main Campus Drive', distance: '50m', icon: '⬆️' },
    { instruction: 'Turn right at the Student Center', distance: '120m', icon: '➡️' },
    { instruction: 'Take the accessible ramp entrance', distance: '30m', icon: '♿' },
    { instruction: 'Enter through the main lobby', distance: '10m', icon: '🚪' },
  ];

  const progress = ((currentStep + 1) / navigationSteps.length) * 100;

  useEffect(() => {
    if (voiceEnabled) {
      // Simulate voice announcement
      console.log('Voice: ' + navigationSteps[currentStep].instruction);
    }
  }, [currentStep, voiceEnabled]);

  const handleNextStep = () => {
    if (currentStep < navigationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.background }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: palette.surface }}>
        <h2 style={{ color: palette.text }}>Navigation</h2>
        <Button
          variant="ghost"
          onClick={() => onNavigate('profile')}
          className="p-2"
        >
          <User className="w-6 h-6" style={{ color: palette.text }} />
        </Button>
      </div>

      <div className="px-6 py-6">
        {/* Destination */}
        <Card className="p-4 mb-6" style={{ backgroundColor: palette.primary, borderColor: palette.primary }}>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-white" />
            <div>
              <p className="text-white opacity-80" style={{ fontSize: '0.875rem' }}>
                Destination
              </p>
              <h3 className="text-white" style={{ fontSize: textSize }}>
                Student Center - Room 204
              </h3>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span style={{ color: palette.text, fontSize: textSize }}>
              Step {currentStep + 1} of {navigationSteps.length}
            </span>
            <span style={{ color: palette.textSecondary, fontSize: textSize }}>
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current instruction */}
        <Card className="p-6 mb-6 border-2" style={{ borderColor: palette.accent }}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{navigationSteps[currentStep].icon}</div>
            <div className="flex-1">
              <h3 className="mb-2" style={{ color: palette.text, fontSize: settings.largeText ? '1.25rem' : '1.125rem' }}>
                {navigationSteps[currentStep].instruction}
              </h3>
              <p style={{ color: palette.textSecondary, fontSize: textSize }}>
                Distance: {navigationSteps[currentStep].distance}
              </p>
            </div>
          </div>
        </Card>

        {/* Upcoming steps */}
        <h4 className="mb-3" style={{ color: palette.text, fontSize: textSize }}>
          Upcoming Steps
        </h4>
        <div className="space-y-2 mb-6">
          {navigationSteps.slice(currentStep + 1, currentStep + 3).map((step, index) => (
            <Card key={index} className="p-3 opacity-60" style={{ borderColor: palette.border }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{step.icon}</span>
                <p style={{ color: palette.text, fontSize: '0.875rem' }}>
                  {step.instruction}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Voice control */}
        <Card className="p-4 mb-6" style={{ borderColor: palette.border }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {voiceEnabled ? (
                <Volume2 className="w-6 h-6" style={{ color: palette.primary }} />
              ) : (
                <VolumeX className="w-6 h-6" style={{ color: palette.textSecondary }} />
              )}
              <Label htmlFor="voice-toggle" style={{ fontSize: textSize, color: palette.text }}>
                Voice Guidance
              </Label>
            </div>
            <Switch
              id="voice-toggle"
              checked={voiceEnabled}
              onCheckedChange={setVoiceEnabled}
            />
          </div>
        </Card>

        {/* Next step button */}
        {currentStep < navigationSteps.length - 1 ? (
          <Button
            onClick={handleNextStep}
            className="w-full rounded-full py-6 flex items-center justify-center gap-2"
            style={{ backgroundColor: palette.primary, fontSize: textSize }}
          >
            Next Step
            <ArrowRight className="w-5 h-5" />
          </Button>
        ) : (
          <Card className="p-6 text-center" style={{ backgroundColor: `${palette.success}20`, borderColor: palette.success }}>
            <h3 className="mb-2" style={{ color: palette.success, fontSize: textSize }}>
              🎉 You've arrived!
            </h3>
            <p style={{ color: palette.text, fontSize: '0.875rem' }}>
              Student Center - Room 204
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
