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

#### 6. 多语言内容需求
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
      "keyFeaturesTitle": "Key Features of [Game Name]"
    },
    "zh-CN": {
      "gameTitle": "游戏标题",
      "whatIsTitle": "什么是[游戏名]？",
      "whatIsDescription": "游戏描述",
      "howToPlayTitle": "如何玩[游戏名]",
      "keyFeaturesTitle": "[游戏名]的主要特色"
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

### 🎯 输出要求

请在完成信息收集后，按照以上JSON格式输出完整数据。如果某些信息无法获取，请在对应字段标注"需要补充"。

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
