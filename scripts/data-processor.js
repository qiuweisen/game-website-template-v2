#!/usr/bin/env node

/**
 * 游戏网站数据处理器
 * 处理AI收集的游戏信息，生成网站配置和多语言文件
 */

const fs = require('fs');
const path = require('path');

// 支持的语言列表
const SUPPORTED_LANGUAGES = [
  'en', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ja', 'ko', 'ru', 'pt', 'it', 'th', 'vi', 'tr', 'id', 'bn', 'uk'
];

// 主题映射 - 根据游戏类型推荐主题
const THEME_MAPPING = {
  'action': 'cyberpunk-neon',
  'adventure': 'forest-theme',
  'puzzle': 'purple-tech',
  'strategy': 'deep-sea',
  'horror': 'dark',
  'racing': 'deep-red',
  'default': 'dark'
};

/**
 * 主处理函数
 */
function processAIData(inputFile, outputDir = './output') {
  try {
    console.log('🔄 开始处理AI数据...');
    
    // 读取AI返回的JSON数据
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const aiData = JSON.parse(rawData);
    
    // 验证数据完整性
    validateAIData(aiData);
    
    // 创建输出目录
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 生成网站配置文件
    const siteConfig = generateSiteConfig(aiData);
    fs.writeFileSync(
      path.join(outputDir, 'site.json'),
      JSON.stringify(siteConfig, null, 2)
    );
    console.log('✅ 生成网站配置文件: site.json');
    
    // 生成多语言文件
    const languageFiles = generateLanguageFiles(aiData, outputDir);
    console.log(`✅ 生成多语言文件: ${languageFiles.length} 个语言`);
    
    // 生成FAQ文件
    if (aiData.faq && aiData.faq.length > 0) {
      generateFAQFiles(aiData, outputDir);
      console.log('✅ 生成FAQ文件');
    }

    // 生成视频数据文件
    if (aiData.videos && aiData.videos.length > 0) {
      generateVideoFiles(aiData, outputDir);
      console.log('✅ 生成视频数据文件');
    }

    // 生成评论数据文件
    if (aiData.comments && aiData.comments.length > 0) {
      generateCommentFiles(aiData, outputDir);
      console.log('✅ 生成评论数据文件');
    }

    // 生成部署脚本
    generateDeploymentScript(aiData, outputDir);
    console.log('✅ 生成部署脚本');

    // 生成素材需求清单
    generateAssetRequirements(aiData, outputDir);
    console.log('✅ 生成素材需求清单');
    
    console.log(`🎉 数据处理完成！输出目录: ${outputDir}`);
    
    return {
      siteConfig,
      languageFiles,
      outputDir
    };
    
  } catch (error) {
    console.error('❌ 数据处理失败:', error.message);
    process.exit(1);
  }
}

/**
 * 验证AI数据完整性
 */
function validateAIData(data) {
  const required = [
    'gameInfo.name.en',
    'gameInfo.shortDescription.en',
    'gameplay.coreFeatures',
    'gameplay.howToPlay',
    'multiLanguage.en'
  ];

  for (const field of required) {
    if (!getNestedValue(data, field)) {
      throw new Error(`缺少必填字段: ${field}`);
    }
  }

  // 验证核心特色数量
  if (data.gameplay.coreFeatures.length !== 4) {
    throw new Error('核心特色必须为4个');
  }

  // 验证操作步骤数量
  if (data.gameplay.howToPlay.length !== 3) {
    throw new Error('操作步骤必须为3个');
  }

  // 验证视频数据（如果存在）
  if (data.videos && data.videos.length > 0) {
    data.videos.forEach((video, index) => {
      if (!video.title || !video.url) {
        throw new Error(`视频 ${index + 1} 缺少标题或链接`);
      }
    });
  }

  // 验证评论数据（如果存在）
  if (data.comments && data.comments.length > 0) {
    data.comments.forEach((comment, index) => {
      if (!comment.author || !comment.content) {
        throw new Error(`评论 ${index + 1} 缺少作者或内容`);
      }
    });
  }

  // 验证下载链接（如果存在）
  if (data.downloadUrls) {
    const hasAnyUrl = Object.values(data.downloadUrls).some(url => url && url.trim() !== '');
    if (!hasAnyUrl) {
      console.warn('⚠️ 警告: 下载链接数据存在但没有有效的URL');
    }
  }
}

