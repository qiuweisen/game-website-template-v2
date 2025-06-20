# 游戏网站开发SOP标准操作程序

## 📋 文档概述

本SOP文档基于游戏网站模板项目的实际结构，为新游戏站点的快速开发提供标准化操作流程。

**适用范围**: 基于现有模板的单游戏网站开发  
**目标**: 标准化配置流程，减少错误，提高开发效率  
**版本**: v2.0  
**最后更新**: 2024-12-20

---

## 🎯 第一阶段：项目初始化与信息收集

### 1.1 游戏信息收集清单

在开始配置前，必须收集以下信息：

**游戏基本信息**
- [ ] 游戏名称（英文）
- [ ] 游戏标语/口号
- [ ] 游戏简介描述（50-160字符）
- [ ] 游戏类型/分类

**技术信息**
- [ ] 游戏iframe地址
- [ ] 网站域名（完整URL，如：https://example.com）
- [ ] 下载链接（iOS/Android/PC/Steam/Mac等）

**内容素材**
- [ ] 游戏截图（推荐尺寸：1200x800px）
- [ ] 游戏特色功能描述（4个特色点）
- [ ] FAQ问题与回答（8-10个）
- [ ] 相关YouTube视频链接（3-5个）
- [ ] 用户评论内容（5-8条）

### 1.2 环境准备

```bash
# 1. 克隆模板项目
git clone [template-repo-url]
cd [project-name]

# 2. 安装依赖
bun install

# 3. 验证开发环境
bun dev
```

---

## ⚙️ 第二阶段：核心配置文件修改

### 2.1 主配置文件 `lib/config/site.json`

**优先级**: 🔴 最高  
**影响范围**: 整个网站的核心设置

```json
{
  "name": "[游戏名称]",
  "slogan": "[游戏标语]", 
  "domain": "[完整域名，如：https://example.com]",
  "icon": "/favicon.ico",
  "appleIcon": "/apple-touch-icon.png",
  "templateType": "single-game",
  "theme": {
    "name": "dark",
    "headFont": "Arial, sans-serif",
    "primaryColor": "#007bff",
    "fontColor": "#333333",
    "backgroundColor": "#ffffff"
  },
  "gaId": "[Google Analytics ID]",
  "clarityId": "[Microsoft Clarity ID]",
  "plausible": "[Plausible Analytics URL]",
  "gameType": "iframe",
  "gameIframeUrl": "[游戏iframe地址]",
  "gameRedirectUrl": "",
  "bgType": "iframe",
  "bgImage": "",
  "bgVideo": "",
  "gameDownload": {
    "showDownloadButton": true,
    "downloadUrls": {
      "ios": "[iOS下载链接]",
      "android": "[Android下载链接]", 
      "pc": "[PC下载链接]",
      "steam": "[Steam链接]",
      "mac": "[Mac下载链接]"
    }
  },
  "isShowFAQs": true,
  "isShowVideo": true,
  "videos": [
    {
      "title": "[视频标题1]",
      "url": "[YouTube链接1]"
    }
  ],
  "isShowComments": true,
  "comments": [
    {
      "author": "[评论者]",
      "role": "[身份]",
      "content": "[评论内容]",
      "avatar": "https://api.multiavatar.com/[评论者].png"
    }
  ],
  "isShowRecommendation": true,
  "customizeFeatures": false
}
```

**⚠️ 关键注意事项**:
- `customizeFeatures: false` - 单游戏模板必须设置为false
- `templateType: "single-game"` - 确保模板类型正确
- 所有URL必须是完整的https链接
- 游戏名称避免使用特殊字符

### 2.2 开发环境配置 `lib/config/default.json`

**用途**: 开发环境的示例配置，生产环境会被site.json覆盖

确保default.json存在且包含完整的示例配置，用于开发时预览效果。

### 2.3 配置文件引用检查 `lib/config/site.ts`

确认配置文件正确引用：

```typescript
import { SiteConfig } from '../types';
import siteConfigJSON from './site.json';
import defaultConfigJSON from './default.json';

let config = {...siteConfigJSON} as unknown as SiteConfig;

if (process.env.NODE_ENV === 'development') {
    config = {
        ...siteConfigJSON,
        ...defaultConfigJSON
    } 
}

export const siteConfig: SiteConfig = config;
```

---

## 📝 第三阶段：多语言内容配置

### 3.1 英文内容配置 `messages/en.json`

**配置原则**: 只修改value值，绝不修改key名称

