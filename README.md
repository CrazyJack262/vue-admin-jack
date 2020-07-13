## 简介

> 这是一个极简的 vue admin 管理后台。它只包含了 Element UI & axios & iconfont & permission control & lint。

目前版本为 `v4.0+` 基于 `vue-cli` 进行构建,可以搭配后台管理项目[jack-admin](https://github.com/CrazyJack262/jack-admin)使用，建立一个后台管理系统简单脚手架。

- [在线预览](http://219.135.182.98:18087/view/)

## Build Setup

```bash
# 克隆项目
https://github.com/CrazyJack262/vue-admin-jack.git

# 进入项目目录
cd vue-admin-jack

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## License

MIT

Copyright (c) 2020-present CrazyJack262
