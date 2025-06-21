import { alternatesLanguage, defaultLocale, locales } from '@/lib/i18n/locales';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Comments from '@/app/[locale]/(public)/views/Comments';
import FAQs from '@/app/[locale]/(public)/views/FAQs';
import Features from '@/app/[locale]/(public)/views/Features';
import IframeSection from '@/app/[locale]/(public)/views/IframeSection';
import Recommendation from '@/app/[locale]/(public)/views/Recommendation';
import RelatedVideo from '@/app/[locale]/(public)/views/RelatedVideo';
import SectionWrapper from '@/app/[locale]/(public)/views/SectionWrapper';
import DownloadGame from '@/app/[locale]/(public)/views/DownloadGame';
import {siteConfig} from '@/lib/config/site';
import { SiteConfig} from '@/lib/types';
import GameRecommendationCard from '@/app/[locale]/(public)/views/GameRecommendationCard';
import { AppLayout } from '@/lib/components/layout/AppLayout';
import { getHomeSettings } from '@/lib/utils/game-box-settings';
import IframeTopSlot from '@/lib/components/slot/iframe-top-slot';
import IframeBottomSlot from '@/lib/components/slot/iframe-bottom-slot';
import StructuredData from '@/lib/components/seo/StructuredData';
import { loadFaqs } from '@/app/[locale]/(public)/views/FAQs';
type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return {
    title: `${t('title')}`,
    description: t('description'),
    alternates: {
      languages: alternatesLanguage(''),
    },
    icons: {
      icon: siteConfig.icon,
      apple: siteConfig.appleIcon,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const siteConfig2 = siteConfig as unknown as SiteConfig
  const pageName = siteConfig2.pageName;
  const t = await getTranslations({ locale });

  // 根据配置加载FAQ数据
  const faqData = siteConfig2.isShowFAQs ? await loadFaqs(locale, pageName) : [];

  const PageContent = () => (
    <>
      <StructuredData
        locale={locale}
        pageName={pageName}
        gameTitle={t('title')}
        gameDescription={t('description')}
        gameImage={pageName ? `/games/${pageName}/game_screenshot.webp` : undefined}
        gameUrl={siteConfig2.gameIframeUrl}
        showFAQs={siteConfig2.isShowFAQs}
        showRecommendation={siteConfig2.isShowRecommendation}
        showVideo={siteConfig2.isShowVideo}
        showComments={siteConfig2.isShowComments}
        faqs={faqData}
      />
      <div className="bg-background pt-6 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* 左侧主要内容区域 */}
            <div className="flex-1 min-w-0 space-y-6">
               <IframeTopSlot/>
                <IframeSection pageName={pageName} />
                <IframeBottomSlot/>
              <div>
                <SectionWrapper className="max-full">
                  <Features pageName={pageName} />
                  {siteConfig2.isShowFAQs && <FAQs locale={locale} pageName={pageName} />}
                  {siteConfig2.isShowVideo && <RelatedVideo pageName={pageName} siteConfig={siteConfig2} />}
                  {siteConfig2.isShowComments && <Comments pageName={pageName} siteConfig={siteConfig2} />}
                </SectionWrapper>
              </div>
              {siteConfig2.isShowRecommendation && <Recommendation locale={locale} />}
              <DownloadGame pageName={pageName} siteConfig={siteConfig2} />
            </div>

            {/* 右侧推荐卡片 - 移动端隐藏，受配置控制 */}
            {siteConfig2.isShowRecommendation && <GameRecommendationCard locale={locale} />}
          </div>
        </div>
      </div>
    </>
  );

  if (siteConfig.templateType === 'game-box') {
    const settings = await getHomeSettings(locale);
    return (
      <AppLayout categories={settings.categories}>
        <PageContent />
      </AppLayout>
    );
  }

  return <PageContent />;
}
