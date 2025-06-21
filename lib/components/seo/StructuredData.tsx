import { siteConfig } from '@/lib/config/site';
import { SiteConfig } from '@/lib/types';

interface StructuredDataProps {
  locale: string;
  pageName?: string | null;
  gameTitle?: string;
  gameDescription?: string;
  gameImage?: string;
  gameUrl?: string;
  showFAQs?: boolean;
  showRecommendation?: boolean;
  showVideo?: boolean;
  showComments?: boolean;
  faqs?: Array<{question: string; answer: string}>;
}

export default function StructuredData({
  locale,
  pageName,
  gameTitle,
  gameDescription,
  gameImage,
  gameUrl,
  showFAQs = false,
  showRecommendation = false,
  showVideo = false,
  showComments = false,
  faqs = []
}: StructuredDataProps) {
  const config = siteConfig as SiteConfig;
  
  // 网站基础结构化数据
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": config.name,
    "url": config.domain,
    "description": gameDescription || config.description,
    "inLanguage": locale,
    "publisher": {
      "@type": "Organization",
      "name": config.name,
      "url": config.domain
    }
  };

  // 游戏相关结构化数据 - 只有当有游戏内容时才添加
  const gameSchema = (pageName && gameUrl) ? {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": gameTitle || config.name,
    "description": gameDescription || config.description,
    "url": `${config.domain}/${locale}`,
    "image": gameImage || `${config.domain}/games/${pageName}/game_screenshot.webp`,
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "publisher": {
      "@type": "Organization",
      "name": config.name,
      "url": config.domain
    },
    "genre": "Browser Game",
    "playMode": "SinglePlayer",
    "accessibilityFeature": [
      "fullKeyboardControl",
      "fullMouseControl"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "inLanguage": locale
  } : null;

  // 面包屑导航结构化数据 - 简化版本，不包含推荐链接
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": config.domain
      },
      ...(pageName ? [{
        "@type": "ListItem",
        "position": 2,
        "name": gameTitle || pageName,
        "item": `${config.domain}/${locale}`
      }] : [])
    ]
  };

  // FAQ结构化数据 - 只有当启用FAQ且有内容时才添加
  const faqSchema = (showFAQs && faqs && faqs.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // 只添加实际存在的结构化数据
  const schemas = [websiteSchema, breadcrumbSchema];

  // 只有当游戏确实存在且有URL时才添加游戏schema
  if (gameSchema) {
    schemas.push(gameSchema);
  }

  // 只有当FAQ功能启用且有实际FAQ数据时才添加FAQ schema
  if (faqSchema) {
    schemas.push(faqSchema);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2)
          }}
        />
      ))}
    </>
  );
}