/**
 * 生成网站配置文件
 */
function generateSiteConfig(data) {
  const gameName = data.gameInfo.name.en.toLowerCase().replace(/\s+/g, '-');
  const gameType = data.gameInfo.category ? data.gameInfo.category.toLowerCase() : 'game';
  const recommendedTheme = THEME_MAPPING[gameType] || THEME_MAPPING.default;

  // 处理下载链接
  const downloadUrls = data.downloadUrls || {};
  const hasDownloadUrls = Object.values(downloadUrls).some(url => url && url.trim() !== '');

  return {
    name: data.gameInfo.name.en,
    pageName: gameName,
    gameIframeUrl: data.gameInfo.gameUrl || "#",
    gameType: data.gameInfo.gameUrl ? "iframe" : "download",
    templateType: "game",
    theme: {
      name: data.technicalConfig?.recommendedTheme || recommendedTheme
    },
    seo: {
      title: data.seo?.metaTitle?.en || `Play ${data.gameInfo.name.en} Online`,
      description: data.seo?.metaDescription?.en || data.gameInfo.shortDescription.en,
      keywords: data.seo?.primaryKeywords?.join(', ') || data.gameInfo.name.en
    },
    isShowFAQs: data.faq && data.faq.length > 0,
    isShowVideo: data.videos && data.videos.length > 0,
    isShowComments: data.comments && data.comments.length > 0,
    isShowRecommendation: true,
    enablePromotion: false,
    customizeFeatures: false,

    // 视频配置
    videos: data.videos || [],

    // 评论配置
    comments: data.comments || [],

    // 下载配置
    gameDownload: {
      showDownloadButton: hasDownloadUrls,
      downloadUrls: downloadUrls,
      downloadCount: "10,000+"
    },

    compliance: generateComplianceConfig(data)
  };
}

/**
 * 生成多语言文件
 */
function generateLanguageFiles(data, outputDir) {
  const messagesDir = path.join(outputDir, 'messages');
  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
  }
  
  const generatedFiles = [];
  
  for (const lang of SUPPORTED_LANGUAGES) {
    if (data.multiLanguage[lang] || lang === 'en') {
      const langData = data.multiLanguage[lang] || data.multiLanguage.en;
      const content = generateLanguageContent(langData, data, lang);
      
      const fileName = `${lang}.json`;
      fs.writeFileSync(
        path.join(messagesDir, fileName),
        JSON.stringify(content, null, 2)
      );
      generatedFiles.push(fileName);
    }
  }
  
  return generatedFiles;
}

/**
 * 生成单个语言文件内容
 */
function generateLanguageContent(langData, fullData, lang) {
  const isEnglish = lang === 'en';
  const gameNameKey = isEnglish ? fullData.gameInfo.name.en : (fullData.gameInfo.name[lang] || fullData.gameInfo.name.en);

  return {
    HomeFeatures: {
      gameTitle: langData.gameTitle || `${gameNameKey}: Online Game`,
      whatIsTitle: langData.whatIsTitle || `What is ${gameNameKey}?`,
      whatIsDescription: langData.whatIsDescription || getDescriptionForLang(fullData, lang),
      howToPlayTitle: langData.howToPlayTitle || `How to Play ${gameNameKey}`,
      howToPlayStep1: getStepForLang(fullData.gameplay.howToPlay[0], lang),
      howToPlayStep2: getStepForLang(fullData.gameplay.howToPlay[1], lang),
      howToPlayStep3: getStepForLang(fullData.gameplay.howToPlay[2], lang),
      keyFeaturesTitle: langData.keyFeaturesTitle || `Key Features of ${gameNameKey}`,
      feature1Title: getFeatureTitleForLang(fullData.gameplay.coreFeatures[0], lang),
      feature1Description: getFeatureDescForLang(fullData.gameplay.coreFeatures[0], lang),
      feature2Title: getFeatureTitleForLang(fullData.gameplay.coreFeatures[1], lang),
      feature2Description: getFeatureDescForLang(fullData.gameplay.coreFeatures[1], lang),
      feature3Title: getFeatureTitleForLang(fullData.gameplay.coreFeatures[2], lang),
      feature3Description: getFeatureDescForLang(fullData.gameplay.coreFeatures[2], lang),
      feature4Title: getFeatureTitleForLang(fullData.gameplay.coreFeatures[3], lang),
      feature4Description: getFeatureDescForLang(fullData.gameplay.coreFeatures[3], lang)
    },
    HomeFAQs: {
      title: langData.faqTitle || `FAQs about ${gameNameKey}`
    },
    HomeRelatedVideo: {
      title: langData.videoTitle || `${gameNameKey} Videos`
    },
    HomeComments: {
      title: langData.commentsTitle || `Player Reviews`
    },
    DownloadGame: {
      title: langData.downloadTitle || `Download ${gameNameKey}`,
      downloadButton: "Download Now",
      availableOn: "Available on:"
    },
    IframeSection: {
      title: gameNameKey,
      description: langData.whatIsDescription || getDescriptionForLang(fullData, lang),
      playGame: "Play Game",
      downloadGame: "Download Game"
    },
    LoadingSection: {
      title: `Loading ${gameNameKey}...`
    },
    Recommendation: {
      title: "More Games You Might Like",
      playNow: "Play Now"
    }
  };
}

