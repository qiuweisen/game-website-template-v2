"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ComplianceModal from './ComplianceModal';

interface ComplianceConfig {
  enabled: boolean;
  showAgeVerification: boolean;
  minimumAge: number;
  showRegionRestriction: boolean;
  restrictedRegions: string[];
  showCookieConsent: boolean;
  expiryDays: number; // 同意状态的有效期（天）
}

interface ComplianceContextType {
  isCompliant: boolean;
  showModal: () => void;
  hideModal: () => void;
  resetCompliance: () => void;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

interface ComplianceProviderProps {
  children: ReactNode;
  config: ComplianceConfig;
}

export function ComplianceProvider({ children, config }: ComplianceProviderProps) {
  const [isCompliant, setIsCompliant] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储的同意状态
  useEffect(() => {
    // 添加安全检查
    if (!config || !config.enabled) {
      setIsCompliant(true);
      setIsLoading(false);
      return;
    }

    const checkCompliance = () => {
      try {
        const stored = localStorage.getItem('compliance_accepted');
        if (stored) {
          const compliance = JSON.parse(stored);
          const now = Date.now();
          const expiryTime = compliance.timestamp + (config.expiryDays * 24 * 60 * 60 * 1000);
          
          // 检查是否过期
          if (now < expiryTime && compliance.terms && compliance.privacy) {
            setIsCompliant(true);
          } else {
            // 过期或不完整，清除并重新显示
            localStorage.removeItem('compliance_accepted');
            setShowComplianceModal(true);
          }
        } else {
          setShowComplianceModal(true);
        }
      } catch (error) {
        console.error('Error checking compliance:', error);
        setShowComplianceModal(true);
      }
      setIsLoading(false);
    };

    // 延迟检查，确保页面加载完成
    const timer = setTimeout(checkCompliance, 1000);
    return () => clearTimeout(timer);
  }, [config]);

  const handleAccept = () => {
    setIsCompliant(true);
    setShowComplianceModal(false);
  };

  const handleDecline = () => {
    // 可以自定义拒绝后的行为
    window.location.href = 'https://www.google.com';
  };

  const showModal = () => {
    setShowComplianceModal(true);
  };

  const hideModal = () => {
    setShowComplianceModal(false);
  };

  const resetCompliance = () => {
    localStorage.removeItem('compliance_accepted');
    setIsCompliant(false);
    setShowComplianceModal(true);
  };

  const contextValue: ComplianceContextType = {
    isCompliant,
    showModal,
    hideModal,
    resetCompliance
  };

  // 加载中时显示空白或加载动画
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ComplianceContext.Provider value={contextValue}>
      {children}
      {config && config.enabled && (
        <ComplianceModal
          isOpen={showComplianceModal}
          onAccept={handleAccept}
          onDecline={handleDecline}
          showAgeVerification={config.showAgeVerification}
          minimumAge={config.minimumAge}
          showRegionRestriction={config.showRegionRestriction}
          restrictedRegions={config.restrictedRegions}
          showCookieConsent={config.showCookieConsent}
        />
      )}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
}

// 默认配置
export const defaultComplianceConfig: ComplianceConfig = {
  enabled: true,
  showAgeVerification: true,
  minimumAge: 13,
  showRegionRestriction: false,
  restrictedRegions: [],
  showCookieConsent: true,
  expiryDays: 30
};

// 预设配置
export const compliancePresets = {
  // 基础合规（适用于大多数游戏网站）
  basic: {
    enabled: true,
    showAgeVerification: true,
    minimumAge: 13,
    showRegionRestriction: false,
    restrictedRegions: [],
    showCookieConsent: true,
    expiryDays: 30
  },
  
  // 严格合规（适用于成人内容或敏感游戏）
  strict: {
    enabled: true,
    showAgeVerification: true,
    minimumAge: 18,
    showRegionRestriction: true,
    restrictedRegions: ['CN', 'KP', 'IR'], // 示例限制地区
    showCookieConsent: true,
    expiryDays: 7
  },
  
  // 欧盟合规（GDPR要求）
  gdpr: {
    enabled: true,
    showAgeVerification: true,
    minimumAge: 16,
    showRegionRestriction: false,
    restrictedRegions: [],
    showCookieConsent: true,
    expiryDays: 30
  },
  
  // 禁用合规（仅用于开发环境）
  disabled: {
    enabled: false,
    showAgeVerification: false,
    minimumAge: 0,
    showRegionRestriction: false,
    restrictedRegions: [],
    showCookieConsent: false,
    expiryDays: 0
  }
};
