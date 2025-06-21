# 游戏网站AI信息收集模板

## 📋 使用说明

将此模板发送给AI助手（如Gemini、Perplexity等），AI将按照标准流程收集游戏信息并返回结构化数据，可直接用于网站建设。

---

## 🎯 AI任务指令

你是一个专业的游戏网站内容策划师。请为游戏 **[游戏名称]** 收集完整的建站信息，并以JSON格式返回所有数据。

### 📝 信息收集要求

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

#### 5. 合规要求分析
- 目标用户年龄群体
- 是否包含成人内容或暴力元素
- 适用的地区限制
- 数据收集和隐私要求

#### 6. 视频内容收集
**要求：收集4-6个相关视频**
- 游戏预告片/宣传视频
- 游戏玩法演示视频
- 游戏攻略/教程视频
- 游戏评测视频
- 每个视频需要：
  - 准确的标题（中英文）
  - 有效的YouTube/Bilibili/其他平台链接
  - 确保视频内容与游戏高度相关

#### 7. 用户评论内容收集
**要求：收集5-10条真实用户评论**
- 来源：Steam评论、App Store评论、Google Play评论、社交媒体等
- 每条评论包含：
  - 用户名（可匿名化处理）
  - 用户角色/身份（如"游戏玩家"、"资深玩家"、"新手玩家"等）
  - 评论内容（50-150字，积极正面）
  - 头像链接（使用 https://api.multiavatar.com/用户名.svg 格式）
- 确保评论真实性和多样性

#### 8. 下载信息收集
**要求：收集所有可用的下载渠道**
- iOS App Store链接（如果有移动版）
- Google Play链接（如果有移动版）
- Steam链接（如果在Steam平台）
- 官方网站下载链接
- Epic Games Store链接（如适用）
- 其他平台链接（如GOG、Origin等）
- 注明每个平台的可用性和价格信息

