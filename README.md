# 命理学数字实验室 · Mingli Lab

> 学术级命理学研究工具——八字排盘、铁板神数、条文检索、历史命例对比

## 项目简介

命理学数字实验室（Mingli Lab）是一个纯静态前端项目，以现代数字算法还原传统命理学推演体系，服务于学术研究目的。

## 功能模块

| 模块 | 说明 |
|------|------|
| 八字排盘 | 输入公历生日，自动推算四柱八字、十神、纳音、藏干、大运 |
| 铁板神数 | 基于邵雍先天数理体系，推算命运条文索引与命卦 |
| 条文检索 | 全文搜索铁板神数条文数据库，支持分类筛选 |
| 历史命例 | 名人八字案例库，支持对比分析（Ctrl+点击选中） |

## 技术栈

- 纯 HTML5 + CSS3 + Vanilla JavaScript
- 无框架依赖，零构建步骤
- 可直接部署到 GitHub Pages / Vercel / Netlify

## 本地运行

直接用浏览器打开 `index.html` 即可（部分功能需要本地服务器读取 JSON）：

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

访问 `http://localhost:8080`

## GitHub Pages 部署

1. 将项目推送到 GitHub 仓库
2. 进入仓库 **Settings → Pages**
3. Source 选择 `main` 分支，根目录 `/`
4. 保存，等待约1分钟即可访问

```bash
git init
git add .
git commit -m "feat: 初始化命理学数字实验室"
git remote add origin https://github.com/你的用户名/mingli-lab.git
git push -u origin main
```

## 项目结构

```
mingli-lab/
├── index.html        # 主页
├── bazi.html         # 八字排盘
├── tiepan.html       # 铁板神数
├── search.html       # 条文检索
├── cases.html        # 历史命例
├── css/
│   └── style.css     # 全局样式（Apple 深黑金设计）
├── js/
│   ├── main.js       # 公共工具函数
│   ├── bazi.js       # 八字算法
│   └── tiepan.js     # 铁板神数算法
├── data/
│   ├── tiepan.json   # 铁板神数条文数据库
│   └── cases.json    # 历史命例数据
└── .nojekyll         # 禁用 GitHub Pages Jekyll 处理
```

## 学术声明

- 本工具为纯学术研究用途，非商业算命服务
- 八字算法基于传统子平术，节气采用近似值，精确推算请参考专业历法
- 铁板神数推算为简化学术版，完整条文请参阅邵雍著、陈明点校《铁板神数》原典
- 历史人物八字部分为文献推算值，如有出入以原始史料为准

## 参考典籍

- 《铁板神数》— 宋·邵雍著，陈明点校
- 《渊海子平》— 宋·徐子平
- 《三命通会》— 明·万民英
- 《千里命稿》— 韦千里
- 《皇极经世书》— 宋·邵雍

---

设计语言：Apple Design System · 深黑金配色
