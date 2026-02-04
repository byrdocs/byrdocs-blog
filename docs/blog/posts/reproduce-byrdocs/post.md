---
date: 2025-11-17 00:00
title: 从零搭建 BYR Docs 网站
category: 指引
author: cppHusky

---

站长不日毕业离校，本站未来交予诸位。

---

<PostDetail>

## 前言

常言道人各有志。BYR Docs 对我来说只是个出于兴趣搭建的服务性站点，在这段时间里，经过一众同学帮助，也算得上小有成绩。

不过我本人很快就要远赴他乡，且有更多自己想做的事情，难以再继续维护 BYR Docs 的运转了。对我来说，BYR Docs 的最佳结局就是有序关停。

但也有不少人受惠于本站，不希望它就此消失。都说授人以鱼不如授人以渔，我想，索性把搭建 BYR Docs 的方法公诸于世，以俟后人重新搭建，岂不更好？

于是我写了这篇文章，并将在未来 BYR Docs 关停之前无条件把全部资料分享到 GitHub/BYRPT 中。余下的事，就留待后人完成了。

## BYR Docs 概况

目前 BYR Docs 的项目主要包括以下部分：

- [BYR Docs 主站](https://byrdocs.org)是我们的主阵地，提供电子书、考试题目和其它资料的直接下载。主站布署于 Cloudflare Worker 中，其文件全部存储于 Cloudflare R2 对象存储服务器中，而可供检索的元信息保存于 [GitHub 仓库](https://github.com/byrdocs/byrdocs-archive)中。
  - [BYR Docs Publish](https://publish.byrdocs.org)附属于主站，实现上传功能。它为一般用户提供更好的文件上传及元信息填写、提交服务。Publish 布署于 Cloudflare Worker 中。
- [维基真题](https://wiki.byrdocs.org)是主站试题部分的延伸，提供可编辑性更强的试题库，允许用户以更零碎的方式贡献试题和答案。维基真题布署于自托管的 MediaWiki 服务器中。
- [BUPT 生存指南](https://guide.byrdocs.org)是另一个独立项目，提供北京邮电大学两校区的生活学习指南，以帮助新生更好地适应学校环境。生存指南布署于 Cloudflare Page 中。

BYR Docs 的几个项目之间都是较为独立的，不存在很强的依赖关系。比如说，你可以只fork [BUPT 生存指南的仓库](https://github.com/byrdocs/bupt-survival-guide)，做成一个单独的生存指南网站；你也可以只下载维基真题的数据库及服务器文件，做成一个单独的维基网站；当然，只搭建主站而抛弃维基也是完全可行的，只不过会缺少一部分来自维基的题目；只搭建主站而不搭建 Publish 也没关系，只是文件上传和元信息录入会有些麻烦。

不过，Publish 必须配合主站搭建，否则便没有意义。

以下我将分别介绍各个子项目的数据获取/搭建方案。

## BYR Docs 主站

### 所需资料

BYR Docs 需要的资料包括**文件**和**元信息**两部分。byrdocs-archive 仓库中提供了关于[文件](https://github.com/byrdocs/byrdocs-archive/blob/master/docs/%E6%96%87%E4%BB%B6%E8%A7%84%E5%88%99.md)和[元信息](https://github.com/byrdocs/byrdocs-archive/blob/master/docs/%E5%85%83%E4%BF%A1%E6%81%AF%E8%A7%84%E5%88%99.md)的简单规则，供你参考。

BYR Docs 的文件统一存储于 Cloudflare R2 Object Storage 中，分为可公开的**数据**和非公开的**资源文件**两部分。

站点元信息来源于 [byrdocs-archive 仓库](https://github.com/byrdocs/byrdocs-archive)，以可读性较强的 YAML 格式保存。它定义了一些[自动化流程](https://github.com/byrdocs/byrdocs-archive/tree/master/.github/workflows)，可以使用 [byrdocs-check 仓库](https://github.com/byrdocs/byrdocs-check) 中的程序完成格式检查、数据更新等工作。

BYR Docs 的网站代码位于 [byrdocs 仓库](https://github.com/byrdocs/byrdocs) 中。

你需要准备的资料包括：
- 下载好全部**资源文件**；
- 一个 [byrdocs-archive](https://github.com/byrdocs/byrdocs-archive) 仓库；
- 一个 [byrdocs](https://github.com/byrdocs/byrdocs) 仓库；
- （可选）如果有需要，增加一个 [byrdocs-check](https://github.com/byrdocs/byrdocs-check) 仓库，以使其符合你的需求。关于 byrdocs-check 的介绍不在本文内容之列。

### 所需环境

- 如果你需要同时启用 BYR Docs Publish，强烈建议你注册一个 [GitHub Organization](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations)，并把以上仓库移入该组织名下。
- 你需要拥有一个 [Cloudflare 账号](https://dash.cloudflare.com)。
- 你的本地开发环境需要安装 [Node.js](https://nodejs.org) 及 [pnpm](https://pnpm.io/)。
- 本项目的最佳布署方法是使用 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)。它作为 `byrdocs` 仓库的依赖包，在 [准备开发环境](#准备环境) 一步中可以安装。
- 你需要下载 [Minio Client](https://github.com/minio/mc) 并安装，以便批量向 R2 存储库内写入文件；
- 如果需要批处理元信息，你需要安装 [Python](https://www.python.org/) 运行环境。

#### 关于 Cloudflare 资费

> 目前本人维持 BYR Docs 主站所需的支出约为每月 0.4 USD，支出完全由 R2 产生。

- 你可以使用 Cloudflare Workers 的免费订阅，或者每月支付 5 USD 使用 Workers 付费订阅。使用免费订阅不影响网站的正常功能，但存在一定的运行和访问量限制。请参考 [Limits - Cloudflare Docs](https://developers.cloudflare.com/workers/platform/limits/) 并自行评估是否需要付费。
- 本站文件存读所使用的 [R2 Object Storage](https://developers.cloudflare.com/r2/) 容量和操作数可能超出免费额度的限制，Cloudflare 将对超出部分收费，详见 [Pricing - R2](https://developers.cloudflare.com/r2/pricing/)。

### 搭建步骤

因为搭建过程较为繁琐，我将其分为几个子过程，分别加以介绍。
1. [准备 byrdocs 开发环境](#准备-byrdocs-开发环境)
2. [准备 BYR Docs 文件](#准备-byr-docs-文件)
3. [准备 BYR Docs Archive](#准备-byr-docs-archive)

#### 准备 byrdocs 开发环境

首先，我们需要搭建本地开发环境。

1. 将 `byrdocs` 仓库拷贝到本地，并进入该目录。
2. 下载依赖。
```bash
pnpm i
```
3. 登录 Wrangler CLI，按照指示完成登录。
```bash
npx wrangler login
```
4. 配置 D1 数据库。
    1. 打开 `wrangler.toml`，删除所有的 `[[d1_databases]]` 表项。
    2. 创建名为 `byrdocs` 的 D1 数据库。
    ```bash
    npx wrangler d1 create byrdocs --binding DB
    ```
    3. Wrangler 会为你生成一则 Toml 配置，将其复制到 `wrangler.toml` 中，如：
    ```toml
    [[d1_databases]]
    binding = "DB"
    database_name = "byrdocs"
    database_id = $DATABASE_ID
    ```
    4. 应用 D1 数据库迁移。
    ```bash
    npx wrangler d1 migrations apply byrdocs --remote
    ```
5. 建立一个可以通过 Prisma 访问并读写 D1 数据库的 Token。在 [Account API tokens](https://dash.cloudflare.com/?to=/:account/api-tokens) 页面中点击 *Create Token*，选择 *Create Custom Token*。为整个 Account 设置 D1 的读权限和写权限，如下图所示。
![Creating D1 Token](./creating-d1-token.png)
6. 当 Token 建立成功后，注意记录并保存完成页面的 **Token value**。
7. 填写环境变量。你需要准备以下两个文件：
    1. `.env` 定义了构建时用到的环境变量，格式如下，请依实际情况自行更改。
    ```ini
    # BYR Docs Publish 的域名
    PUBLISH_SITE_URL = "https://publish.byrdocs.org"
    # 你的 byrdocs-archive 对应的 GitHub 仓库
    ARCHIVE_REPO_URL = "https://github.com/byrdocs/byrdocs-archive"
    ```
    2. `.dev.vars` 定义了 Cloudflare 后端用到的环境变量，格式如下，请依实际情况自行更改。
    ```ini
    # 第6步得到的 D1 读写 Token
    CLOUDFLARE_D1_TOKEN=
    # 你的 Cloudflare Account Id，可通过命令 `npx wrangler whoami` 查得
    CLOUDFLARE_ACCOUNT_ID=
    # D1 的数据库 ID，在生成数据库时得到，可在 `wrangler.toml` 中找到
    CLOUDFLARE_DATABASE_ID=
    # 自行生成一个字母/数字/符号串，且不少于32字符
    JWT_SECRET=
    # 同上，但不要使用相同的值
    BYRDOCS_SITE_TOKEN=
    # 主站网址，也是你为主站设定的自定义域名，见下文第12步
    BYRDOCS_SITE_URL="https://byrdocs.org"
    # byrdocs-data 存储桶的自定义域名，见“准备 BYR Docs 文件”第7步
    R2_DATA_SITE_URL="https://files.byrdocs.org"
    # BYR Docs Publish 的域名
    PUBLISH_SITE_URL="https://publish.byrdocs.org"
    # BYR Docs Publish 的测试地址
    PUBLISH_DEV_SITE_URL="http://localhost:3000"
    # 测试用的网站域名
    DEV_SITE_URL="https://byrdocs.cpphusky.workers.dev"
    # 你的 byrdocs-archive 对应的 GitHub 仓库
    ARCHIVE_REPO_URL="https://github.com/byrdocs/byrdocs-archive"
    ```
8.  现在运行 `pnpm run deploy` 进行初次布署。但此时因为尚未准备好所需的信息和文件，所以网站的正常功能还不可用。
9. 接下来，将 `.dev.vars` 中的环境变量上传至 Cloudflare Worker 中。
```bash
npx wrangler secret bulk .dev.vars
```
10. 在 [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) 列表中，选中自己的 `byrdocs` 站点。找到 *Settings* -> *Build* ，点击 *Connect*，打开选单。
11. 选好你的 GitHub 仓库和分支，*Build command* 填 `pnpm run build`，*Deploy command* 填 `npx wrangler deploy`。展开 *Build variables*，将你 `.env` 中的所有环境变量填入其中。全部完成之后点击 *Connect*。
12. 同样在 `byrdocs` 站点设置中，找到 *Domains & Routes*，点击 *+Add* -> *Custom domain*，填写你希望使用的域名。
13. 提交你在第 4 步中作出的更改并推送到 GitHub。接下来检查 Cloudflare Deployment 是否可以正常运行并通过。

现在你已经顺利搭建好了 BYR Docs 的开发环境。

#### 准备 BYR Docs 文件

- BYR Docs 的资源文件位于一个 Cloudflare R2 存储桶内，它们分为三类：
    - 文件本身，它的 MD5 校验码等于文件名，后缀只能是 `.zip` 或 `.pdf`。
    - 文件附属的 `.webp` 文件，用于网页预览。
    - 文件附属的 `.jpg` 文件，用于大图预览。
- BYR Docs 的数据文件位于另一个 Cloudflare R2 存储桶内，有且只有 5 个：
    - `metadata.json` 记录 `byrdocs-file` 中文件的信息，以供后台处理。
    - `wiki.json` 记录 [维基真题](#维基真题) 的文件信息，以供后台处理。如果你无意搭建维基真题，可以删除不使用它，也可以直接写一个空数组 `[]`。
    - `book.yaml` `test.yaml` `doc.yaml` 都来自 [byrdocs-archive 仓库](https://github.com/byrdocs/byrdocs-archive/tree/master/schema)。
- 另外，建议你准备一个备份存储桶，以防不测。
    - 你只需要存储资源文件中的 `.zip` 和 `.pdf` 文件，因为 `.webp` `.jpg` 文件都是由前者生成的，无需专门存储。

当你下载 BYR Docs 资源文件压缩包后，请先将其解压，得到一个名为 `byrdocs-file/` 的文件夹。接下来，你可按以下步骤，将资源文件导入你自己账号下的 R2 存储桶中。

1. 建立三个 R2 存储桶，分别名为 `byrdocs-file` `byrdocs-data` 和 `byrdocs-backup`。但**不要修改现有的 `wrangler.toml`**。
```bash
npx wrangler r2 bucket create byrdocs-file
npx wrangler r2 bucket create byrdocs-data
npx wrangler r2 bucket create byrdocs-backup
```
2. 建立一组可以通过 Minio 访问并读写以上三个存储桶的 Token。在[创建 R2 API Tokens](https://dash.cloudflare.com/?to=/:account/r2/api-tokens/create?type=account) 页面中为 `byrdocs-file` `byrdocs-data` `byrdocs-backup` 存储桶授予 **Object Read & Write** 权限，如下图所示。
![Creating R2 Token](./creating-r2-token.png)
3. 当 Token 建立成功后，注意记录并保存完成页面的 **Token value**, **Access Key ID**, **Secret Access Key** 及以 **S3 Endpoint**。
4. 通过 Minio 建立一个到你账号 R2 存储池的引用，其中的 `<s3-endpoint>` `<access-key-id>` `<secret-access-key>` 都是第 3 步中你记录下的值。
```bash
mcli alias set r2 <s3-endpoint> <access-key-id> <secret-access-key>
```
5. 通过 Minio 进行文件拷贝。来源目录为你解压得到的 `byrdocs-file/` 目录，目标目录为 `r2/byrdocs-file` 存储桶。
```bash
mcli cp -r ./byrdocs-file/ r2/byrdocs-file
```
6. 拷贝完成后，可以通过 `diff` 检查 `byrdocs-file` 存储桶的数据是否完整。如果数据不完整，请回到上一步。
```bash
mcli diff ./byrdocs-file/ r2/byrdocs-file # 如无任何输出且返回值为 0，则数据完整
```
7. 为 `byrdocs-data` 建立一个自定义域名，这样，包括你在内的任何人都可以使用域名来读取其中的文件。其中的 `$ZONE_ID` 可以[如此查询](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/#copy-your-zone-id)。
```bash
# 其中的 $R2_DATA_SITE_URL 不要带 `https://` 前缀
npx wrangler r2 bucket domain add byrdocs-data --domain $R2_DATA_SITE_URL --zone-id $ZONE_ID
```

#### 准备 BYR Docs Archive

1. 将 `byrdocs-archive` 仓库拷贝到本地，并进入该目录。
2. 使用以下命令来批量修改元信息中的 `url`，其中 `BYRDOCS_SITE_URL` 是你为主站设定的目标域名，例如 `https://byrdocs.org`。
```bash
pip install -r scripts/requirements.txt
scripts/update_urls.py $BYRDOCS_SITE_URL
```
3. [上传 GitHub Secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)，以便应用于 GitHub Actions 当中。一共有 12 个 Secrets 需要上传：
    1. `R2_ACCOUNT_ID` 是你的 Cloudflare Account Id；
    2. `R2_ACCESS_KEY_ID` `R2_SECRET_ACCESS_KEY` 是你在创建 R2 Token 时记录下来的值。
    3. `R2_FILE_BUCKET` `R2_DATA_BUCKET` 是你定义的资源文件存储桶、数据存储桶名称，在这里是 `byrdocs-file` `byrdocs-data`。
    4. `BYRDOCS_SITE_URL` 是你为主站设置的网站域名 `$BYRDOCS_SITE_URL`。
    5. `BYRDOCS_SITE_TOKEN` 是你在 `byrdocs` 代码中定义的 `BYRDOCS_SITE_TOKEN` 值，需保持一致。
    6. `FILELIST_SITE_URL` 定义了 `.zip` 文件预览服务的 API 提供网站。你可直接使用 `https://filelist.youxam.workers.dev`。
    7. `BACKUP_ENDPOINT` 是你 R2 备份存储池的 S3 API 端点，可在 [*Account Details*](https://dash.cloudflare.com/?to=/:account/r2/overview) 中查得。当然，你也可以自行配置和使用其它 S3 兼容的存储池。
    8. `BACKUP_ACCESS_KEY_ID` `BACKUP_SECRET_ACCESS_KEY` 是你在创建 R2 备份存储池的 Token 时记录下来的值。如果你的备份存储池和主存储池相同，只需使用第二步中相同的值即可。
    9. `BACKUP_FILE_BUCKET` 是你定义的资源文件备份存储桶名称，在这里是 `byrdocs-backup`。
4. 在该仓库的设置页中，找到 *Actions* -> *General* -> *Actions Permissions*，选择 *Allow all actions and reusable workflows*，以启用 GitHub CI。
5. 在该仓库的 Actions 页中，如果出现了 *Workflows aren't being run on this forked repository* 提醒，点击 *I understand my workflows, go ahead and enable them*，以确认启用 Workflows。
6. 提交你在第 2 步中作出的更改并推送到 GitHub。接下来检查 GitHub Workflows 是否可以正常运行并通过。
7. 如果上一步顺利通过，你将可以使用 Minio CLI 看到 `byrdocs-data` 存储桶中出现了 `metadata.json` `book.yaml` `test.yaml` `doc.yaml` 四个文件。
```bash
mcli ls r2/byrdocs-data
```

现在你已经顺利搭建好了 BYR Docs 主站的服务。

## BYR Docs Publish

### 所需资料

BYR Docs Publish 是一个 Cloudflare Page，其前后端代码位于 [byrdocs-publish](https://github.com/byrdocs/byrdocs-publish) 仓库中。

你需要准备的资料包括：

- 一个 [byrdocs-publish](https://github.com/byrdocs/byrdocs-publish) 仓库，建议置于你自己的组织名下，作为**基准仓库**。你应当已经在[准备 BYR Docs Archive](#准备-byr-docs-archive) 的过程中完成了这一步。
- （可选）当你调试网站功能时，你需要准备另一个 [byrdocs-publish](https://github.com/byrdocs/byrdocs-publish) 仓库。它必须**由基准仓库 Fork 而来**。

### 所需环境

- 你需要拥有一个 [Cloudflare 账号](https://dash.cloudflare.com)。
- 你的本地开发环境需要安装 [Node.js](https://nodejs.org) 及 [pnpm](https://pnpm.io/)。
- 本项目的最佳布署方法是使用 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)。它作为 `byrdocs-publish` 仓库的依赖包，在 [准备开发环境](#准备开发环境) 一步中可以安装。
- 强烈建议你注册一个 GitHub 组织，或拥有两个 GitHub 账户，否则你将无法 Fork 自己的 `byrdocs-archive` 仓库并使用部分功能。
- 你需要创建一个 GitHub APP 并拥有其完整权限，我将在下文介绍其配置。

### 搭建步骤

分为以下几个子步骤：
1. [准备 GitHub App](#准备-github-app)
2. [准备 publish 开发环境](#准备-publish-开发环境)

#### 准备 GitHub App

要注册一个 GitHub App，你可以在个人或组织账户下完成，效果相同。接下来以在个人账户下注册为例：

1. 打开[新建 GitHub App](https://github.com/settings/apps/new)页面。
2. 填写 App 的有关配置。（假设你的 BYR Docs Publish 站点域名为 `PUBLISH_SITE_URL`）
    1. *GitHub App Name* 和 *Homepage URL* 都可以任意填写。
    2. *Identifying and authorizing users*：
        1. *Callback URL* 填为 `PUBLISH_SITE_URL/callback/github`；如果你希望在本地运行和测试，还可以添加一个 `http://localhost:3000/callback/github`。
        2. 选中 *Expire user authorization tokens*。
        3. **不**选中 *Request user authorization (OAuth) during installation* 和 *Enable Device Flow*。
    3. *Post installation*：
        1. *Setup URL* 填为 `PUBLISH_SITE_URL/bind`。
        2. 选中 *Redirect on update*。
    4. *Webhook*：
        1. *Webhook URL* 填为 `PUBLISH_SITE_URL/api/github/webhook`。
        2. *Secret* 请自行生成一个足够强的字符串填入，记下它，作为 `WEBHOOK_SECRET`。
    5. *Permissions*：
        1. 在 *Repository permissions* 中，设定 *Contents* 和 *Pull Requests* 的权限均为 *Read and Write*，其它项无需设定。
    6. *Subscribe to events*：不选任何项。
    7. *Where can this GitHub App be installed?* 选择 *Any Account*。
3. 点击 *Create GitHub App*，完成 App 创建。
4. 在完成创建的页面，记下 *About* 中的 *App ID* 和 *Client ID*，作为 `APP_ID` 和 `GITHUB_CLIENT_ID`。
5. 在 *Client Secrets* 中点击 *Generate a new client secret*，记下新生成的值，作为 `GITHUB_CLIENT_SECRET`。
6. 在 *Private keys* 中点击 *Generate a private key*，会生成并自动下载一个 .pem 文件。将它转成 PKCS8 格式，得到如下形式的内容。记下它的内容，作为 `GITHUB_APP_PRIVATE_KEY`。
```
-----BEGIN PRIVATE KEY-----
... ...
-----END PRIVATE KEY-----
```
7. 点击侧边栏 *Install App*，将你创建的 GitHub App 安装到基准仓库中。

以上过程中需要你记录的量有五个：`APP_ID` `GITHUB_CLIENT_ID` `GITHUB_CLIENT_SECRET` `GITHUB_APP_PRIVATE_KEY` `WEBHOOK_SECRET`。请注意留存。

#### 准备 publish 开发环境

1. 将 `byrdocs-publish` 仓库拷贝到本地，并进入该目录。
2. 下载依赖。
```bash
pnpm i
```
3. 登录 Wrangler CLI，按照指示完成登录。
```bash
npx wrangler login
```
4. 配置 D1 数据库。
    1. 打开 `wrangler.toml`，删除所有的 `[[d1_databases]]` 表项。
    2. 创建名为 `byrdocs-publish`，绑定名为 `DB` 的 D1 数据库。
    ```bash
    npx wrangler d1 create byrdocs-publish --binding DB
    ```
    3. Wrangler 会为你生成一则 Toml 配置，将其复制到 `wrangler.toml` 中，如：
    ```toml
    [[d1_databases]]
    binding="DB"
    database_name = "byrdocs-publish"
    database_id = $DATABASE_ID
    ```
    4. 应用 D1 数据库迁移。
    ```bash
    npx wrangler d1 migrations apply byrdocs-publish --remote
    ```
5. 填写环境变量。你需要准备以下两个文件：
    1. `wrangler.toml` 的 `[vars]` 表中定义了构建时用到的环境变量，格式如下，请依实际情况自行更改。
    ```toml
    [vars]
    # Node.js 版本，使用 23.9.0
    NODE_VERSION = "23.9.0"
    # 主站网址，也是你为主站设定的自定义域名
    NEXT_PUBLIC_BYRDOCS_SITE_URL = "https://byrdocs.org"
    # byrdocs-data 存储桶的自定义域名
    NEXT_PUBLIC_R2_DATA_SITE_URL = "https://files.byrdocs.org"
    # BYR Docs Publish 的域名，见下文第 11 步
    NEXT_PUBLIC_PUBLISH_SITE_URL = "https://publish.byrdocs.org"
    # 测试用的网站域名
    NEXT_PUBLIC_PUBLISH_DEV_SITE_URL = "http://localhost:3000"
    # 你的 GitHub APP 链接
    NEXT_PUBLIC_PUBLISH_APP_URL = "https://github.com/apps/byrdocs-publish"
    # 你的基准仓库所有者
    NEXT_PUBLIC_ARCHIVE_REPO_OWNER = "byrdocs"
    # 你的基准仓库名称
    NEXT_PUBLIC_ARCHIVE_REPO_NAME = "byrdocs-archive"
    # 你的基准仓库地址
    NEXT_PUBLIC_ARCHIVE_REPO_URL = "https://github.com/byrdocs/byrdocs-archive"
    ```
    2. `.dev.vars` 定义了 Cloudflare 后端用到的环境变量，格式如下，请依实际情况自行更改。
    ```ini
    # 你在创建 GitHub APP 时记录下来的信息
    APP_ID=
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    GITHUB_APP_PRIVATE_KEY=
    WEBHOOK_SECRET=
    # 必须与 BYR Docs 主站使用的 JWT_SECRET 一致
    JWT_SECRET=
    ```
6. 现在将你的更改提交、推送到 GitHub。
7. 开始[通过 GitHub 布署 Cloudflare Page](https://dash.cloudflare.com/?to=/:account/pages/new/provider/github)。从该账号名下的全部仓库中选择你的 `byrdocs-publish` 仓库，然后点击右下角 *Begin setup*。
8. 选择正确的 branch。在 *Build settings* 中，*Build command* 填 `pnpm run cf-build`，*Build output directory* 留空。
9. 点击 *Save and Deploy*，等待初次布署完毕。
10. 接下来，将 `.dev.vars` 中的环境变量上传至 Cloudflare Worker 中。
```bash
npx wrangler pages secret bulk .dev.vars
```
11. 在 [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) 列表中，选中自己的 `byrdocs-publish` 站点。找到 *Custom domains*，点击 *Set up a custom domain*，填写你希望使用的域名，再点击 *Continue* -> *Active domain*，激活此域名。
12. 再次通过 GitHub 仓库布署。一种可行的方法是重新提交并推送到 GitHub：
```bash
git commit --amend
git push origin main --force-with-lease
```

## 维基真题

维基真题使用 [MediaWiki 软件](https://www.mediawiki.org/wiki/MediaWiki) 搭建而成，配合 Nginx 和 MariaDB，布署在自托管的服务器中。它的搭建过程需要较多繁琐的配置，包括 Nginx、PHP-FPM、MariaDB 等多个方面。

为了降低布署难度，简化操作流程，我推荐使用 MediaWiki 官方提供的 Docker 镜像进行容器化布署；当然，你也可以参考 [MediaWiki 的安装文档](https://www.mediawiki.org/wiki/Manual:Installing_MediaWiki)，探索如何在裸机上进行布署。

### 所需资料

- 一个压缩的数据库文件 `wikibackup.sql.gz`，包含用户数据、站点内容等诸多信息。
- 一个压缩的维基文件夹 `wikifolder.tar.gz`，包含配置文件 `LocalSettings.php` 及扩展、媒体文件和资源文件。

你可以通过以下 Bash 命令将其解压，得到 `wikibackup.sql` 及 `wikifolder/`：

```bash
gzip -d wikibackup.sql.gz # 得到 wikibackup.sql，原文件不保留
tar -xzf wikifolder.tar # 得到 wikifolder/
```

其它解压工具也可。

### 所需环境

- 一台安装了 [Docker Compose](https://github.com/docker/compose) 的计算机。

### 搭建步骤

1. 在你认为合适的位置建立一个任意名称的目录，比如 `wiki.byrdocs/`。
2. 在 `wiki.byrdocs/` 目录内编写 `compose.yaml`。这里仅提供示例代码，建议你自行修改 `services.database.environment` 中的 `MYSQL_DATABASE` `MYSQL_USER` `MYSQL_PASSWORD` 三项。
```yaml
services:
  mediawiki:
    # 维基真题使用的 MediaWiki 版本为 1.43；随着时间推移，你需要自行升级 MediaWiki 版本
    image: mediawiki:1.43
    restart: 'no'
    # 你可自行修改站点的端口号，这里使用 8080
    ports:
      - 8080:80
    links:
      - database
    volumes:
      - ./wikifolder/extensions:/var/www/html/extensions
      - ./wikifolder/images:/var/www/html/images
      - ./wikifolder/resources:/var/www/html/resources
      - ./wikifolder/LocalSettings.php:/var/www/html/LocalSettings.php
  database:
    image: mariadb:lts
    restart: 'no'
    environment:
      MYSQL_DATABASE: my_wiki
      MYSQL_USER: wikiuser
      MYSQL_PASSWORD: example
      MYSQL_RANDOM_ROOT_PASSWORD: 'yes'
    volumes:
      - ./db:/var/lib/mysql
volumes:
  extensions:
  images:
  resources:
  db:
```
3. 将解压后的 `wikifolder/` 移动到 `wiki.byrdocs/` 目录下。
4. 进入 `wiki.byrdocs/` 目录，并运行以下命令：
```
docker-compose up -d
```
5. 待镜像拉取完毕（只有首次拉取镜像时需要）且容器运行稳定（大约需要 10 秒）后，通过 `docker ps` 你可以看到两个新增的容器正在运行。例如在这里，`wikibyrdocs-mediawiki-1` 是服务器容器，`wikibyrdocs-database-1` 是数据库容器。
```
CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                                     NAMES
1b05fd4356fa   mediawiki:1.43   "docker-php-entrypoi…"   16 seconds ago   Up 16 seconds   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   wikibyrdocs-mediawiki-1
7c27b51baf95   mariadb:lts      "docker-entrypoint.s…"   16 seconds ago   Up 16 seconds   3306/tcp                                  wikibyrdocs-database-1
```
6. 修改 `wikifolder/LocalSettings.php` 中的内容，以便正确配置 MediaWiki 服务。
    1. `$wgServer` 改为 `http://[ip]:8080`。其中 `[ip]` 是你宿主机的 IP 地址（不能使用 `localhost` `127.0.0.1` 或 `::1`），端口号需要与你 `compose.yaml` 中指定的端口号相同。
    2. `$wgDBserver` 改为数据库容器的名字，如 `wikibyrdocs-database-1`。
    2. `$wgDBName` `$wgDBuser` `$wgDBpassword` 三项需要和你在 `compose.yaml` 中的配置保持一致。
7. 接下来，通过以下步骤[导入数据库资料](https://www.mediawiki.org/wiki/Manual:Restoring_a_wiki_from_backup#Import_the_database_backup)。
    1. 将 sql 文件拷贝到容器内部。
    ```bash
    docker cp wikibackup.sql wikibyrdocs-database-1:/root/
    ```
    2. 进入容器内部进行操作。
    ```bash
    docker exec -it wikibyrdocs-database-1 bash
    ```
    3. 先销毁原有的数据库。其中的用户名、数据库名和密码与先前写在 `compose.yaml` 中的相同。
    ```bash
    mariadb-admin -u wikiuser -p drop my_wiki
    ```
    4. 新建空数据库 `my_wiki`。
    ```bash
    mariadb-admin -u wikiuser -p create my_wiki
    ```
    5. 向 `my_wiki` 中导入数据。
    ```bash
    mariadb -u wikiuser -p my_wiki < /root/wikibackup.sql
    ```
    6. 退出容器。
    ```bash
    exit
    ```
8. 重启服务。
```bash
docker-compose restart
```
9. 最后，通过浏览器访问 `http://localhost:8080/w/首页`，你可以看到维基真题的完整网页（如果你是在远程布署的，请将 IP 地址换作你远程主机的 IP）。

### 后续维护

#### 行政员

MediaWiki 系统需要至少存在一名**行政员**，才能为其它用户授予各类用户组权限。新站长可向旧站[行政员列表](https://wiki.byrdocs.org/index.php?title=%E7%89%B9%E6%AE%8A:%E7%94%A8%E6%88%B7%E5%88%97%E8%A1%A8&group=bureaucrat)中的任何一位索取管理员、行政员及其它用户组权限。（若链接失效，请发邮咨询 cpphusky@gmail.com）。

行政员直接关系到全部用户权限的授予和剥夺，请谨慎使用你的权限！

#### 维基真题元信息


#### 维基真题备份

> 主条目：[Manual:Backing up a wiki - MediaWiki](https://www.mediawiki.org/wiki/Manual:Backing_up_a_wiki)

你可能像我一样，会在某一天将维基真题的资料打包好，交付给下一位站长。你需要为他准备的内容一如我为你准备的内容：

- 一个 `wikibackup.sql.gz` 数据库文件；
- 一个 `wikifolder.tar.gz` 维基文件夹。

即便你尚无打算转手维基真题，定期备份也是个好习惯。

1. 在进行备份之前，请先在 `wikifolder/LocalSettings.php` 中添加一行
```php
$wgReadOnly = 'MediaWiki维护中，请注意保存你的更改，以待给护结束后提交。';
```
2. 重启服务：
```bash
docker compose restart
```
3. 通过 `mariadb-dump` 生成数据库文件：
```bash
mariadb-dump -h localhost -u wikiuser -p --default-character-set=utf8 my_wiki > /root/wikibackup.sql
gzip /root/wikibackup.sql # 通过压缩减小其体积，得到 wikibackup.sql.gz
# 将该文件从容器中拷贝出来即可
```
4. 维基文件夹可以直接打包宿主机内的 `wiki.byrdocs/wikifolder/` 目录得到：
```bash
tar -czf wikifolder.tar.gz wikifolder/ # 得到 wikifolder.tar.gz
```

## BUPT 生存指南

BUPT 生存指南基于 [Astro Starlight](https://starlight.astro.build/) 搭建，可以快捷、简单地生成静态的文档网站。无论要在本地搭建，还是使用 Pages 服务，都十分方便。

你可以选择使用自托管服务器或 Cloudflare Pages （及其它 Pages 服务）搭建本站。不过一般来说，即便你选择了 Pages 服务，为了测试网站效果，本地搭建和预览也是必要的。

接下来我将介绍如何本地搭建和使用 Cloudflare Pages 搭建。

### 所需资料

BUPT 生存指南的全部文件是一个 [GitHub 仓库](https://github.com/byrdocs/bupt-survival-guide)，你可直接 [Fork 该仓库](https://github.com/byrdocs/bupt-survival-guide/fork)。

### 本地搭建

需要安装 [Node.js](https://nodejs.org) 及 [pnpm](https://pnpm.io/)。

1. 将该仓库内容克隆到本地，打开所在目录。
2. 下载依赖。
```bash
pnpm i
```
3. 启动开发服务器。访问 `http://localhost:4321`，你可以看到网站的内容，并使用一些基本功能。在 `dev` 模式下，这个网站会随着你的文档代码更新而热加载。
```bash
pnpm dev # 开始 dev 预览模式
```
4. 完成文档工作后，你可以构建完整网页并使用它的全部功能。
```bash
pnpm build # 此时网页代码将被编译至 `dist/` 中
pnpm preview # 本地查看，也可加 --host 暴露给公网
```

### 使用 Cloudflare Pages 搭建

需要拥有一个 [Cloudflare 账号](https://dash.cloudflare.com)。如果只需搭建 BUPT 生存指南，你无需付费或填写任何付款方式。

1. 开始[通过 GitHub 布署](https://dash.cloudflare.com/?to=/:account/pages/new/provider/github)。初次使用时，你可能需要绑定一个 GitHub 账号。绑定账号之后，从该账号名下的全部仓库中选择你的仓库，然后点击右下角 *Begin setup*。
2. 在配置列表中，需要指定 *Framework preset* 为 **Astro**，*Build command* 为 `pnpm build`，*Build output directory* 为 `dist`，其它配置可以自行修改。配置完毕后点击右下角 *Save and Deploy*，开始部署你的网站。
![Set up builds and deployments](./survival-set-up-builds-and-deployments.png)
3. 等待 Cloudflare 布署完毕，而后你可以查看该网站。

此时该 Page 已经与你绑定的 GitHub 仓库建立连接。每当 GitHub 仓库发生更新时，该 Page 都会获取更新并重新布署，非常方便。

</PostDetail>