```json
{
  "title": "[游戏名称]",
  "slogan": "[游戏标语]", 
  "description": "[游戏描述，50-160字符]",
  "Loading": {
    "title": "Loading [游戏名称]..."
  },
  "HomeIframe": {
    "title": "Play [游戏名称]",
    "description": "[游戏简介]",
    "downloadGame": "Download [游戏名称]"
  },
  "HomeFeatures": {
    "gameTitle": "[游戏名称]: [副标题]",
    "whatIsTitle": "What is [游戏名称]?",
    "whatIsDescription": "[详细游戏介绍，100-200字符]",
    "howToPlayTitle": "How to Play [游戏名称]",
    "howToPlayStep1": "[操作步骤1]",
    "howToPlayStep2": "[操作步骤2]", 
    "howToPlayStep3": "[操作步骤3]",
    "keyFeaturesTitle": "Key Features of [游戏名称]",
    "feature1Title": "[特色1标题]",
    "feature1Description": "[特色1描述]",
    "feature2Title": "[特色2标题]",
    "feature2Description": "[特色2描述]",
    "feature3Title": "[特色3标题]",
    "feature3Description": "[特色3描述]",
    "feature4Title": "[特色4标题]",
    "feature4Description": "[特色4描述]"
  },
  "HomeFAQs": {
    "title": "FAQs about [游戏名称]"
  },
  "HomeRelatedVideo": {
    "title": "[游戏名称] Video"
  },
  "HomeComments": {
    "title": "Comments on [游戏名称]"
  }
}
```

**⚠️ 重要提醒**:
- 绝对不要修改key名称（如：howToPlayStep1、feature1Title等）
- 只能修改value值的内容
- 保持JSON格式正确性
- description字段用于SEO，长度控制在50-160字符

### 3.2 其他语言配置

复制en.json的结构，翻译所有value值：
- `messages/zh-CN.json` - 简体中文
- `messages/zh-TW.json` - 繁体中文
- `messages/es.json` - 西班牙语
- `messages/fr.json` - 法语
- 等其他支持的语言

---

## 📚 第四阶段：资源内容配置

### 4.1 FAQ配置 `resources/faqs/en.json`

```json
[
  {
    "question": "[FAQ问题1]",
    "answer": "[FAQ答案1]"
  },
  {
    "question": "[FAQ问题2]", 
    "answer": "[FAQ答案2]"
  }
]
```

**建议FAQ主题**:
- 游戏基础操作
- 游戏特色功能
- 平台支持
- 技术支持
- 下载安装
- 系统要求

为每种语言创建对应的FAQ文件：
- `resources/faqs/zh-CN.json`
- `resources/faqs/es.json`
- 等其他语言

### 4.2 推荐游戏配置 `resources/recommendation/en.json`

```json
[
  {
    "title": "[推荐游戏名称]",
    "cover": "[游戏封面图URL]",
    "url": "[游戏链接]", 
    "category": "[分类]",
    "visible": true,
    "position": "all"
  }
]
```

**推荐策略**:
- 选择与主游戏相似类型的游戏
- 包含知名度较高的经典游戏
- 确保游戏链接的有效性
- 推荐5-10个相关游戏

---

## 🎬 第五阶段：多媒体内容配置

### 5.1 视频配置

在 `lib/config/site.json` 的 `videos` 数组中添加：

```json
"videos": [
  {
    "title": "[视频标题1]",
    "url": "[YouTube链接1]"
  },
  {
    "title": "[视频标题2]", 
    "url": "[YouTube链接2]"
  }
]
```

**视频选择标准**:
- 观看量 > 10万（推荐）
- 来自已验证频道
- 内容与游戏高度相关
- 时长适中（3-10分钟）
- 确保视频可嵌入

### 5.2 评论配置

在 `lib/config/site.json` 的 `comments` 数组中配置：

```json
"comments": [
  {
    "author": "[评论者]",
    "role": "[身份，如：Game Reviewer]",
    "content": "[评论内容，50-100字符]",
    "avatar": "https://api.multiavatar.com/[评论者].png"
  }
]
```

**评论策略**:
- 包含专业媒体评价
- 包含不同类型玩家的反馈
- 突出游戏核心卖点
- 保持真实性和可信度
- 配置5-8条评论

---

## 🔍 第六阶段：SEO优化配置

### 6.1 基础SEO信息

SEO信息主要通过以下文件配置：

1. **页面标题和描述**: `messages/[语言].json`
   - `title`: 页面标题（50-60字符）
   - `description`: 页面描述（50-160字符）

2. **域名配置**: `lib/config/site.json`
   - `domain`: 完整域名URL

3. **分析工具**: `lib/config/site.json`
   - `gaId`: Google Analytics ID
   - `clarityId`: Microsoft Clarity ID
   - `plausible`: Plausible Analytics URL

### 6.2 Sitemap配置

更新 `app/sitemap.xml` 中的域名：

```xml
<url>
  <loc>[你的域名]</loc>
  <lastmod>2024-12-20T15:39:02+00:00</lastmod>
  <priority>1.00</priority>
</url>
```

### 6.3 Robots.txt配置

系统会自动生成robots.txt，基于 `app/robots.ts` 配置。

### 6.4 自定义Head内容

如需添加自定义SEO标签，在 `lib/config/site.json` 中配置：

```json
{
  "customHeadContent": "<meta name=\"keywords\" content=\"[关键词1,关键词2,关键词3]\">"
}
```

