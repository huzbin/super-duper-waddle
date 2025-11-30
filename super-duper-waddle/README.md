# Komari Theme Hero

一个基于 Hero UI 设计系统的现代化 Komari 服务器监控主题。

## 特性

- 🎨 现代化 UI 设计，支持亮色/暗色主题
- 📊 实时 WebSocket 数据更新
- 📈 交互式历史数据图表
- 🌍 多语言支持（英文、中文、日文）
- 🏷️ 智能排序和筛选功能
- 🚀 性能优化，代码分割
- ⚙️ 主题配置集成

## 安装使用

1. 下载最新版本的主题包
2. 在 Komari 管理面板中上传主题包
3. 启用 Hero 主题

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 打包
zip -r komari-theme-hero.zip komari-theme.json dist/ preview.png
```

## 技术栈

- React 18 + TypeScript
- Hero UI + Tailwind CSS
- Lucide React + flag-icons
- Recharts + i18next

## License

WTFPL