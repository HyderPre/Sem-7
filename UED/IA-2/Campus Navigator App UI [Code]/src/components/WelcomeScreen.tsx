import React from 'react';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#f0f9ff' }}>
      <div className="flex flex-col items-center max-w-md w-full">
        <div className="mb-8 p-6 rounded-full" style={{ backgroundColor: '#0891b2' }}>
          <MapPin className="w-16 h-16 text-white" strokeWidth={2} />
        </div>
        
        <h1 className="text-center mb-4" style={{ color: '#0f172a' }}>
          Campus Navigator
        </h1>
        
        <p className="text-center mb-12" style={{ color: '#475569' }}>
          Navigate your campus with ease
        </p>
        
        <Button
          onClick={onGetStarted}
          className="w-full rounded-full py-6"
          style={{ backgroundColor: '#0891b2' }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};