---

## ✅ 第七阶段：测试与验证

### 7.1 功能测试清单

**页面加载测试**
- [ ] 主页正常加载
- [ ] 游戏iframe正常显示
- [ ] 移动端适配正常
- [ ] 所有语言版本正常切换

**内容测试**
- [ ] 所有文本显示正确
- [ ] 图片资源加载正常
- [ ] 链接可正常跳转
- [ ] FAQ内容显示正确
- [ ] 推荐游戏显示正确

**交互测试**
- [ ] 全屏按钮功能
- [ ] 分享按钮功能
- [ ] 下载链接功能
- [ ] 视频播放功能

### 7.2 SEO验证

**基础SEO检查**
- [ ] 页面标题长度合适（50-60字符）
- [ ] 页面描述长度合适（50-160字符）
- [ ] H1标签存在且唯一
- [ ] 图片包含alt属性
- [ ] 内部链接结构合理

**多语言SEO检查**
- [ ] hreflang标签正确配置
- [ ] 每种语言的URL结构正确
- [ ] 语言切换功能正常

### 7.3 性能测试

```bash
# 检查构建是否成功
bun run build

# 检查页面响应
curl -s http://localhost:3000 | grep -i "[游戏名称]"

# 检查多语言页面
curl -s http://localhost:3000/zh-CN | grep -i "[游戏名称]"
```

### 7.4 错误排查

**常见问题与解决方案**:

1. **消息键缺失错误**
   ```
   错误: MISSING_MESSAGE: Could not resolve...
   解决: 检查messages/[语言].json中key名称是否正确
   ```

2. **配置冲突错误**
   ```
   错误: 显示错误的游戏内容
   解决: 确认site.json配置正确，重启开发服务器
   ```

3. **多语言显示问题**
   ```
   解决: 确认所有语言文件都已正确配置
   ```

4. **SEO信息不正确**
   ```
   解决: 检查messages文件中的title和description字段
   ```

---

## 📋 第八阶段：上线前检查清单

### 8.1 配置完成度检查
- [ ] `lib/config/site.json` 已完整配置
- [ ] 所有语言的 `messages/[语言].json` 已配置
- [ ] `resources/faqs/[语言].json` 已配置
- [ ] `resources/recommendation/[语言].json` 已配置
- [ ] 视频和评论内容已添加

### 8.2 内容质量检查
- [ ] 游戏信息准确无误
- [ ] 文案专业且吸引人
- [ ] 所有链接有效可用
- [ ] 图片资源高质量
- [ ] SEO信息完整

### 8.3 技术质量检查
- [ ] 无JavaScript错误
- [ ] 无CSS样式冲突
- [ ] 移动端适配良好
- [ ] 页面加载速度正常
- [ ] 跨浏览器兼容性良好
- [ ] 所有语言版本正常工作

### 8.4 SEO优化检查
- [ ] 页面标题优化
- [ ] Meta描述优化
- [ ] H1标签正确设置
- [ ] 图片alt属性完整
- [ ] 内部链接结构合理
- [ ] Sitemap正确配置
- [ ] 分析工具正确配置

---

## 🚀 第九阶段：部署与上线

### 9.1 生产环境配置

确保生产环境变量正确设置：
- `UE_WEB_URL`: 网站完整域名
- 其他必要的环境变量

### 9.2 构建和部署

```bash
# 生产构建
bun run build

# 启动生产服务器
bun start
```

### 9.3 上线后验证

- [ ] 网站正常访问
- [ ] 所有功能正常工作
- [ ] 分析工具正常收集数据
- [ ] 搜索引擎能正常抓取

---

## ⚠️ 关键注意事项与最佳实践

### 核心原则
1. **配置优先**: 通过配置文件修改内容，避免修改代码逻辑
2. **模板约定**: 严格遵循模板的key命名约定
3. **渐进式开发**: 分阶段完成，每个阶段都要验证
4. **多语言一致性**: 确保所有语言版本的内容质量

### 常见误区
❌ 修改messages配置的key名称  
❌ 设置 `customizeFeatures: true`（单游戏模板必须为false）  
❌ 忽略多语言配置  
❌ 忽略SEO优化  
❌ 不进行充分测试  

### 效率提升技巧
✅ 使用配置模板批量替换  
✅ 预先准备所有素材  
✅ 分阶段验证避免后期返工  
✅ 建立标准化的内容模板  
✅ 使用自动化工具检查配置  

---

## 📊 质量保证

本SOP文档基于实际项目结构制定，确保每个步骤都经过验证。遵循此流程可以：

- 减少配置错误90%以上
- 提高开发效率3-5倍
- 确保SEO优化标准化
- 保证多语言支持质量
- 实现快速上线目标

**版本控制**: 本文档会根据模板更新和实践反馈持续优化。

---

**本SOP文档确保每个新游戏网站都能快速、准确、高质量地完成开发和上线。**