/**
 * 辅助函数 - 获取多语言文本
 */
function getDescriptionForLang(data, lang) {
  return data.gameInfo.shortDescription[lang] || data.gameInfo.shortDescription.en;
}

function getStepForLang(step, lang) {
  return step[lang] || step.en;
}

function getFeatureTitleForLang(feature, lang) {
  return feature.title[lang] || feature.title.en;
}

function getFeatureDescForLang(feature, lang) {
  return feature.description[lang] || feature.description.en;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

/**
 * 获取视频类型
 */
function getVideoType(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'YouTube';
  } else if (url.includes('bilibili.com')) {
    return 'Bilibili';
  } else if (url.includes('vimeo.com')) {
    return 'Vimeo';
  } else {
    return '其他平台';
  }
}

/**
 * 验证视频链接有效性
 */
function isValidVideoUrl(url) {
  try {
    const urlObj = new URL(url);
    return ['youtube.com', 'youtu.be', 'bilibili.com', 'vimeo.com'].some(domain =>
      urlObj.hostname.includes(domain)
    );
  } catch {
    return false;
  }
}

/**
 * 生成FAQ文件
 */
function generateFAQFiles(data, outputDir) {
  if (!data.faq || data.faq.length === 0) return;

  const faqDir = path.join(outputDir, 'faq');
  if (!fs.existsSync(faqDir)) {
    fs.mkdirSync(faqDir, { recursive: true });
  }

  for (const lang of SUPPORTED_LANGUAGES) {
    if (data.multiLanguage[lang] || lang === 'en') {
      const faqContent = data.faq.map(item => ({
        question: item.question[lang] || item.question.en,
        answer: item.answer[lang] || item.answer.en
      }));

      fs.writeFileSync(
        path.join(faqDir, `${lang}.json`),
        JSON.stringify(faqContent, null, 2)
      );
    }
  }
}

/**
 * 生成视频数据文件
 */
function generateVideoFiles(data, outputDir) {
  if (!data.videos || data.videos.length === 0) return;

  const videoDir = path.join(outputDir, 'videos');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // 生成视频配置文件
  fs.writeFileSync(
    path.join(videoDir, 'videos.json'),
    JSON.stringify(data.videos, null, 2)
  );

  // 生成视频使用说明
  const videoReadme = `# 视频配置说明

## 📹 视频列表

${data.videos.map((video, index) => `### ${index + 1}. ${video.title}
- **链接**: ${video.url}
- **类型**: ${getVideoType(video.url)}
- **状态**: ${isValidVideoUrl(video.url) ? '✅ 有效' : '❌ 需要验证'}
`).join('\n')}

## 🔧 使用方法

1. 将 \`videos.json\` 复制到项目的 \`lib/config/\` 目录
2. 在网站配置中设置 \`isShowVideo: true\`
3. 确保所有视频链接可以正常访问

## ⚠️ 注意事项

- 支持 YouTube、Bilibili、Vimeo 等主流平台
- 确保视频内容与游戏相关
- 建议视频时长在 1-10 分钟之间
`;

  fs.writeFileSync(path.join(videoDir, 'README.md'), videoReadme);
}

/**
 * 生成评论数据文件
 */