#### 9. 多语言内容需求
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
    "name": {"en": "Game Name", "zh-CN": "游戏名称"},
    "category": "游戏类型",
    "developer": "开发商",
    "gameUrl": "游戏链接",
    "shortDescription": {"en": "50-100 words", "zh-CN": "50-100字"},
    "detailedDescription": {"en": "150-300 words", "zh-CN": "150-300字"}
  },
  "gameplay": {
    "coreFeatures": [
      {"title": {"en": "Feature 1", "zh-CN": "特色1"}, "description": {"en": "Description", "zh-CN": "描述"}},
      {"title": {"en": "Feature 2", "zh-CN": "特色2"}, "description": {"en": "Description", "zh-CN": "描述"}},
      {"title": {"en": "Feature 3", "zh-CN": "特色3"}, "description": {"en": "Description", "zh-CN": "描述"}},
      {"title": {"en": "Feature 4", "zh-CN": "特色4"}, "description": {"en": "Description", "zh-CN": "描述"}}
    ],
    "howToPlay": [
      {"en": "Step 1", "zh-CN": "步骤1"},
      {"en": "Step 2", "zh-CN": "步骤2"},
      {"en": "Step 3", "zh-CN": "步骤3"}
    ]
  },
  "videos": [
    {"title": "游戏预告片", "url": "https://youtube.com/watch?v=xxx"},
    {"title": "玩法演示", "url": "https://youtube.com/watch?v=yyy"},
    {"title": "游戏攻略", "url": "https://youtube.com/watch?v=zzz"}
  ],
  "comments": [
    {
      "author": "用户名1",
      "role": "游戏玩家",
      "content": "这个游戏真的很有趣，画面精美，玩法创新！",
      "avatar": "https://api.multiavatar.com/user1.svg"
    },
    {
      "author": "用户名2",
      "role": "资深玩家",
      "content": "操作简单易上手，但是有很大的策略深度。",
      "avatar": "https://api.multiavatar.com/user2.svg"
    }
  ],
  "downloadUrls": {
    "ios": "https://apps.apple.com/app/xxx",
    "android": "https://play.google.com/store/apps/details?id=xxx",
    "pc": "https://example.com/download/pc",
    "steam": "https://store.steampowered.com/app/xxx",
    "mac": "https://example.com/download/mac"
  },
  "seo": {
    "primaryKeywords": ["关键词1", "关键词2"],
    "longTailKeywords": ["长尾词1", "长尾词2"],
    "metaTitle": {"en": "SEO标题", "zh-CN": "SEO标题"},
    "metaDescription": {"en": "SEO描述", "zh-CN": "SEO描述"}
  },
  "multiLanguage": {
    "en": {
      "gameTitle": "Game Title",
      "whatIsTitle": "What is [Game Name]?",
      "whatIsDescription": "Game description",
      "howToPlayTitle": "How to Play [Game Name]",
      "keyFeaturesTitle": "Key Features of [Game Name]",
      "faqTitle": "Frequently Asked Questions",
      "videoTitle": "Related Videos",
      "commentsTitle": "Player Reviews",
      "downloadTitle": "Download Game"
    },
    "zh-CN": {
      "gameTitle": "游戏标题",
      "whatIsTitle": "什么是[游戏名]？",
      "whatIsDescription": "游戏描述",
      "howToPlayTitle": "如何玩[游戏名]",
      "keyFeaturesTitle": "[游戏名]的主要特色",
      "faqTitle": "常见问题",
      "videoTitle": "相关视频",
      "commentsTitle": "玩家评价",
      "downloadTitle": "下载游戏"
    },
    "es": {
      "gameTitle": "Título del Juego",
      "whatIsTitle": "¿Qué es [Nombre del Juego]?",
      "whatIsDescription": "Descripción del juego",
      "howToPlayTitle": "Cómo Jugar [Nombre del Juego]",
      "keyFeaturesTitle": "Características Principales de [Nombre del Juego]",
      "faqTitle": "Preguntas Frecuentes",
      "videoTitle": "Videos Relacionados",
      "commentsTitle": "Reseñas de Jugadores",
      "downloadTitle": "Descargar Juego"
    },
    "fr": {
      "gameTitle": "Titre du Jeu",
      "whatIsTitle": "Qu'est-ce que [Nom du Jeu] ?",
      "whatIsDescription": "Description du jeu",
      "howToPlayTitle": "Comment Jouer à [Nom du Jeu]",
      "keyFeaturesTitle": "Caractéristiques Principales de [Nom du Jeu]",
      "faqTitle": "Questions Fréquemment Posées",
      "videoTitle": "Vidéos Connexes",
      "commentsTitle": "Avis des Joueurs",
      "downloadTitle": "Télécharger le Jeu"
    },
    "de": {
      "gameTitle": "Spieltitel",
      "whatIsTitle": "Was ist [Spielname]?",
      "whatIsDescription": "Spielbeschreibung",
      "howToPlayTitle": "Wie man [Spielname] spielt",
      "keyFeaturesTitle": "Hauptmerkmale von [Spielname]",
      "faqTitle": "Häufig gestellte Fragen",
      "videoTitle": "Verwandte Videos",
      "commentsTitle": "Spielerbewertungen",
      "downloadTitle": "Spiel herunterladen"
    },
    "ja": {
      "gameTitle": "ゲームタイトル",
      "whatIsTitle": "[ゲーム名]とは？",
      "whatIsDescription": "ゲームの説明",
      "howToPlayTitle": "[ゲーム名]の遊び方",
      "keyFeaturesTitle": "[ゲーム名]の主な特徴",
      "faqTitle": "よくある質問",
      "videoTitle": "関連動画",
      "commentsTitle": "プレイヤーレビュー",
      "downloadTitle": "ゲームをダウンロード"
    }
  },
  "compliance": {
    "recommendedPreset": "basic|strict|gdpr|disabled",
    "minimumAge": 13
  },
  "faq": [
    {"question": {"en": "Question", "zh-CN": "问题"}, "answer": {"en": "Answer", "zh-CN": "答案"}}
  ]
}
```

### ⚠️ 重要要求

1. **数据准确性**：所有信息必须基于真实可靠的来源
2. **内容原创性**：描述文字需要原创，避免直接复制
3. **格式严格性**：必须严格按照JSON格式返回，确保可以直接解析
4. **视频链接有效性**：确保所有视频链接可以正常访问
5. **评论真实性**：用户评论必须基于真实评价，不可编造
6. **下载链接准确性**：所有下载链接必须指向正确的官方渠道
7. **多语言一致性**：各语言版本的内容含义必须一致
8. **内容适宜性**：所有内容必须适合目标年龄群体

### 🎯 输出要求

请在完成信息收集后，按照以上JSON格式输出完整数据。如果某些信息无法获取，请在对应字段标注"需要补充"。

### ✅ 数据验证清单

在提交数据前，请确认以下项目：

**基础信息验证**
- [ ] 游戏名称准确无误
- [ ] 游戏URL可以正常访问
- [ ] 开发商信息正确
- [ ] 游戏分类准确

**内容质量验证**
- [ ] 游戏描述原创且准确（50-300字）
- [ ] 4个核心特色描述完整
- [ ] 3个操作步骤清晰易懂
- [ ] FAQ问答实用且相关

**视频内容验证**
- [ ] 3-5个视频链接有效
- [ ] 视频标题准确描述内容
- [ ] 视频与游戏高度相关
- [ ] 视频来源可靠

**用户评论验证**
- [ ] 5-10条评论内容真实
- [ ] 评论来源可追溯
- [ ] 评论内容积极正面
- [ ] 用户角色多样化

**下载链接验证**
- [ ] 所有链接指向官方渠道
- [ ] 链接可以正常访问
- [ ] 平台信息准确
- [ ] 价格信息正确（如适用）

**多语言验证**
- [ ] 6种语言翻译完整
- [ ] 各语言内容含义一致
- [ ] 翻译质量良好
- [ ] 文化适应性考虑

---

## 📋 使用示例

**发送给AI的完整指令：**

```
请按照游戏网站AI信息收集模板，为游戏"[游戏名称]"收集完整的建站信息。

[将上述完整模板内容粘贴到这里]

请严格按照要求的JSON格式返回所有数据。
```

---

## 🔄 后续流程

1. **信息收集** - AI返回结构化数据
2. **数据验证** - 人工检查关键信息准确性
3. **配置生成** - 根据数据生成网站配置文件
4. **内容导入** - 批量导入多语言内容
5. **网站部署** - 按照SOP流程部署上线

此模板确保了从信息收集到网站上线的完整流程。

---

**注意**: 此模板设计为标准化流程，可根据具体需求调整。建议先用1-2个游戏进行测试验证。
