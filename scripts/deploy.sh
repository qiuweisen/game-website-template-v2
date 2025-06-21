#!/bin/bash

# 游戏网站自动化部署脚本
# 使用方法: ./deploy.sh <game-name> <ai-data-file>

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${2}${1}${NC}"
}

print_success() {
    print_message "✅ $1" $GREEN
}

print_info() {
    print_message "ℹ️  $1" $BLUE
}

print_warning() {
    print_message "⚠️  $1" $YELLOW
}

print_error() {
    print_message "❌ $1" $RED
}

# 检查参数
if [ $# -lt 2 ]; then
    print_error "参数不足"
    echo "使用方法: $0 <game-name> <ai-data-file> [domain]"
    echo "示例: $0 sprunki-retake ai-data.json sprunki-retake.com"
    exit 1
fi

GAME_NAME=$1
AI_DATA_FILE=$2
DOMAIN=${3:-"${GAME_NAME}.yourdomain.com"}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/${TIMESTAMP}"

print_info "开始部署游戏网站: $GAME_NAME"
print_info "数据文件: $AI_DATA_FILE"
print_info "目标域名: $DOMAIN"

# 检查必要文件
if [ ! -f "$AI_DATA_FILE" ]; then
    print_error "AI数据文件不存在: $AI_DATA_FILE"
    exit 1
fi

if [ ! -f "scripts/data-processor.js" ]; then
    print_error "数据处理器不存在: scripts/data-processor.js"
    exit 1
fi

# 创建备份
print_info "创建配置备份..."
mkdir -p "$BACKUP_DIR"
if [ -f "lib/config/site.json" ]; then
    cp "lib/config/site.json" "$BACKUP_DIR/"
fi
if [ -d "messages" ]; then
    cp -r "messages" "$BACKUP_DIR/"
fi
print_success "备份已创建: $BACKUP_DIR"

# 处理AI数据
print_info "处理AI收集的数据..."
OUTPUT_DIR="./temp_output_${TIMESTAMP}"
node scripts/data-processor.js "$AI_DATA_FILE" "$OUTPUT_DIR"

if [ $? -ne 0 ]; then
    print_error "数据处理失败"
    exit 1
fi
print_success "数据处理完成"

# 应用网站配置
print_info "应用网站配置..."
if [ -f "$OUTPUT_DIR/site.json" ]; then
    cp "$OUTPUT_DIR/site.json" "lib/config/site.json"
    print_success "网站配置已更新"
else
    print_error "网站配置文件不存在"
    exit 1
fi

# 应用多语言文件
print_info "应用多语言内容..."
if [ -d "$OUTPUT_DIR/messages" ]; then
    # 备份现有语言文件
    if [ -d "messages" ]; then
        cp -r "messages" "$BACKUP_DIR/messages_backup"
    fi
    
    # 复制新的语言文件
    mkdir -p "messages"
    cp -r "$OUTPUT_DIR/messages/"* "messages/"
    print_success "多语言文件已更新"
else
    print_warning "多语言文件目录不存在，跳过"
fi

# 创建游戏素材目录
print_info "创建游戏素材目录..."
GAME_ASSETS_DIR="public/games/$GAME_NAME"
mkdir -p "$GAME_ASSETS_DIR"
print_success "素材目录已创建: $GAME_ASSETS_DIR"

# 检查素材文件
print_info "检查游戏素材..."
REQUIRED_ASSETS=("game_screenshot.webp" "icon.png")
OPTIONAL_ASSETS=("how-to-play.webp")
MISSING_ASSETS=()

for asset in "${REQUIRED_ASSETS[@]}"; do
    if [ ! -f "$GAME_ASSETS_DIR/$asset" ]; then
        MISSING_ASSETS+=("$asset")
    fi
done

if [ ${#MISSING_ASSETS[@]} -gt 0 ]; then
    print_warning "缺少必需素材文件:"
    for asset in "${MISSING_ASSETS[@]}"; do
        echo "  - $GAME_ASSETS_DIR/$asset"
    done
    print_info "请参考素材需求清单: $OUTPUT_DIR/asset-requirements.md"
fi

for asset in "${OPTIONAL_ASSETS[@]}"; do
    if [ ! -f "$GAME_ASSETS_DIR/$asset" ]; then
        print_info "可选素材文件不存在: $asset (将使用游戏截图作为后备)"
    fi
done

# 验证配置文件
print_info "验证配置文件..."
if command -v jq &> /dev/null; then
    if jq empty lib/config/site.json 2>/dev/null; then
        print_success "配置文件格式正确"
    else
        print_error "配置文件JSON格式错误"
        exit 1
    fi
else
    print_warning "未安装jq，跳过JSON格式验证"
fi

# 安装依赖
print_info "检查并安装依赖..."
if [ -f "package.json" ]; then
    if command -v npm &> /dev/null; then
        npm install
        print_success "依赖安装完成"
    else
        print_error "npm未安装，无法安装依赖"
        exit 1
    fi
else
    print_warning "package.json不存在，跳过依赖安装"
fi

# 构建网站
print_info "构建网站..."
if command -v npm &> /dev/null; then
    npm run build
    if [ $? -eq 0 ]; then
        print_success "网站构建完成"
    else
        print_error "网站构建失败"
        exit 1
    fi
else
    print_error "npm未安装，无法构建网站"
    exit 1
fi

# 运行测试（如果存在）
if [ -f "package.json" ] && npm run | grep -q "test"; then
    print_info "运行测试..."
    npm test
    if [ $? -eq 0 ]; then
        print_success "测试通过"
    else
        print_warning "测试失败，但继续部署"
    fi
fi

# 生成部署报告
print_info "生成部署报告..."
REPORT_FILE="deployment-report-${TIMESTAMP}.md"
cat > "$REPORT_FILE" << EOF
# 游戏网站部署报告

## 基本信息
- **游戏名称**: $GAME_NAME
- **部署时间**: $(date)
- **域名**: $DOMAIN
- **数据文件**: $AI_DATA_FILE

## 部署状态
- ✅ 数据处理完成
- ✅ 配置文件已更新
- ✅ 多语言文件已应用
- ✅ 网站构建成功

## 素材状态
EOF

for asset in "${REQUIRED_ASSETS[@]}"; do
    if [ -f "$GAME_ASSETS_DIR/$asset" ]; then
        echo "- ✅ $asset" >> "$REPORT_FILE"
    else
        echo "- ❌ $asset (缺失)" >> "$REPORT_FILE"
    fi
done

for asset in "${OPTIONAL_ASSETS[@]}"; do
    if [ -f "$GAME_ASSETS_DIR/$asset" ]; then
        echo "- ✅ $asset" >> "$REPORT_FILE"
    else
        echo "- ⚠️ $asset (可选，缺失)" >> "$REPORT_FILE"
    fi
done

cat >> "$REPORT_FILE" << EOF

## 文件位置
- **配置文件**: lib/config/site.json
- **多语言文件**: messages/
- **游戏素材**: $GAME_ASSETS_DIR/
- **备份目录**: $BACKUP_DIR

## 下一步操作
1. 检查并上传缺失的素材文件
2. 配置域名DNS解析
3. 部署到生产服务器
4. 配置SSL证书
5. 设置CDN加速

## 相关文件
- 素材需求清单: $OUTPUT_DIR/asset-requirements.md
- 部署脚本: $OUTPUT_DIR/deploy.sh
EOF

print_success "部署报告已生成: $REPORT_FILE"

# 清理临时文件
print_info "清理临时文件..."
rm -rf "$OUTPUT_DIR"
print_success "临时文件已清理"

# 完成部署
print_success "🎉 游戏网站部署完成！"
echo ""
print_info "📋 部署摘要:"
echo "  - 游戏名称: $GAME_NAME"
echo "  - 目标域名: $DOMAIN"
echo "  - 备份位置: $BACKUP_DIR"
echo "  - 部署报告: $REPORT_FILE"
echo ""
print_info "🔗 本地预览:"
echo "  npm run dev"
echo ""
print_info "📚 相关文档:"
echo "  - 部署报告: $REPORT_FILE"
echo "  - 模板文档: docs/template-customization-guide.md"
echo ""

if [ ${#MISSING_ASSETS[@]} -gt 0 ]; then
    print_warning "⚠️ 请注意: 还有 ${#MISSING_ASSETS[@]} 个必需素材文件缺失"
    print_info "请上传素材文件后重新构建网站"
fi

print_success "部署脚本执行完成！"
