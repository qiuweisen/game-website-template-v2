"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/lib/ui/components/button';
import { Card, CardContent } from '@/lib/ui/components/card';
import { Input } from '@/lib/ui/components/input';
import { useTranslations } from 'next-intl';
import { Calendar, AlertTriangle } from 'lucide-react';

interface AgeVerificationBannerProps {
  minimumAge?: number;
  showDatePicker?: boolean;
  autoShow?: boolean;
  expiryDays?: number;
  onVerified?: (age: number) => void;
  onRejected?: () => void;
}

export default function AgeVerificationBanner({
  minimumAge = 18,
  showDatePicker = true,
  autoShow = true,
  expiryDays = 30,
  onVerified,
  onRejected
}: AgeVerificationBannerProps) {
  const t = useTranslations('AgeVerification');
  const [isVisible, setIsVisible] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (autoShow) {
      const ageVerification = localStorage.getItem('age_verification');
      if (ageVerification) {
        try {
          const verification = JSON.parse(ageVerification);
          const now = Date.now();
          const expiryTime = verification.timestamp + (expiryDays * 24 * 60 * 60 * 1000);
          
          if (now < expiryTime && verification.verified && verification.age >= minimumAge) {
            return; // 已验证且未过期
          }
        } catch (error) {
          console.error('Error parsing age verification:', error);
        }
      }
      
      // 延迟显示，避免影响页面加载
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [autoShow, minimumAge, expiryDays]);

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerify = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (!birthDate) {
        setError(t('pleaseEnterBirthDate'));
        return;
      }

      const age = calculateAge(birthDate);
      
      if (age < minimumAge) {
        setError(t('ageRestriction', { age: minimumAge }));
        if (onRejected) {
          onRejected();
        } else {
          // 默认行为：重定向
          setTimeout(() => {
            window.location.href = 'https://www.google.com';
          }, 3000);
        }
        return;
      }

      // 保存验证结果
      const verification = {
        verified: true,
        age,
        timestamp: Date.now()
      };
      
      localStorage.setItem('age_verification', JSON.stringify(verification));
      setIsVisible(false);
      
      if (onVerified) {
        onVerified(age);
      }
    } catch (error) {
      setError(t('invalidDate'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      const verification = {
        verified: true,
        age: minimumAge, // 假设最低年龄
        timestamp: Date.now()
      };
      
      localStorage.setItem('age_verification', JSON.stringify(verification));
      setIsVisible(false);
      
      if (onVerified) {
        onVerified(minimumAge);
      }
    } else {
      if (onRejected) {
        onRejected();
      } else {
        window.location.href = 'https://www.google.com';
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-md w-full bg-background border border-border shadow-xl">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-warning/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('description', { age: minimumAge })}
          </p>

          {showDatePicker ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">{t('birthDate')}</label>
                </div>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleVerify}
                disabled={!birthDate || isLoading}
              >
                {isLoading ? 'Verifying...' : t('verify')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                {t('quickVerification', { age: minimumAge })}
              </p>
              
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleQuickVerify(true)}
              >
                {t('yesIAm', { age: minimumAge })}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={() => handleQuickVerify(false)}
              >
                {t('noIAmNot')}
              </Button>
            </div>
          )}

          {error && error.includes('ageRestriction') && (
            <div className="mt-4 p-3 bg-destructive/20 border border-destructive/50 rounded-lg">
              <p className="text-destructive text-sm">
                {t('redirectMessage')}
              </p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {t('privacyNotice')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
