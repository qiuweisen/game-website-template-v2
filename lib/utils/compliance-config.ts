/**
 * 合规配置工具
 * 用于管理和验证网站合规设置
 */

export interface ComplianceConfig {
  enabled: boolean;
  preset: 'basic' | 'strict' | 'gdpr' | 'disabled';
  showAgeVerification: boolean;
  minimumAge: number;
  showRegionRestriction: boolean;
  restrictedRegions: string[];
  showCookieConsent: boolean;
  expiryDays: number;
  customConfig?: any;
}

export interface GameComplianceInfo {
  ageRating: string;
  contentWarnings: string[];
  recommendedPreset: string;
  minimumAge: number;
  regionRestrictions: string[];
  dataCollection: string;
  cookieUsage: string;
}

// 预设配置
export const compliancePresets: Record<string, ComplianceConfig> = {
  // 基础合规（适用于大多数游戏网站）
  basic: {
    enabled: true,
    preset: 'basic',
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
    preset: 'strict',
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
    preset: 'gdpr',
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
    preset: 'disabled',
    showAgeVerification: false,
    minimumAge: 0,
    showRegionRestriction: false,
    restrictedRegions: [],
    showCookieConsent: false,
    expiryDays: 0
  }
};

// 内容分级映射
export const contentRatingMap: Record<string, { minimumAge: number; preset: string }> = {
  'E': { minimumAge: 0, preset: 'basic' },      // Everyone
  'E10+': { minimumAge: 10, preset: 'basic' },  // Everyone 10+
  'T': { minimumAge: 13, preset: 'basic' },     // Teen
  'M': { minimumAge: 17, preset: 'strict' },    // Mature
  'AO': { minimumAge: 18, preset: 'strict' },   // Adults Only
  '3+': { minimumAge: 3, preset: 'basic' },     // PEGI 3
  '7+': { minimumAge: 7, preset: 'basic' },     // PEGI 7
  '12+': { minimumAge: 12, preset: 'basic' },   // PEGI 12
  '16+': { minimumAge: 16, preset: 'strict' },  // PEGI 16
  '18+': { minimumAge: 18, preset: 'strict' }   // PEGI 18
};

// 地区代码映射
export const regionCodeMap: Record<string, string> = {
  'CN': 'China',
  'KP': 'North Korea',
  'IR': 'Iran',
  'SY': 'Syria',
  'CU': 'Cuba',
  'SD': 'Sudan',
  'MM': 'Myanmar',
  'BY': 'Belarus',
  'RU': 'Russia'
};

/**
 * 根据游戏信息生成合规配置
 */
export function generateComplianceConfig(gameInfo: GameComplianceInfo): ComplianceConfig {
  // 默认配置
  let config = { ...compliancePresets.basic };
  
  // 根据年龄分级调整
  if (gameInfo.ageRating && contentRatingMap[gameInfo.ageRating]) {
    const rating = contentRatingMap[gameInfo.ageRating];
    config.minimumAge = rating.minimumAge;
    config = { ...compliancePresets[rating.preset] };
  }
  
  // 根据最小年龄调整
  if (gameInfo.minimumAge) {
    config.minimumAge = Math.max(config.minimumAge, gameInfo.minimumAge);
    if (gameInfo.minimumAge >= 18) {
      config = { ...compliancePresets.strict };
      config.minimumAge = gameInfo.minimumAge;
    }
  }
  
  // 根据内容警告调整
  if (gameInfo.contentWarnings && gameInfo.contentWarnings.length > 0) {
    const hasAdultContent = gameInfo.contentWarnings.some(warning => 
      warning.toLowerCase().includes('violence') ||
      warning.toLowerCase().includes('adult') ||
      warning.toLowerCase().includes('sexual') ||
      warning.toLowerCase().includes('gambling')
    );
    
    if (hasAdultContent) {
      config = { ...compliancePresets.strict };
      config.minimumAge = Math.max(config.minimumAge, 18);
    }
  }
  
  // 根据地区限制调整
  if (gameInfo.regionRestrictions && gameInfo.regionRestrictions.length > 0) {
    config.showRegionRestriction = true;
    config.restrictedRegions = gameInfo.regionRestrictions;
  }
  
  // 根据推荐预设调整
  if (gameInfo.recommendedPreset && compliancePresets[gameInfo.recommendedPreset]) {
    config = { ...compliancePresets[gameInfo.recommendedPreset] };
  }
  
  return config;
}

/**
 * 验证合规配置
 */
export function validateComplianceConfig(config: ComplianceConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.enabled) {
    if (config.showAgeVerification && config.minimumAge < 0) {
      errors.push('Minimum age must be non-negative');
    }
    
    if (config.showRegionRestriction && config.restrictedRegions.length === 0) {
      errors.push('Restricted regions list cannot be empty when region restriction is enabled');
    }
    
    if (config.expiryDays <= 0) {
      errors.push('Expiry days must be positive');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 获取合规配置的描述
 */
export function getComplianceDescription(config: ComplianceConfig): string {
  if (!config.enabled) {
    return 'Compliance features are disabled';
  }
  
  const features: string[] = [];
  
  if (config.showAgeVerification) {
    features.push(`Age verification (${config.minimumAge}+)`);
  }
  
  if (config.showRegionRestriction) {
    features.push(`Region restrictions (${config.restrictedRegions.length} regions)`);
  }
  
  if (config.showCookieConsent) {
    features.push('Cookie consent');
  }
  
  return `${config.preset.toUpperCase()} preset: ${features.join(', ')}`;
}

/**
 * 检查用户是否符合合规要求
 */
export function checkUserCompliance(
  config: ComplianceConfig,
  userAge?: number,
  userRegion?: string
): { compliant: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  if (!config.enabled) {
    return { compliant: true, reasons: [] };
  }
  
  // 检查年龄
  if (config.showAgeVerification && userAge !== undefined) {
    if (userAge < config.minimumAge) {
      reasons.push(`User age (${userAge}) is below minimum required age (${config.minimumAge})`);
    }
  }
  
  // 检查地区
  if (config.showRegionRestriction && userRegion) {
    if (config.restrictedRegions.includes(userRegion)) {
      reasons.push(`User region (${userRegion}) is restricted`);
    }
  }
  
  return {
    compliant: reasons.length === 0,
    reasons
  };
}

/**
 * 获取合规状态的本地存储
 */
export function getStoredCompliance(): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('compliance_accepted');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * 清除合规状态
 */
export function clearStoredCompliance(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('compliance_accepted');
  localStorage.removeItem('cookie_consent');
  localStorage.removeItem('age_verification');
}
