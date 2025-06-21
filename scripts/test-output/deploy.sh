#!/bin/bash
# 自动生成的部署脚本 - Test Game

GAME_NAME="test-game"
DOMAIN_NAME="${GAME_NAME}.yourdomain.com"

echo "🚀 开始部署游戏网站: Test Game"

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
mkdir -p public/games/${GAME_NAME}

# 4. 下载游戏素材 (需要手动添加素材URL)
echo "🖼️ 请手动下载以下素材到 public/games/${GAME_NAME}/ 目录:"
echo "  - game_screenshot.webp (游戏截图)"
echo "  - how-to-play.webp (操作演示图)"
echo "  - icon.png (游戏图标)"

# 5. 构建网站
echo "🔨 构建网站..."
npm run build

# 6. 部署 (根据实际部署方式调整)
echo "🌐 准备部署..."
echo "网站将部署到: https://${DOMAIN_NAME}"

echo "✅ 部署脚本准备完成！"
echo "📋 请检查素材需求清单: output/asset-requirements.md"