function generateCommentFiles(data, outputDir) {
  if (!data.comments || data.comments.length === 0) return;

  const commentDir = path.join(outputDir, 'comments');
  if (!fs.existsSync(commentDir)) {
    fs.mkdirSync(commentDir, { recursive: true });
  }

  // 生成评论配置文件
  fs.writeFileSync(
    path.join(commentDir, 'comments.json'),
    JSON.stringify(data.comments, null, 2)
  );

  // 生成评论使用说明
  const commentReadme = `# 评论配置说明

## 💬 评论列表

${data.comments.map((comment, index) => `### ${index + 1}. ${comment.author}
- **角色**: ${comment.role || '游戏玩家'}
- **内容**: ${comment.content}
- **头像**: ${comment.avatar || 'https://api.multiavatar.com/' + comment.author + '.svg'}
`).join('\n')}

## 🔧 使用方法

1. 将 \`comments.json\` 复制到项目的 \`lib/config/\` 目录
2. 在网站配置中设置 \`isShowComments: true\`
3. 评论将自动显示在网站上

## ⚠️ 注意事项

- 确保评论内容积极正面
- 用户名可以匿名化处理
- 头像使用 multiavatar 服务自动生成
`;

  fs.writeFileSync(path.join(commentDir, 'README.md'), commentReadme);
}

/**
 * 生成部署脚本
 */
function generateDeploymentScript(data, outputDir) {
  const gameName = data.gameInfo.name.en.toLowerCase().replace(/\s+/g, '-');
  const script = `#!/bin/bash
# 自动生成的部署脚本 - ${data.gameInfo.name.en}

GAME_NAME="${gameName}"
DOMAIN_NAME="\${GAME_NAME}.yourdomain.com"

echo "🚀 开始部署游戏网站: ${data.gameInfo.name.en}"

# 1. 复制配置文件
echo "⚙️ 应用网站配置..."
cp output/site.json lib/config/site.json

# 2. 复制多语言文件
echo "🌍 应用多语言内容..."
cp -r output/messages/* messages/

# 3. 复制FAQ文件（如果存在）
if [ -d "output/faq" ]; then
  echo "❓ 应用FAQ内容..."
  cp -r output/faq/* app/[locale]/(public)/faq/
fi

# 4. 复制视频配置（如果存在）
if [ -f "output/videos/videos.json" ]; then
  echo "🎬 应用视频配置..."
  cp output/videos/videos.json lib/config/
fi

# 5. 复制评论配置（如果存在）
if [ -f "output/comments/comments.json" ]; then
  echo "💬 应用评论配置..."
  cp output/comments/comments.json lib/config/
fi

# 6. 创建游戏素材目录
echo "📁 创建素材目录..."
mkdir -p public/games/\${GAME_NAME}

# 4. 下载游戏素材 (需要手动添加素材URL)
echo "🖼️ 请手动下载以下素材到 public/games/\${GAME_NAME}/ 目录:"
echo "  - game_screenshot.webp (游戏截图)"
echo "  - how-to-play.webp (操作演示图)"
echo "  - icon.png (游戏图标)"

# 5. 构建网站
echo "🔨 构建网站..."
npm run build

# 6. 部署 (根据实际部署方式调整)
echo "🌐 准备部署..."
echo "网站将部署到: https://\${DOMAIN_NAME}"

echo "✅ 部署脚本准备完成！"
echo "📋 请检查素材需求清单: output/asset-requirements.md"
`;

  fs.writeFileSync(path.join(outputDir, 'deploy.sh'), script);
  fs.chmodSync(path.join(outputDir, 'deploy.sh'), '755');
}

/**
 * 生成素材需求清单
 */
