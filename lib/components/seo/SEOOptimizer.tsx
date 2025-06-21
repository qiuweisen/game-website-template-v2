import { Metadata } from 'next';
import { siteConfig } from '@/lib/config/site';
import { SiteConfig } from '@/lib/types';

interface SEOOptimizerProps {
  locale: string;
  pageName?: string | null;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function generateEnhancedMetadata({
  locale,
  pageName,
  title,
  description,
  keywords = [],
  image,
  url
}: SEOOptimizerProps): Metadata {
  const config = siteConfig as SiteConfig;
  const baseUrl = config.domain;
  const pageUrl = url || `${baseUrl}/${locale}`;
  const ogImage = image || (pageName ? `${baseUrl}/games/${pageName}/game_screenshot.webp` : `${baseUrl}/og-image.jpg`);
  
  // 确保标题长度适中 (50-60字符)
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // 确保描述长度适中 (120-160字符)
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  // 生成关键词字符串
  const keywordsString = keywords.length > 0 ? keywords.join(', ') : undefined;

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: keywordsString,
    
    // Open Graph
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: pageUrl,
      siteName: config.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: locale,
      type: 'website',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      images: [ogImage],
      creator: config.name,
    },
    
    // 其他元数据
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // 语言和地区
    alternates: {
      canonical: pageUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'zh-CN': `${baseUrl}/zh-CN`,
        'es': `${baseUrl}/es`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
        'ja': `${baseUrl}/ja`,
      }
    },
    
    // 图标
    icons: {
      icon: config.icon,
      apple: config.appleIcon,
    },
    
    // 其他
    category: 'Games',
    classification: 'Browser Game',
    
    // 验证
    verification: {
      google: config.googleSiteVerification,
      yandex: config.yandexVerification,
      yahoo: config.yahooVerification,
      other: {
        'msvalidate.01': config.bingVerification,
      }
    }
  };
}

// SEO检查工具
export function validateSEO(metadata: Metadata): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // 检查标题长度
  if (metadata.title && typeof metadata.title === 'string') {
    if (metadata.title.length < 30) {
      warnings.push('标题过短，建议30-60字符');
    }
    if (metadata.title.length > 60) {
      warnings.push('标题过长，可能在搜索结果中被截断');
    }
  }
  
  // 检查描述长度
  if (metadata.description) {
    if (metadata.description.length < 120) {
      warnings.push('描述过短，建议120-160字符');
    }
    if (metadata.description.length > 160) {
      warnings.push('描述过长，可能在搜索结果中被截断');
    }
  }
  
  // 检查关键词
  if (!metadata.keywords) {
    suggestions.push('建议添加相关关键词');
  }
  
  // 检查Open Graph图片
  if (!metadata.openGraph?.images) {
    suggestions.push('建议添加Open Graph图片');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions
  };
}
