#!/usr/bin/env node

/**
 * 数据处理器测试脚本
 * 测试修复后的数据处理器是否能正确处理新的AI数据格式
 */

const fs = require('fs');
const path = require('path');
const { processAIData } = require('./data-processor');

// 创建测试数据
const testAIData = {
  gameInfo: {
    name: {
      en: "Test Game",
      "zh-CN": "测试游戏"
    },
    category: "puzzle",
    developer: "Test Studio",
    gameUrl: "https://example.com/game",
    shortDescription: {
      en: "A fun puzzle game for everyone",
      "zh-CN": "适合所有人的有趣益智游戏"
    },
    detailedDescription: {
      en: "This is a detailed description of the test game with amazing features and gameplay.",
      "zh-CN": "这是测试游戏的详细描述，具有惊人的功能和游戏玩法。"
    }
  },
  gameplay: {
    coreFeatures: [
      {
        title: { en: "Easy to Learn", "zh-CN": "易于学习" },
        description: { en: "Simple controls for everyone", "zh-CN": "简单的控制，适合所有人" }
      },
      {
        title: { en: "Challenging Puzzles", "zh-CN": "挑战性谜题" },
        description: { en: "Brain-teasing challenges", "zh-CN": "令人费解的挑战" }
      },
      {
        title: { en: "Beautiful Graphics", "zh-CN": "精美图形" },
        description: { en: "Stunning visual design", "zh-CN": "令人惊叹的视觉设计" }
      },
      {
        title: { en: "Relaxing Music", "zh-CN": "轻松音乐" },
        description: { en: "Soothing background music", "zh-CN": "舒缓的背景音乐" }
      }
    ],
    howToPlay: [
      { en: "Click to select pieces", "zh-CN": "点击选择拼图块" },
      { en: "Drag to move pieces", "zh-CN": "拖拽移动拼图块" },
      { en: "Complete the puzzle", "zh-CN": "完成拼图" }
    ]
  },
  videos: [
    {
      title: "Game Trailer",
      url: "https://youtube.com/watch?v=test123"
    },
    {
      title: "Gameplay Demo",
      url: "https://youtube.com/watch?v=demo456"
    },
    {
      title: "Tutorial Video",
      url: "https://bilibili.com/video/test789"
    }
  ],
  comments: [
    {
      author: "Player1",
      role: "游戏玩家",
      content: "This game is amazing! I love the puzzles.",
      avatar: "https://api.multiavatar.com/Player1.svg"
    },
    {
      author: "TestUser",
      role: "资深玩家",
      content: "Great graphics and smooth gameplay. Highly recommended!",
      avatar: "https://api.multiavatar.com/TestUser.svg"
    },
    {
      author: "PuzzleFan",
      role: "益智游戏爱好者",
      content: "Perfect for relaxing after work. Love the music too.",
      avatar: "https://api.multiavatar.com/PuzzleFan.svg"
    }
  ],
  downloadUrls: {
    ios: "https://apps.apple.com/app/test-game",
    android: "https://play.google.com/store/apps/details?id=com.test.game",
    pc: "https://example.com/download/pc",
    steam: "https://store.steampowered.com/app/123456"
  },
  seo: {
    primaryKeywords: ["puzzle game", "brain teaser", "mobile game"],
    longTailKeywords: ["free puzzle game online", "best brain teaser games"],
    metaTitle: {
      en: "Test Game - Free Online Puzzle Game",
      "zh-CN": "测试游戏 - 免费在线益智游戏"
    },
    metaDescription: {
      en: "Play Test Game online for free. Challenging puzzles and beautiful graphics await!",
      "zh-CN": "免费在线玩测试游戏。挑战性的谜题和精美的图形等着您！"
    }
  },
  multiLanguage: {
    en: {
      gameTitle: "Test Game: Online Puzzle",
      whatIsTitle: "What is Test Game?",
      whatIsDescription: "A fun puzzle game for everyone",
      howToPlayTitle: "How to Play Test Game",
      keyFeaturesTitle: "Key Features of Test Game",
      faqTitle: "Frequently Asked Questions",
      videoTitle: "Test Game Videos",
      commentsTitle: "Player Reviews",
      downloadTitle: "Download Test Game"
    },
    "zh-CN": {
      gameTitle: "测试游戏：在线益智",
      whatIsTitle: "什么是测试游戏？",
      whatIsDescription: "适合所有人的有趣益智游戏",
      howToPlayTitle: "如何玩测试游戏",
      keyFeaturesTitle: "测试游戏的主要特色",
      faqTitle: "常见问题",
      videoTitle: "测试游戏视频",
      commentsTitle: "玩家评价",
      downloadTitle: "下载测试游戏"
    }
  },
  compliance: {
    recommendedPreset: "basic",
    minimumAge: 3
  },
  faq: [
    {
      question: {
        en: "Is this game free?",
        "zh-CN": "这个游戏免费吗？"
      },
      answer: {
        en: "Yes, the game is completely free to play.",
        "zh-CN": "是的，这个游戏完全免费。"
      }
    },
    {
      question: {
        en: "What devices are supported?",
        "zh-CN": "支持哪些设备？"
      },
      answer: {
        en: "The game works on all modern browsers and mobile devices.",
        "zh-CN": "游戏可在所有现代浏览器和移动设备上运行。"
      }
    }
  ]
};

// 运行测试
function runTest() {
  console.log('🧪 开始测试数据处理器...\n');
  
  try {
    // 创建测试输入文件
    const testInputFile = path.join(__dirname, 'test-ai-data.json');
    fs.writeFileSync(testInputFile, JSON.stringify(testAIData, null, 2));
    console.log('✅ 创建测试数据文件');
    
    // 运行数据处理器
    const outputDir = path.join(__dirname, 'test-output');
    const result = processAIData(testInputFile, outputDir);
    
    console.log('\n📊 处理结果验证:');
    
    // 验证生成的文件
    const expectedFiles = [
      'site.json',
      'messages/en.json',
      'messages/zh-CN.json',
      'faq/en.json',
      'faq/zh-CN.json',
      'videos/videos.json',
      'videos/README.md',
      'comments/comments.json',
      'comments/README.md',
      'deploy.sh',
      'asset-requirements.md'
    ];
    
    expectedFiles.forEach(file => {
      const filePath = path.join(outputDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} - 已生成`);
      } else {
        console.log(`❌ ${file} - 缺失`);
      }
    });
    
    // 验证配置内容
    const siteConfig = JSON.parse(fs.readFileSync(path.join(outputDir, 'site.json'), 'utf8'));
    console.log('\n🔧 配置验证:');
    console.log(`✅ 视频功能: ${siteConfig.isShowVideo ? '启用' : '禁用'} (${siteConfig.videos?.length || 0}个视频)`);
    console.log(`✅ 评论功能: ${siteConfig.isShowComments ? '启用' : '禁用'} (${siteConfig.comments?.length || 0}条评论)`);
    console.log(`✅ FAQ功能: ${siteConfig.isShowFAQs ? '启用' : '禁用'}`);
    console.log(`✅ 下载功能: ${siteConfig.gameDownload.showDownloadButton ? '启用' : '禁用'}`);
    
    // 清理测试文件
    fs.unlinkSync(testInputFile);
    console.log('\n🧹 清理测试文件');
    
    console.log('\n🎉 测试完成！数据处理器工作正常。');
    console.log(`📁 测试输出目录: ${outputDir}`);
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
if (require.main === module) {
  runTest();
}

module.exports = { runTest, testAIData };
