import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Navigation, MapPin, Accessibility, ArrowLeft } from 'lucide-react';
import { useAccessibility } from '../lib/accessibility-context';
import { getColorPalette } from '../lib/color-palettes';

interface MapScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onNavigate, onBack }) => {
  const { settings } = useAccessibility();
  const palette = getColorPalette(settings.colorBlindness);
  const textSize = settings.largeText ? '1.125rem' : '1rem';

  const accessibleLocations = [
    { name: 'Student Center', type: 'Accessible Entrance', distance: '120m' },
    { name: 'Library', type: 'Elevator Available', distance: '250m' },
    { name: 'Science Building', type: 'Ramp Access', distance: '180m' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.background }}>
      <div className="px-6 py-4 flex items-center gap-4" style={{ backgroundColor: palette.surface }}>
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6" style={{ color: palette.text }} />
        </Button>
        <h2 style={{ color: palette.text }}>Campus Map</h2>
      </div>

      <div className="px-6 py-6">
        {/* Map Visualization */}
        <Card className="mb-6 overflow-hidden" style={{ borderColor: palette.border }}>
          <div className="relative h-96" style={{ backgroundColor: '#e0f2fe' }}>
            {/* Simplified campus map */}
            <div className="absolute inset-0 p-6">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                {/* Campus paths */}
                <path d="M 50 150 L 350 150" stroke={palette.border} strokeWidth="8" strokeLinecap="round" />
                <path d="M 200 50 L 200 250" stroke={palette.border} strokeWidth="8" strokeLinecap="round" />
                
                {/* Buildings */}
                <rect x="80" y="80" width="60" height="60" fill={palette.primary} opacity="0.7" rx="4" />
                <rect x="260" y="80" width="60" height="60" fill={palette.secondary} opacity="0.7" rx="4" />
                <rect x="170" y="180" width="60" height="60" fill={palette.accent} opacity="0.7" rx="4" />
                
                {/* Accessibility markers */}
                <circle cx="110" cy="110" r="12" fill={palette.success} />
                <circle cx="290" cy="110" r="12" fill={palette.success} />
                <circle cx="200" cy="210" r="12" fill={palette.success} />
                
                {/* Current location */}
                <circle cx="200" cy="150" r="16" fill={palette.error} opacity="0.3" />
                <circle cx="200" cy="150" r="8" fill={palette.error} />
              </svg>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg" style={{ backgroundColor: palette.surface, opacity: 0.95 }}>
              <div className="flex gap-4 flex-wrap" style={{ fontSize: '0.75rem' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.error }}></div>
                  <span style={{ color: palette.text }}>You</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette.success }}></div>
                  <span style={{ color: palette.text }}>Accessible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: palette.primary }}></div>
                  <span style={{ color: palette.text }}>Buildings</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <h3 className="mb-4" style={{ color: palette.text }}>
          Nearby Accessible Locations
        </h3>

        <div className="space-y-3 mb-6">
          {accessibleLocations.map((location, index) => (
            <Card key={index} className="p-4" style={{ borderColor: palette.border }}>
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="p-2 rounded-full" style={{ backgroundColor: `${palette.success}20` }}>
                    <Accessibility className="w-5 h-5" style={{ color: palette.success }} />
                  </div>
                  <div>
                    <h4 className="mb-1" style={{ color: palette.text, fontSize: textSize }}>
                      {location.name}
                    </h4>
                    <p style={{ color: palette.textSecondary, fontSize: '0.875rem' }}>
                      {location.type}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" style={{ fontSize: '0.75rem' }}>
                  {location.distance}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => onNavigate('navigation')}
          className="w-full rounded-full py-6 flex items-center justify-center gap-2"
          style={{ backgroundColor: palette.primary, fontSize: textSize }}
        >
          <Navigation className="w-5 h-5" />
          Start Navigation
        </Button>
      </div>
    </div>
  );
};
