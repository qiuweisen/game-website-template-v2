# 游戏网站AI信息收集需求模板

## 📋 使用说明

将此模板发送给Gemini或Perplexity，AI将按照标准流程收集游戏信息并返回结构化数据，可直接用于网站建设。

---

## 🎯 AI任务指令

你是一个专业的游戏网站内容策划师。请按照以下要求，为指定游戏收集完整的建站信息，并以标准JSON格式返回所有数据。

### 📝 任务目标
为游戏 **[游戏名称]** 收集建站所需的完整信息，包括：
- 游戏基本信息和特色
- 多语言内容（至少英语和中文）
- SEO优化数据
- 技术配置建议
- 竞品分析

### 🔍 信息收集要求

#### 1. 游戏基本信息
- 游戏全名（英文和中文）
- 游戏类型/分类
- 开发商/发行商
- 发布时间
- 平台支持
- 游戏官方网站
- 游戏简介（50-100字）
- 详细描述（150-300字）

#### 2. 游戏玩法分析
- 核心玩法机制
- 操作方式（3个主要步骤）
- 游戏特色（4个核心特点）
- 目标用户群体
- 游戏难度等级

#### 3. 竞品分析
- 找出3-5个同类型热门游戏
- 分析各竞品的特色和优势
- 总结本游戏的差异化优势

#### 4. SEO关键词研究
- 主要关键词（5-10个）
- 长尾关键词（10-15个）
- 相关搜索词
- 月搜索量估算（如可获取）

#### 5. 多语言内容需求
为以下语言提供翻译：
- 英语 (en)
- 简体中文 (zh-CN)
- 西班牙语 (es)
- 法语 (fr)
- 德语 (de)
- 日语 (ja)

### 📊 返回数据格式

请严格按照以下JSON格式返回所有信息：

```json
{
  "gameInfo": {
    "name": {
      "en": "Game Name",
      "zh-CN": "游戏名称"
    },
    "category": "游戏类型",
    "developer": "开发商",
    "publisher": "发行商",
    "releaseDate": "发布时间",
    "platforms": ["平台1", "平台2"],
    "officialWebsite": "官方网站URL",
    "gameUrl": "游戏链接（如果是在线游戏）",
    "shortDescription": {
      "en": "50-100 words description",
      "zh-CN": "50-100字描述"
    },
    "detailedDescription": {
      "en": "150-300 words detailed description",
      "zh-CN": "150-300字详细描述"
    }
  },
  "gameplay": {
    "coreFeatures": [
      {
        "title": {"en": "Feature 1", "zh-CN": "特色1"},
        "description": {"en": "Description", "zh-CN": "描述"}
      },
      {
        "title": {"en": "Feature 2", "zh-CN": "特色2"},
        "description": {"en": "Description", "zh-CN": "描述"}
      },
      {
        "title": {"en": "Feature 3", "zh-CN": "特色3"},
        "description": {"en": "Description", "zh-CN": "描述"}
      },
      {
        "title": {"en": "Feature 4", "zh-CN": "特色4"},
        "description": {"en": "Description", "zh-CN": "描述"}
      }
    ],
    "howToPlay": [
      {"en": "Step 1 description", "zh-CN": "步骤1描述"},
      {"en": "Step 2 description", "zh-CN": "步骤2描述"},
      {"en": "Step 3 description", "zh-CN": "步骤3描述"}
    ],
    "targetAudience": "目标用户群体",
    "difficulty": "难度等级"
  },
  "competitors": [
    {
      "name": "竞品名称",
      "features": ["特色1", "特色2"],
      "advantages": "优势分析"
    }
  ],
  "seo": {
    "primaryKeywords": ["关键词1", "关键词2"],
    "longTailKeywords": ["长尾词1", "长尾词2"],
    "relatedTerms": ["相关词1", "相关词2"],
    "metaTitle": {
      "en": "SEO标题",
      "zh-CN": "SEO标题"
    },
    "metaDescription": {
      "en": "SEO描述",
      "zh-CN": "SEO描述"
    }
  },
  "multiLanguage": {
    "en": {
      "gameTitle": "Game Title",
      "whatIsTitle": "What is [Game Name]?",
      "whatIsDescription": "Game description",
      "howToPlayTitle": "How to Play [Game Name]",
      "keyFeaturesTitle": "Key Features of [Game Name]"
    },
    "zh-CN": {
      "gameTitle": "游戏标题",
      "whatIsTitle": "什么是[游戏名]？",
      "whatIsDescription": "游戏描述",
      "howToPlayTitle": "如何玩[游戏名]",
      "keyFeaturesTitle": "[游戏名]的主要特色"
    },
    "es": {
      "gameTitle": "Título del juego",
      "whatIsTitle": "¿Qué es [Nombre del juego]?",
      "whatIsDescription": "Descripción del juego",
      "howToPlayTitle": "Cómo jugar [Nombre del juego]",
      "keyFeaturesTitle": "Características principales de [Nombre del juego]"
    }
  },
  "technicalConfig": {
    "recommendedTheme": "推荐主题名称",
    "themeReason": "推荐理由",
    "imageRequirements": [
      "游戏截图 (1200x800px)",
      "操作演示图 (800x450px)",
      "图标 (512x512px)"
    ],
    "domainSuggestions": ["域名建议1", "域名建议2"]
  },
  "faq": [
    {
      "question": {"en": "Question", "zh-CN": "问题"},
      "answer": {"en": "Answer", "zh-CN": "答案"}
    }
  ]
}
```

### ⚠️ 重要要求

1. **数据准确性**：所有信息必须基于真实可靠的来源
2. **内容原创性**：描述文字需要原创，避免直接复制
3. **SEO优化**：关键词选择要考虑搜索量和竞争度
4. **多语言质量**：翻译要准确、自然、符合当地表达习惯
5. **格式严格性**：必须严格按照JSON格式返回，确保可以直接解析

