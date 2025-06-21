"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/lib/ui/components/button';
import { Card, CardContent } from '@/lib/ui/components/card';
import { useTranslations } from 'next-intl';
import { X, Cookie, Settings } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

interface CookieBannerProps {
  position?: 'top' | 'bottom';
  showSettingsButton?: boolean;
  autoShow?: boolean;
  expiryDays?: number;
}

export default function CookieBanner({
  position = 'bottom',
  showSettingsButton = true,
  autoShow = true,
  expiryDays = 365
}: CookieBannerProps) {
  const t = useTranslations('Cookies');
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // 必要Cookie，不可关闭
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && autoShow) {
      const cookieConsent = localStorage.getItem('cookie_consent');
      if (!cookieConsent) {
        // 延迟显示，避免影响页面加载
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [autoShow, isClient]);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now()
    };
    
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setIsVisible(false);
    
    // 触发Cookie设置事件
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
  };

  const handleAcceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: Date.now()
    };
    
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setIsVisible(false);
    setShowSettings(false);
    
    // 触发Cookie设置事件
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: Date.now()
    };
    
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setIsVisible(false);
    
    // 触发Cookie设置事件
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // 必要Cookie不可关闭
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  const positionClasses = position === 'top' 
    ? 'top-0' 
    : 'bottom-0';

  return (
    <div className={`fixed left-0 right-0 ${positionClasses} z-50 p-4`}>
      <Card className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm border border-border shadow-lg">
        <CardContent className="p-6">
          {!showSettings ? (
            // 基础Cookie横幅
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{t('title')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('description')}{' '}
                    <Link href="/privacy-policy" className="text-primary hover:underline">
                      {t('learnMore')}
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                {showSettingsButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('settings')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectAll}
                >
                  {t('rejectAll')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                >
                  {t('acceptAll')}
                </Button>
              </div>
            </div>
          ) : (
            // Cookie设置面板
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{t('settingsTitle')}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* 必要Cookie */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{t('necessary.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('necessary.description')}</p>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t('alwaysActive')}
                  </div>
                </div>
                
                {/* 分析Cookie */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{t('analytics.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('analytics.description')}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={preferences.analytics ? "default" : "ghost"}
                    onClick={() => togglePreference('analytics')}
                  >
                    {preferences.analytics ? t('enabled') : t('disabled')}
                  </Button>
                </div>
                
                {/* 营销Cookie */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{t('marketing.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('marketing.description')}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={preferences.marketing ? "default" : "ghost"}
                    onClick={() => togglePreference('marketing')}
                  >
                    {preferences.marketing ? t('enabled') : t('disabled')}
                  </Button>
                </div>
                
                {/* 功能Cookie */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{t('functional.title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('functional.description')}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={preferences.functional ? "default" : "ghost"}
                    onClick={() => togglePreference('functional')}
                  >
                    {preferences.functional ? t('enabled') : t('disabled')}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={handleRejectAll}
                >
                  {t('rejectAll')}
                </Button>
                <Button
                  onClick={handleAcceptSelected}
                >
                  {t('savePreferences')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
