import React, { useState } from 'react';
import { AccessibilityProvider } from './lib/accessibility-context';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AccessibilitySetupScreen } from './components/AccessibilitySetupScreen';
import { LoginSignupScreen } from './components/LoginSignupScreen';
import { HomeScreen } from './components/HomeScreen';
import { MapScreen } from './components/MapScreen';
import { NavigationScreen } from './components/NavigationScreen';
import { ProfileScreen } from './components/ProfileScreen';

type Screen = 'welcome' | 'accessibility' | 'login' | 'home' | 'map' | 'routes' | 'facilities' | 'announcements' | 'navigation' | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => setCurrentScreen('accessibility')} />;
      
      case 'accessibility':
        return <AccessibilitySetupScreen onComplete={() => setCurrentScreen('login')} />;
      
      case 'login':
        return <LoginSignupScreen onLogin={() => setCurrentScreen('home')} />;
      
      case 'home':
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
      
      case 'map':
        return (
          <MapScreen
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'navigation':
        return <NavigationScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
      
      case 'profile':
        return <ProfileScreen onBack={() => setCurrentScreen('navigation')} />;
      
      case 'routes':
      case 'facilities':
      case 'announcements':
        return (
          <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#f0f9ff' }}>
            <div className="text-center">
              <h2 className="mb-4" style={{ color: '#0f172a' }}>
                {currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)}
              </h2>
              <p className="mb-6" style={{ color: '#475569' }}>
                This feature is coming soon!
              </p>
              <button
                onClick={() => setCurrentScreen('home')}
                className="px-6 py-3 rounded-full"
                style={{ backgroundColor: '#0891b2', color: 'white' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      
      default:
        return <WelcomeScreen onGetStarted={() => setCurrentScreen('accessibility')} />;
    }
  };

  return (
    <AccessibilityProvider>
      <div className="max-w-md mx-auto min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        {renderScreen()}
      </div>
    </AccessibilityProvider>
  );
}

export default App;
