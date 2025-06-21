"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/lib/ui/components/button';
import { useTranslations } from 'next-intl';

interface SimpleComplianceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline?: () => void;
  showAgeVerification?: boolean;
  minimumAge?: number;
}

export default function SimpleComplianceModal({
  isOpen,
  onAccept,
  onDecline,
  showAgeVerification = true,
  minimumAge = 13
}: SimpleComplianceModalProps) {
  const t = useTranslations('Compliance');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [ageVerified, setAgeVerified] = useState(!showAgeVerification);

  const canProceed = termsAccepted && privacyAccepted && ageVerified;

  const handleAccept = () => {
    if (canProceed) {
      // 保存用户同意状态到localStorage
      localStorage.setItem('compliance_accepted', JSON.stringify({
        terms: termsAccepted,
        privacy: privacyAccepted,
        age: ageVerified,
        timestamp: Date.now()
      }));
      onAccept();
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    } else {
      // 默认行为：重定向到其他网站
      window.location.href = 'https://www.google.com';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            服务条款和隐私协议
          </h2>
        </div>
        
        <div className="px-6 py-4">
          {/* 主要提示文本 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-center text-lg leading-relaxed text-blue-800 dark:text-blue-200">
              为了使用本网站，您需要同意我们的服务条款和隐私协议
            </p>
          </div>

          {/* 同意选项 */}
          <div className="space-y-4">
            {/* 服务条款 */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <p className="text-sm">
                  我同意{' '}
                  <a 
                    href="/terms-of-services" 
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    服务条款
                  </a>
                </p>
              </div>
            </div>

            {/* 隐私政策 */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <p className="text-sm">
                  我同意{' '}
                  <a 
                    href="/privacy-policy" 
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    隐私协议
                  </a>
                </p>
              </div>
            </div>

            {/* 年龄验证 */}
            {showAgeVerification && (
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={ageVerified}
                  onChange={(e) => setAgeVerified(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm">
                    我确认我已年满 {minimumAge} 岁
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 法律声明 */}
          <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              继续使用即表示您已阅读并理解我们的法律文档
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="min-w-24"
          >
            拒绝
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!canProceed}
            className="min-w-24 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            同意
          </Button>
        </div>
      </div>
    </div>
  );
}
