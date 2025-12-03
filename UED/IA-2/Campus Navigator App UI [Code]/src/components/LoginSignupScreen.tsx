import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAccessibility } from '../lib/accessibility-context';
import { getColorPalette } from '../lib/color-palettes';

interface LoginSignupScreenProps {
  onLogin: () => void;
}

export const LoginSignupScreen: React.FC<LoginSignupScreenProps> = ({ onLogin }) => {
  const { settings } = useAccessibility();
  const palette = getColorPalette(settings.colorBlindness);
  const [activeTab, setActiveTab] = useState('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const textSize = settings.largeText ? '1.125rem' : '1rem';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: palette.background }}>
      <div className="max-w-md w-full">
        <h2 className="text-center mb-8" style={{ color: palette.text }}>
          Welcome Back
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login" style={{ fontSize: textSize }}>Login</TabsTrigger>
            <TabsTrigger value="signup" style={{ fontSize: textSize }}>Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ fontSize: textSize, color: palette.text }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@campus.edu"
                  className="h-12"
                  style={{ fontSize: textSize, borderColor: palette.border }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" style={{ fontSize: textSize, color: palette.text }}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12"
                  style={{ fontSize: textSize, borderColor: palette.border }}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full py-6"
                style={{ backgroundColor: palette.primary, fontSize: textSize }}
              >
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" style={{ fontSize: textSize, color: palette.text }}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-12"
                  style={{ fontSize: textSize, borderColor: palette.border }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" style={{ fontSize: textSize, color: palette.text }}>
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="student@campus.edu"
                  className="h-12"
                  style={{ fontSize: textSize, borderColor: palette.border }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" style={{ fontSize: textSize, color: palette.text }}>
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="h-12"
                  style={{ fontSize: textSize, borderColor: palette.border }}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full py-6"
                style={{ backgroundColor: palette.primary, fontSize: textSize }}
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
