---
date: 2026-5-14 13:00
title: 如何在neowiki上贡献试题？
category: 指引
author: Shxiao101

---

基于Windows系统，面向新手的neowiki操作指南。

---

<PostDetail>

## 前言

原有的维基真题现已全部迁移到neowiki，提供了更加简洁直观的界面，更快的加载速度，更便捷的文件管理，并且试卷改为用markdown语言编写，易于上手编写，适用性广泛。

尽管neowiki不能像旧版维基真题那样每个用户都能快速修改，但其必须要以pr的形式提交修改一定程度上确保了内容的可靠性，版本维护也更加轻松。

以下是面向新手的neowiki环境搭建及操作教程，如果您在使用过程中有任何疑惑，欢迎加QQ群交流：829649976。

## 准备工作

### 前置条件

一个github账号，电脑已安装git。此部分请自行搜索解决，本教程不提供指导。

### 安装Node.js和pnpm

(如果你已安装请跳过该步骤)

请前往官网下载: https://nodejs.org/zh-cn/download

我们不要求docker安装，此处演示通过windows安装程序(.msi)安装。

运行文件，一路勾选，"Automatically install the necessary tools. Note that this will also install Chocolatey. The script will pop-up in a new window after the installation completes."选项**不需要**勾选。

![Install](./install.png)

安装完成后打开终端，键入命令：
``` bash
node -v
npm -v
```
输出版本号说明成功安装。

接下来安装pnpm，继续输入：
``` bash
npm install -g pnpm
```

### fork并克隆仓库到本地

前往 https://github.com/byrdocs/byrdocs-neowiki ，点击右上角的fork按键，页面跳转后点击create fork。

接下来在你fork的仓库页面点击绿色的<>Code按键，复制出现的URL。

![clone](./clone.png)

打开任意终端，在你要安装的位置键入命令：
``` bash
git clone <你刚才复制的URL>
```

### 安装必要依赖
等待克隆完成后进入byrdocs-neowiki目录，安装依赖
``` bash
cd byrdocs-neowiki
pnpm i
```
启动预览服务器：
``` bash
pnpm dev
```
接下来你可以在
```
http://localhost:4321
```
 进入neowiki的首页，其中有neowiki的编辑指南的跳转链接，务必仔细阅读。

## 编辑试卷

### 在vscode编辑试卷
我们提供了vscode扩展方便编辑者预览页面，在vscode扩展商店安装BYR Docs Wiki Tools。该扩展只有在你当前已打开进入byrdocs-neowiki文件夹时才会启用。

打开byrdocs-neowiki文件夹，对于编辑者只需要关注/exams目录。下面以新建一份2025-2026学年第二学期大学物理D期中试卷为例。

#### 方法一

在/exams里新建试卷文件夹，参考命名格式为<25-26-大学物理D-期中>。进入试卷文件夹，新建试卷文件index.mdx。如有题图、音频等附件一并存放在同一目录内。

![exams](./exams.png)

按照试卷信息输入前言如下，其中来源为[byrdocs主站](byrdocs.org)已有试卷的md5，可在网站的试卷搜索结果的右下角复制得到。

![perface](./perface.png)

![md5](./md5.png)

在下方编辑正文内容。

#### 方法二

使用扩展新建试卷:点击侧边栏byrdocs-wiki-tool扩展图标，点击最上方**新建页面**按扭，填写相关试卷信息如下:

![newpage](./newpage.png)

#### 预览试卷

点击侧边栏扩展图标，搜索试卷点击即可打开并预览。

![search](./search.png)

或者打开某份index.mdx试卷文件，按**Ctrl/Cmd + K 再按 V**即可打开预览。

如果你使用其他编辑器，可以在终端输入**pnpm dev**启动了预览服务器后通过输入网址在浏览器预览更改。如：http://localhost:4321/exam/25-26-2-%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6-%E6%9C%9F%E4%B8%AD

### 提交更改
首先，需要确保你fork的仓库与上游同步。在你的仓库页面找到Snyc fork按键，如果过期请点击绿色按钮Update branch更新。

![snyc](./sync.png)

接下来同步本地仓库。点击vscode左侧边栏的源代码管理，点击储存库的同步更改图标，形状是双箭头的圆环。

![Pull](./pull.png)

完成后点击+号暂存更改，上方输入信息后确认提交

![Submit](./submit.png)

另外给出用命令提交更改的步骤
``` bash
cd byrdocs-neowiki # 进入项目
git pull # 拉取同步仓库
git staus # 查看你做了哪些更改
git add . # 暂存更改(.是所有文件，如只需要上传部分替换为文件/文件夹名)
git commit -m "这里写你做了什么修改" # 评论
git push # 推送更改
```

### 在github上创建pr
在你fork的仓库找到Contribute按键，再点击绿色的Open pull request.描述后点击create pull request.

![contribute](./contribute.png)
![create](./create.png)

至此已经成功提交了一次修改，在该分支尚未被管理员合并之前，你在该分支提交的所有更改都会被加入该pr，不需要重新创建pr。或者你可以在github上直接修改已提交的pr内容。

![Pr](./pr.png)

---

以上就是neowiki的部署和使用流程，欢迎所有人使用并提出宝贵建议！

</PostDetail>