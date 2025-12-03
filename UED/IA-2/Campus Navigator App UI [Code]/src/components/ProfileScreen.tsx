import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Palette, Eye, Volume2, Type } from 'lucide-react';
import { useAccessibility } from '../lib/accessibility-context';
import { getColorPalette } from '../lib/color-palettes';

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { settings, updateSettings } = useAccessibility();
  const palette = getColorPalette(settings.colorBlindness);
  const textSize = settings.largeText ? '1.125rem' : '1rem';

  const colorBlindnessLabels = {
    none: 'None',
    protanopia: 'Protanopia (Red-Blind)',
    deuteranopia: 'Deuteranopia (Green-Blind)',
    tritanopia: 'Tritanopia (Blue-Blind)',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.background }}>
      <div className="px-6 py-4 flex items-center gap-4" style={{ backgroundColor: palette.surface }}>
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" style={{ color: palette.text }} />
        </Button>
        <h2 style={{ color: palette.text }}>Profile</h2>
      </div>

      <div className="px-6 py-6">
        {/* User info */}
        <Card className="p-6 mb-6 text-center" style={{ borderColor: palette.border }}>
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="text-2xl" style={{ backgroundColor: palette.primary, color: 'white' }}>
              JD
            </AvatarFallback>
          </Avatar>
          <h3 className="mb-1" style={{ color: palette.text, fontSize: textSize }}>
            John Doe
          </h3>
          <p style={{ color: palette.textSecondary, fontSize: '0.875rem' }}>
            student@campus.edu
          </p>
        </Card>

        {/* Accessibility preferences */}
        <h3 className="mb-4" style={{ color: palette.text, fontSize: textSize }}>
          Accessibility Preferences
        </h3>

        <div className="space-y-4 mb-6">
          {/* Color blindness */}
          <Card className="p-4" style={{ borderColor: palette.border }}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: `${palette.primary}20` }}>
                <Palette className="w-5 h-5" style={{ color: palette.primary }} />
              </div>
              <div className="flex-1">
                <h4 className="mb-1" style={{ color: palette.text, fontSize: textSize }}>
                  Color Blindness Mode
                </h4>
                <p style={{ color: palette.textSecondary, fontSize: '0.875rem' }}>
                  {colorBlindnessLabels[settings.colorBlindness]}
                </p>
              </div>
            </div>
          </Card>

          {/* Low vision */}
          <Card className="p-4" style={{ borderColor: palette.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${palette.primary}20` }}>
                  <Eye className="w-5 h-5" style={{ color: palette.primary }} />
                </div>
                <div>
                  <h4 className="mb-1" style={{ color: palette.text, fontSize: textSize }}>
                    Low Vision Mode
                  </h4>
                  <p style={{ color: palette.textSecondary, fontSize: '0.75rem' }}>
                    Enables large text & voice
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.lowVision}
                onCheckedChange={(checked) => {
                  updateSettings({
                    lowVision: checked,
                    largeText: checked,
                    voiceAssistance: checked,
                  });
                }}
              />
            </div>
          </Card>

          {/* Large text */}
          <Card className="p-4" style={{ borderColor: palette.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${palette.primary}20` }}>
                  <Type className="w-5 h-5" style={{ color: palette.primary }} />
                </div>
                <div>
                  <Label htmlFor="large-text" style={{ fontSize: textSize, color: palette.text }}>
                    Large Text
                  </Label>
                  <p style={{ color: palette.textSecondary, fontSize: '0.75rem' }}>
                    Increase text size
                  </p>
                </div>
              </div>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={(checked) => updateSettings({ largeText: checked })}
              />
            </div>
          </Card>

          {/* Voice assistance */}
          <Card className="p-4" style={{ borderColor: palette.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${palette.primary}20` }}>
                  <Volume2 className="w-5 h-5" style={{ color: palette.primary }} />
                </div>
                <div>
                  <Label htmlFor="voice-assist" style={{ fontSize: textSize, color: palette.text }}>
                    Voice Assistance
                  </Label>
                  <p style={{ color: palette.textSecondary, fontSize: '0.75rem' }}>
                    Audio navigation guidance
                  </p>
                </div>
              </div>
              <Switch
                id="voice-assist"
                checked={settings.voiceAssistance}
                onCheckedChange={(checked) => updateSettings({ voiceAssistance: checked })}
              />
            </div>
          </Card>
        </div>

        <Button
          variant="outline"
          className="w-full rounded-full py-6"
          style={{ borderColor: palette.border, color: palette.text, fontSize: textSize }}
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
