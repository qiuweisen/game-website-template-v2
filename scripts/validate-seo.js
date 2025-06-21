#!/usr/bin/env node

/**
 * SEO配置验证脚本
 * 验证网站配置与结构化数据的一致性
 */

const fs = require('fs');
const path = require('path');

// 读取配置文件
function loadConfig() {
  try {
    const configPath = path.join(process.cwd(), 'lib/config/site.json');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error('❌ 无法读取配置文件:', error.message);
    process.exit(1);
  }
}

// 验证配置
function validateConfig(config) {
  const warnings = [];
  const errors = [];
  const suggestions = [];

  // 基础配置验证
  if (!config.name || config.name.trim() === '') {
    errors.push('网站名称不能为空');
  }

  if (!config.domain || config.domain.trim() === '') {
    errors.push('域名不能为空');
  }

  // 游戏配置验证
  if (config.gameType === 'iframe' && (!config.gameIframeUrl || config.gameIframeUrl.trim() === '')) {
    warnings.push('游戏iframe URL为空，游戏结构化数据将不会生成');
  }

  // 功能开关验证
  if (config.isShowFAQs) {
    suggestions.push('FAQ功能已启用，确保FAQ数据文件存在');
  }

  if (config.isShowRecommendation) {
    suggestions.push('推荐功能已启用，相关组件将会渲染');
  } else {
    suggestions.push('推荐功能已禁用，推荐组件将不会渲染');
  }

  if (config.isShowVideo) {
    if (!config.videos || config.videos.length === 0 || !config.videos[0].url) {
      warnings.push('视频功能已启用但没有有效的视频数据');
    }
  }

  if (config.isShowComments) {
    if (!config.comments || config.comments.length === 0 || !config.comments[0].content) {
      warnings.push('评论功能已启用但没有有效的评论数据');
    }
  }

  return { warnings, errors, suggestions };
}

// 生成报告
function generateReport(config, validation) {
  console.log('\n🔍 SEO配置验证报告');
  console.log('='.repeat(50));

  // 基础信息
  console.log('\n📋 基础配置:');
  console.log(`   网站名称: ${config.name || '❌ 未设置'}`);
  console.log(`   域名: ${config.domain || '❌ 未设置'}`);
  console.log(`   游戏类型: ${config.gameType || '❌ 未设置'}`);
  console.log(`   模板类型: ${config.templateType || '❌ 未设置'}`);

  // 功能开关状态
  console.log('\n🎛️  功能开关状态:');
  console.log(`   FAQ功能: ${config.isShowFAQs ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   推荐功能: ${config.isShowRecommendation ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   视频功能: ${config.isShowVideo ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   评论功能: ${config.isShowComments ? '✅ 启用' : '❌ 禁用'}`);
  console.log(`   合规功能: ${config.compliance?.enabled ? '✅ 启用' : '❌ 禁用'}`);

  // 结构化数据预测
  console.log('\n📊 结构化数据生成预测:');
  console.log(`   网站基础数据: ✅ 将生成`);
  console.log(`   面包屑导航: ✅ 将生成`);
  console.log(`   游戏数据: ${config.gameIframeUrl ? '✅ 将生成' : '❌ 不会生成 (缺少游戏URL)'}`);
  console.log(`   FAQ数据: ${config.isShowFAQs ? '✅ 将生成 (如果有FAQ文件)' : '❌ 不会生成 (功能已禁用)'}`);

  // 错误
  if (validation.errors.length > 0) {
    console.log('\n❌ 错误:');
    validation.errors.forEach(error => console.log(`   - ${error}`));
  }

  // 警告
  if (validation.warnings.length > 0) {
    console.log('\n⚠️  警告:');
    validation.warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  // 建议
  if (validation.suggestions.length > 0) {
    console.log('\n💡 建议:');
    validation.suggestions.forEach(suggestion => console.log(`   - ${suggestion}`));
  }

  // 总结
  console.log('\n📈 SEO质量评估:');
  if (validation.errors.length === 0) {
    if (validation.warnings.length === 0) {
      console.log('   🎯 优秀 - 配置完整，SEO优化良好');
    } else {
      console.log('   🟡 良好 - 基础配置正确，有一些优化空间');
    }
  } else {
    console.log('   🔴 需要修复 - 存在配置错误，需要立即处理');
  }

  console.log('\n' + '='.repeat(50));
  console.log('验证完成！\n');
}

// 主函数
function main() {
  console.log('🚀 开始验证SEO配置...');
  
  const config = loadConfig();
  const validation = validateConfig(config);
  
  generateReport(config, validation);
  
  // 如果有错误，退出码为1
  if (validation.errors.length > 0) {
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { loadConfig, validateConfig, generateReport };