function generateAssetRequirements(data, outputDir) {
  const gameName = data.gameInfo.name.en.toLowerCase().replace(/\s+/g, '-');
  const requirements = `# ${data.gameInfo.name.en} - 素材需求清单

## 📋 必需素材

### 1. 游戏截图
- **文件名**: \`game_screenshot.webp\`
- **尺寸**: 1200x800px (3:2比例)
- **格式**: WebP (推荐) 或 PNG/JPG
- **内容**: 游戏主界面或精彩画面
- **位置**: \`public/games/${gameName}/game_screenshot.webp\`

### 2. 操作演示图
- **文件名**: \`how-to-play.webp\`
- **尺寸**: 800x450px (16:9比例)
- **格式**: WebP (推荐) 或 PNG/JPG
- **内容**: 展示游戏操作界面或控制方式
- **位置**: \`public/games/${gameName}/how-to-play.webp\`

### 3. 游戏图标
- **文件名**: \`icon.png\`
- **尺寸**: 512x512px (1:1比例)
- **格式**: PNG (透明背景)
- **内容**: 游戏LOGO或代表性图标
- **位置**: \`public/games/${gameName}/icon.png\`

## 🎨 设计要求

### 视觉风格
- **主题**: ${data.technicalConfig?.recommendedTheme || 'dark'}
- **色调**: 与游戏风格保持一致
- **品质**: 高清晰度，无水印

### 技术规格
- **压缩**: 优化文件大小，保持清晰度
- **格式**: 优先使用WebP格式
- **命名**: 严格按照指定文件名

## 📝 内容建议

### 游戏截图内容
${data.gameInfo.shortDescription.en}

### 操作演示重点
${data.gameplay.howToPlay.map((step, i) => `${i + 1}. ${step.en}`).join('\n')}

### 图标设计元素
- 体现游戏核心特色
- 简洁易识别
- 适合小尺寸显示

## 🎬 视频内容 ${data.videos && data.videos.length > 0 ? `(${data.videos.length}个视频)` : '(无视频)'}

${data.videos && data.videos.length > 0 ?
  data.videos.map((video, i) => `### ${i + 1}. ${video.title}
- **链接**: ${video.url}
- **平台**: ${getVideoType(video.url)}
- **状态**: ${isValidVideoUrl(video.url) ? '✅ 链接有效' : '⚠️ 需要验证'}
`).join('\n') :
  '暂无视频内容，建议添加游戏预告片或演示视频。'
}

## 💬 用户评论 ${data.comments && data.comments.length > 0 ? `(${data.comments.length}条评论)` : '(无评论)'}

${data.comments && data.comments.length > 0 ?
  data.comments.map((comment, i) => `### ${i + 1}. ${comment.author} (${comment.role || '游戏玩家'})
> ${comment.content}
`).join('\n') :
  '暂无用户评论，建议收集真实用户反馈。'
}

## ✅ 检查清单

- [ ] 所有文件已下载到正确位置
- [ ] 文件名完全匹配要求
- [ ] 图片尺寸符合规格
- [ ] 图片质量清晰无损
- [ ] 文件大小已优化

## 🔗 相关链接

- **游戏官网**: ${data.gameInfo.officialWebsite || '待补充'}
- **游戏链接**: ${data.gameInfo.gameUrl || '待补充'}
- **开发商**: ${data.gameInfo.developer || '待补充'}

---

**注意**: 如果无法获取专用的操作演示图，系统会自动使用游戏截图作为后备方案。
`;

  fs.writeFileSync(path.join(outputDir, 'asset-requirements.md'), requirements);
}

// 命令行执行
if (require.main === module) {
  const inputFile = process.argv[2];
  const outputDir = process.argv[3] || './output';
  
  if (!inputFile) {
    console.error('❌ 请提供输入文件路径');
    console.log('用法: node data-processor.js <ai-data.json> [output-dir]');
    process.exit(1);
  }
  
  processAIData(inputFile, outputDir);
}

/**
 * 生成合规配置
 */
function generateComplianceConfig(data) {
  if (!data.compliance) {
    return {
      enabled: true,
      preset: "basic",
      showAgeVerification: true,
      minimumAge: 13,
      showRegionRestriction: false,
      restrictedRegions: [],
      showCookieConsent: true,
      expiryDays: 30,
      customConfig: null
    };
  }

  const compliance = data.compliance;
  let preset = "basic";

  // 根据年龄分级和内容确定预设
  if (compliance.minimumAge >= 18 ||
      (compliance.contentWarnings && compliance.contentWarnings.length > 0)) {
    preset = "strict";
  } else if (compliance.recommendedPreset) {
    preset = compliance.recommendedPreset;
  }

  return {
    enabled: true,
    preset: preset,
    showAgeVerification: true,
    minimumAge: compliance.minimumAge || 13,
    showRegionRestriction: compliance.regionRestrictions && compliance.regionRestrictions.length > 0,
    restrictedRegions: compliance.regionRestrictions || [],
    showCookieConsent: true,
    expiryDays: preset === "strict" ? 7 : 30,
    customConfig: null
  };
}

module.exports = { processAIData };
