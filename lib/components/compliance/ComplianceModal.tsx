"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/lib/ui/components/button';
import { Checkbox } from '@/lib/ui/components/checkbox';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

interface ComplianceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline?: () => void;
  showAgeVerification?: boolean;
  minimumAge?: number;
  showRegionRestriction?: boolean;
  restrictedRegions?: string[];
  showCookieConsent?: boolean;
}

export default function ComplianceModal({
  isOpen,
  onAccept,
  onDecline,
  showAgeVerification = true,
  minimumAge = 13,
  showRegionRestriction = false,
  restrictedRegions = [],
  showCookieConsent = true
}: ComplianceModalProps) {
  const t = useTranslations('Compliance');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [ageVerified, setAgeVerified] = useState(!showAgeVerification);
  const [cookieAccepted, setCookieAccepted] = useState(!showCookieConsent);
  const [userRegion, setUserRegion] = useState<string>('');

  // 检测用户地区
  useEffect(() => {
    if (showRegionRestriction) {
      // 使用浏览器API或第三方服务检测地区
      // 这里使用简单的时区检测作为示例
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserRegion(timezone);
    }
  }, [showRegionRestriction]);

  // 检查是否在限制地区
  const isRestrictedRegion = showRegionRestriction && 
    restrictedRegions.some(region => userRegion.includes(region));

  const canProceed = termsAccepted && privacyAccepted && ageVerified && cookieAccepted && !isRestrictedRegion;

  const handleAccept = () => {
    if (canProceed) {
      // 保存用户同意状态到localStorage
      localStorage.setItem('compliance_accepted', JSON.stringify({
        terms: termsAccepted,
        privacy: privacyAccepted,
        age: ageVerified,
        cookies: cookieAccepted,
        timestamp: Date.now()
      }));
      onAccept();
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    } else {
      // 默认行为：重定向到其他网站或显示提示
      window.location.href = 'https://www.google.com';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="max-w-2xl w-full bg-background border border-border rounded-lg shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            {t('title')}
          </h2>
        </div>

        <div className="px-6 py-4">
          {/* 地区限制提示 */}
          {isRestrictedRegion && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-300 text-center font-medium">
                {t('regionRestricted')}
              </p>
            </div>
          )}

          {/* 主要提示文本 */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
            <p className="text-center text-lg leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* 同意选项 */}
          <div className="space-y-4">
            {/* 服务条款 */}
            <div className="flex items-start gap-3">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                disabled={isRestrictedRegion}
              />
              <div className="flex-1">
                <p className="text-sm">
                  {t('agreeToTerms')}{' '}
                  <Link
                    href="/terms-of-services"
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {t('termsOfService')}
                  </Link>
                </p>
              </div>
            </div>

            {/* 隐私政策 */}
            <div className="flex items-start gap-3">
              <Checkbox
                checked={privacyAccepted}
                onCheckedChange={setPrivacyAccepted}
                disabled={isRestrictedRegion}
              />
              <div className="flex-1">
                <p className="text-sm">
                  {t('agreeToPrivacy')}{' '}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {t('privacyPolicy')}
                  </Link>
                </p>
              </div>
            </div>

            {/* 年龄验证 */}
            {showAgeVerification && (
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={ageVerified}
                  onCheckedChange={setAgeVerified}
                  disabled={isRestrictedRegion}
                />
                <div className="flex-1">
                  <p className="text-sm">
                    {t('ageVerification', { age: minimumAge })}
                  </p>
                </div>
              </div>
            )}

            {/* Cookie同意 */}
            {showCookieConsent && (
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={cookieAccepted}
                  onCheckedChange={setCookieAccepted}
                  disabled={isRestrictedRegion}
                />
                <div className="flex-1">
                  <p className="text-sm">
                    {t('cookieConsent')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 法律声明 */}
          <div className="mt-6 p-3 bg-gray-500/20 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              {t('legalNotice')}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 p-6 border-t border-border">
          {!isRestrictedRegion ? (
            <>
              <Button
                variant="outline"
                onClick={handleDecline}
                className="min-w-24"
              >
                {t('decline')}
              </Button>
              <Button
                onClick={handleAccept}
                disabled={!canProceed}
                className="min-w-24 bg-gradient-to-r from-blue-500 to-purple-600"
              >
                {t('accept')}
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDecline}
              className="min-w-32"
            >
              {t('leave')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
