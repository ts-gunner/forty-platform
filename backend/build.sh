#!/dist/bash

# Go语言多平台打包脚本
# 使用方法: ./build.sh [应用名称] [输出目录]
# 示例: ./build.sh myapp ./dist
# 示例: ./build.sh myapp ./dist

# 默认应用名称
APP_NAME="myapp"

# 打包的函数
GO_MAIN_PATH="."

# 默认输出目录
OUTPUT_DIR="./dist"

# 如果提供了参数，则使用参数
if [ $# -ge 1 ]; then
    APP_NAME="$1"
fi

if [ $# -ge 2 ]; then
    GO_MAIN_PATH="$2"
fi

if [ $# -ge 3 ]; then
    OUTPUT_DIR="$3"
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 清理旧的构建文件
echo "清理旧的构建文件..."
rm -f "$OUTPUT_DIR"/"$APP_NAME"*

# 定义要构建的平台
PLATFORMS=(
    "windows/amd64"
  #  "windows/386"
    "linux/amd64"
   # "linux/386"
   # "linux/arm"
   # "linux/arm64"
   # "darwin/amd64"   # macOS Intel
   # "darwin/arm64"   # macOS M1/M2
)

# 构建版本信息（可选）
BUILD_TIME=$(date +%Y%m%d_%H%M%S)
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
LDFLAGS="-X main.buildTime=$BUILD_TIME -X main.gitCommit=$GIT_COMMIT"

export GIN_MODE=release
# 循环构建各个平台
for PLATFORM in "${PLATFORMS[@]}"; do
    # 分割平台和架构
    IFS="/" read -r OS ARCH <<< "$PLATFORM"

    # 构建输出文件名
    if [ "$OS" = "windows" ]; then
        OUTPUT_NAME="$APP_NAME.exe"
    else
        OUTPUT_NAME="$APP_NAME"
    fi
    OUTPUT_PATH="$OUTPUT_DIR/$OUTPUT_NAME"

    echo "正在构建: $PLATFORM -> $OUTPUT_PATH"

    # 设置环境变量并构建
    GOOS="$OS" GOARCH="$ARCH" go build -ldflags "$LDFLAGS" -o "$OUTPUT_PATH" "$GO_MAIN_PATH"

    # 检查构建是否成功
    if [ $? -eq 0 ]; then
        echo "构建成功: $OUTPUT_PATH"
    else
        echo "构建失败: $PLATFORM"
    fi
done

echo "所有构建任务已完成"
