import { SiteConfig } from '@/lib/types';

/**
 * SEO配置验证工具
 * 确保结构化数据与实际页面渲染内容完全匹配
 */

export interface SEOValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export function validateSEOConfiguration(config: SiteConfig): SEOValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const suggestions: string[] = [];

  // 验证基础配置
  if (!config.name || config.name.trim() === '') {
    errors.push('网站名称不能为空');
  }

  if (!config.domain || config.domain.trim() === '') {
    errors.push('域名不能为空');
  }

  // 验证游戏相关配置
  if (config.gameType === 'iframe' && (!config.gameIframeUrl || config.gameIframeUrl.trim() === '')) {
    warnings.push('游戏iframe URL为空，游戏结构化数据将不会生成');
  }

  // 验证FAQ配置
  if (config.isShowFAQs) {
    suggestions.push('FAQ功能已启用，确保FAQ数据文件存在');
  } else {
    suggestions.push('FAQ功能已禁用，FAQ结构化数据将不会生成');
  }

  // 验证推荐功能
  if (config.isShowRecommendation) {
    suggestions.push('推荐功能已启用，确保推荐数据完整');
  } else {
    suggestions.push('推荐功能已禁用，相关组件将不会渲染');
  }

  // 验证视频功能
  if (config.isShowVideo) {
    if (!config.videos || config.videos.length === 0) {
      warnings.push('视频功能已启用但没有视频数据');
    }
  }

  // 验证评论功能
  if (config.isShowComments) {
    if (!config.comments || config.comments.length === 0) {
      warnings.push('评论功能已启用但没有评论数据');
    }
  }

  // 验证下载功能
  if (config.gameDownload?.showDownloadButton) {
    const downloadUrls = config.gameDownload.downloadUrls;
    const hasAnyUrl = Object.values(downloadUrls || {}).some(url => url && url.trim() !== '');
    if (!hasAnyUrl) {
      warnings.push('下载按钮已启用但没有下载链接');
    }
  }

  // 验证合规配置
  if (config.compliance?.enabled) {
    if (!config.compliance.preset) {
      warnings.push('合规功能已启用但未设置预设配置');
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    suggestions
  };
}

/**
 * 验证结构化数据配置
 */
export function validateStructuredDataConfig(config: {
  showFAQs: boolean;
  showRecommendation: boolean;
  showVideo: boolean;
  showComments: boolean;
  faqs: any[];
  gameUrl?: string;
  pageName?: string | null;
}): SEOValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const suggestions: string[] = [];

  // 验证FAQ结构化数据
  if (config.showFAQs) {
    if (!config.faqs || config.faqs.length === 0) {
      warnings.push('FAQ功能已启用但没有FAQ数据，FAQ结构化数据将不会生成');
    } else {
      suggestions.push(`FAQ结构化数据将包含 ${config.faqs.length} 个问题`);
    }
  }

  // 验证游戏结构化数据
  if (config.pageName && config.gameUrl) {
    suggestions.push('游戏结构化数据将会生成');
  } else if (config.pageName && !config.gameUrl) {
    warnings.push('有游戏页面名称但没有游戏URL，游戏结构化数据将不会生成');
  }

  // 验证推荐功能对SEO的影响
  if (!config.showRecommendation) {
    suggestions.push('推荐功能已禁用，内部链接结构可能较简单');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    suggestions
  };
}

/**
 * 生成SEO报告
 */
export function generateSEOReport(config: SiteConfig, structuredDataConfig: any): string {
  const configValidation = validateSEOConfiguration(config);
  const structuredDataValidation = validateStructuredDataConfig(structuredDataConfig);

  let report = '# SEO配置验证报告\n\n';

  // 基础配置状态
  report += '## 基础配置状态\n';
  report += `- 网站名称: ${config.name || '未设置'}\n`;
  report += `- 域名: ${config.domain || '未设置'}\n`;
  report += `- 游戏类型: ${config.gameType || '未设置'}\n`;
  report += `- 模板类型: ${config.templateType || '未设置'}\n\n`;

  // 功能开关状态
  report += '## 功能开关状态\n';
  report += `- FAQ功能: ${config.isShowFAQs ? '✅ 启用' : '❌ 禁用'}\n`;
  report += `- 推荐功能: ${config.isShowRecommendation ? '✅ 启用' : '❌ 禁用'}\n`;
  report += `- 视频功能: ${config.isShowVideo ? '✅ 启用' : '❌ 禁用'}\n`;
  report += `- 评论功能: ${config.isShowComments ? '✅ 启用' : '❌ 禁用'}\n`;
  report += `- 合规功能: ${config.compliance?.enabled ? '✅ 启用' : '❌ 禁用'}\n\n`;

  // 结构化数据状态
  report += '## 结构化数据状态\n';
  report += `- 网站基础数据: ✅ 将生成\n`;
  report += `- 面包屑导航: ✅ 将生成\n`;
  report += `- 游戏数据: ${structuredDataConfig.gameUrl ? '✅ 将生成' : '❌ 不会生成'}\n`;
  report += `- FAQ数据: ${structuredDataConfig.showFAQs && structuredDataConfig.faqs.length > 0 ? '✅ 将生成' : '❌ 不会生成'}\n\n`;

  // 错误和警告
  if (configValidation.errors.length > 0) {
    report += '## ❌ 错误\n';
    configValidation.errors.forEach(error => {
      report += `- ${error}\n`;
    });
    report += '\n';
  }

  if (configValidation.warnings.length > 0 || structuredDataValidation.warnings.length > 0) {
    report += '## ⚠️ 警告\n';
    [...configValidation.warnings, ...structuredDataValidation.warnings].forEach(warning => {
      report += `- ${warning}\n`;
    });
    report += '\n';
  }

  if (configValidation.suggestions.length > 0 || structuredDataValidation.suggestions.length > 0) {
    report += '## 💡 建议\n';
    [...configValidation.suggestions, ...structuredDataValidation.suggestions].forEach(suggestion => {
      report += `- ${suggestion}\n`;
    });
    report += '\n';
  }

  return report;
}
