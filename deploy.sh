#!/usr/bin/env bash
# 部署 labor-rights 到 EdgeOne Makers
# 用法: ./deploy.sh   (从任意目录执行均可，会自动切到脚本所在目录)
set -uo pipefail

# 切到脚本所在目录（即站点根目录，EdgeOne 以 cwd 为部署根）
cd "$(dirname "$0")"

export PAGES_SOURCE=skills

echo ">>> 部署 labor-rights 到 EdgeOne Makers ..."

RAW=$(edgeone makers deploy -n labor-rights --json 2>&1) || {
  echo "部署失败，原始输出：" >&2
  printf '%s\n' "$RAW" >&2
  exit 1
}

# 从 --json 最后一行解析完整 URL（含 eo_token 鉴权参数）
URL=$(printf '%s\n' "$RAW" | tail -1 | sed -n 's/.*"url":"\([^"]*\)".*/\1/p')

if [ -z "$URL" ]; then
  echo "未解析到部署地址，原始输出：" >&2
  printf '%s\n' "$RAW" >&2
  exit 1
fi

echo ""
echo "部署完成"
echo "线上地址（带鉴权参数，浏览器打开；curl 会 401 属正常）："
echo "  $URL"
