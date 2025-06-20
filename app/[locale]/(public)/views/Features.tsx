import { getTranslations } from 'next-intl/server';

export default async function Features({pageName}:{pageName:string|null|undefined}) {
  const prefix = pageName ? pageName + '.' : '';
  const t = await getTranslations(`${prefix}HomeFeatures`);
  const screenshot_prefix = pageName ? '/games/' + pageName : '';
  const game_screenshot_path = `${screenshot_prefix}/game_screenshot.webp`;
  return (
    <>
      <h2 className="text-xl md:text-5xl font-bold text-left mb-4 md:mb-8 text-feature-title font-leckerli break-words">{t('gameTitle')}</h2>

      <div className="flex flex-col lg:flex-row mb-6 md:mb-12 items-start lg:items-center gap-6 md:gap-8">
        <section className="flex-1 lg:pr-4 w-full">
          <h2 className="text-lg md:text-3xl font-semibold mb-3 md:mb-6 text-feature-title font-leckerli break-words">{t('whatIsTitle')}</h2>
          <div className="bg-feature-card/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-feature-card/20 hover:bg-feature-card/40 transition-all duration-300">
            <p className="text-sm md:text-base text-feature-description leading-relaxed break-words">{t('whatIsDescription')}</p>
          </div>
        </section>
        <div className="flex-shrink-0 w-full lg:w-1/3 max-w-sm lg:max-w-none mx-auto lg:mx-0">
          <div className="bg-gradient-to-br from-feature-card/50 to-feature-card-hover/30 rounded-2xl p-2 border border-feature-card/30 hover:border-feature-card-hover/50 transition-all duration-300 hover:shadow-xl hover:shadow-feature-card/20 group">
            <div className="h-[200px] md:h-[280px] overflow-hidden rounded-xl relative">
              <img
                src={game_screenshot_path}
                alt="Game screenshot"
                className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-6 md:mb-12">
        <h2 className="text-lg md:text-3xl font-semibold mb-4 md:mb-6 text-feature-title font-leckerli break-words">{t('howToPlayTitle')}</h2>
        <div className="bg-feature-card/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-feature-card/20 hover:bg-feature-card/60 transition-all duration-300">
          <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-feature-description">
            {[1, 2, 3].map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 md:gap-4 leading-relaxed group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-feature-title/20 text-feature-title rounded-full flex items-center justify-center text-xs md:text-sm font-semibold group-hover:bg-feature-title/30 transition-colors duration-300">
                  {step}
                </span>
                <span className="break-words flex-1 pt-0.5 md:pt-1">
                  {t(`howToPlayStep${step}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mb-6 md:mb-12">
        <h2 className="text-lg md:text-3xl font-semibold mb-4 md:mb-6 text-feature-title font-leckerli break-words">
          {t('keyFeaturesTitle')}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-fr">
          {['feature1', 'feature2', 'feature3', 'feature4'].map((feature, index) => (
            <li
              key={index}
              className="bg-feature-card/80 hover:bg-feature-card-hover/90 transition-all duration-300 p-4 md:p-6 rounded-xl border border-feature-card/30 hover:border-feature-card-hover/50 hover:shadow-lg hover:shadow-feature-card/20 backdrop-blur-sm group cursor-default flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3 text-feature-title break-words group-hover:text-feature-title/90 transition-colors duration-300">
                {t(`${feature}Title`)}
              </h3>
              <p className="text-xs md:text-base text-feature-description leading-relaxed break-words flex-grow">
                {t(`${feature}Description`)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