### 🎯 输出要求

请在完成信息收集后，按照以上JSON格式输出完整数据。如果某些信息无法获取，请在对应字段标注"需要补充"。

---

## 📋 使用示例

**发送给AI的完整指令：**

```
请按照游戏网站AI信息收集需求模板，为游戏"Sprunki Retake"收集完整的建站信息。

[将上述完整模板内容粘贴到这里]

请严格按照要求的JSON格式返回所有数据。
```

---

## 🔄 后续流程

1. **信息收集** - AI返回结构化数据
2. **数据验证** - 人工检查关键信息准确性
3. **配置生成** - 自动生成网站配置文件
4. **内容导入** - 批量导入多语言内容
5. **网站部署** - 自动化部署和上线
6. **SEO优化** - 应用SEO配置和监控

此模板确保了从信息收集到网站上线的完整自动化流程。

---

## 🛠️ 配套工具脚本

### 数据处理脚本示例

```javascript
// data-processor.js - 处理AI返回的JSON数据
function processAIData(aiResponse) {
  const data = JSON.parse(aiResponse);

  // 生成网站配置文件
  const siteConfig = {
    name: data.gameInfo.name.en,
    gameIframeUrl: data.gameInfo.gameUrl,
    theme: { name: data.technicalConfig.recommendedTheme },
    seo: {
      title: data.seo.metaTitle.en,
      description: data.seo.metaDescription.en,
      keywords: data.seo.primaryKeywords.join(', ')
    }
  };

  // 生成多语言文件
  const languages = ['en', 'zh-CN', 'es', 'fr', 'de', 'ja'];
  languages.forEach(lang => {
    if (data.multiLanguage[lang]) {
      generateLanguageFile(lang, data.multiLanguage[lang], data);
    }
  });

  return { siteConfig, languageFiles: languages };
}

function generateLanguageFile(lang, langData, fullData) {
  const content = {
    HomeFeatures: {
      gameTitle: langData.gameTitle,
      whatIsTitle: langData.whatIsTitle,
      whatIsDescription: langData.whatIsDescription,
      howToPlayTitle: langData.howToPlayTitle,
      howToPlayStep1: fullData.gameplay.howToPlay[0][lang],
      howToPlayStep2: fullData.gameplay.howToPlay[1][lang],
      howToPlayStep3: fullData.gameplay.howToPlay[2][lang],
      keyFeaturesTitle: langData.keyFeaturesTitle,
      feature1Title: fullData.gameplay.coreFeatures[0].title[lang],
      feature1Description: fullData.gameplay.coreFeatures[0].description[lang],
      feature2Title: fullData.gameplay.coreFeatures[1].title[lang],
      feature2Description: fullData.gameplay.coreFeatures[1].description[lang],
      feature3Title: fullData.gameplay.coreFeatures[2].title[lang],
      feature3Description: fullData.gameplay.coreFeatures[2].description[lang],
      feature4Title: fullData.gameplay.coreFeatures[3].title[lang],
      feature4Description: fullData.gameplay.coreFeatures[3].description[lang]
    }
  };

  // 保存到 messages/${lang}.json
  return content;
}
```

### 自动化部署脚本

```bash
#!/bin/bash
# deploy-game-site.sh - 自动化部署脚本

GAME_NAME=$1
AI_DATA_FILE=$2

echo "🚀 开始部署游戏网站: $GAME_NAME"

# 1. 处理AI数据
echo "📊 处理AI收集的数据..."
node data-processor.js $AI_DATA_FILE

# 2. 生成配置文件
echo "⚙️ 生成网站配置..."
cp template-config.json lib/config/site.json
# 替换配置中的占位符

# 3. 生成多语言文件
echo "🌍 生成多语言内容..."
# 批量生成语言文件

# 4. 下载游戏素材
echo "🖼️ 下载游戏素材..."
mkdir -p public/games/$GAME_NAME
# 下载截图和图标

# 5. 构建和部署
echo "🔨 构建网站..."
npm run build

echo "🌐 部署到服务器..."
# 部署逻辑

echo "✅ 部署完成！"
echo "🔗 网站地址: https://$GAME_NAME.yourdomain.com"
```

## 📈 质量检查清单

### AI数据验证
- [ ] 游戏名称和基本信息准确
- [ ] 所有必填字段已完成
- [ ] JSON格式正确无误
- [ ] 多语言翻译质量良好
- [ ] SEO关键词相关性高
- [ ] 竞品分析客观准确

### 技术配置验证
- [ ] 游戏链接可正常访问
- [ ] 主题选择合适
- [ ] 图片素材需求明确
- [ ] 域名建议可用

### 内容质量验证
- [ ] 描述文字原创性
- [ ] 操作步骤清晰易懂
- [ ] 特色功能突出
- [ ] FAQ内容实用

## 🔄 迭代优化流程

1. **数据收集** → AI按模板收集信息
2. **质量检查** → 人工验证关键数据
3. **配置生成** → 自动生成网站文件
4. **测试部署** → 在测试环境验证
5. **正式上线** → 部署到生产环境
6. **效果监控** → 跟踪SEO和用户数据
7. **持续优化** → 根据数据调整策略

## 📞 技术支持

如果在使用过程中遇到问题：

1. **数据格式错误** - 检查JSON语法
2. **翻译质量问题** - 人工校对关键内容
3. **SEO效果不佳** - 调整关键词策略
4. **技术部署问题** - 检查配置文件和依赖

---

**注意**: 此模板设计为标准化流程，可根据具体需求调整字段和要求。建议在正式使用前先用1-2个游戏进行测试验证。
