import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Map, Route, Building2, Bell, Search } from 'lucide-react';
import { useAccessibility } from '../lib/accessibility-context';
import { getColorPalette } from '../lib/color-palettes';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { settings } = useAccessibility();
  const palette = getColorPalette(settings.colorBlindness);
  const textSize = settings.largeText ? '1.125rem' : '1rem';

  const quickActions = [
    { icon: Map, label: 'Map', screen: 'map', color: palette.primary },
    { icon: Route, label: 'Accessible Routes', screen: 'routes', color: palette.secondary },
    { icon: Building2, label: 'Nearby Facilities', screen: 'facilities', color: palette.accent },
    { icon: Bell, label: 'Announcements', screen: 'announcements', color: palette.primary },
  ];

  return (
    <div className="min-h-screen px-6 py-8" style={{ backgroundColor: palette.background }}>
      <div className="max-w-md w-full mx-auto">
        <h1 className="mb-2" style={{ color: palette.text }}>
          Campus Navigator
        </h1>
        
        <p className="mb-6" style={{ color: palette.textSecondary, fontSize: textSize }}>
          Where would you like to go today?
        </p>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: palette.textSecondary }} />
          <Input
            placeholder="Search buildings, rooms..."
            className="pl-12 h-14 rounded-full"
            style={{ fontSize: textSize, borderColor: palette.border }}
          />
        </div>

        <h3 className="mb-4" style={{ color: palette.text }}>
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.screen}
              className="p-6 cursor-pointer transition-all hover:shadow-lg border-2"
              style={{ borderColor: palette.border }}
              onClick={() => onNavigate(action.screen)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 rounded-full" style={{ backgroundColor: `${action.color}20` }}>
                  <action.icon className="w-8 h-8" style={{ color: action.color }} />
                </div>
                <span style={{ color: palette.text, fontSize: textSize }}>
                  {action.label}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {settings.voiceAssistance && (
          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: palette.surface, borderLeft: `4px solid ${palette.accent}` }}>
            <p style={{ color: palette.textSecondary, fontSize: textSize }}>
              🎤 Voice assistance is enabled. Say "Navigate to..." to start.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
