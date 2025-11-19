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

BYR Docs 的几个项目之间都是较为独立的，不存在很强的依赖关系。比如说，你可以只fork [BUPT 生存指南的仓库](https://github.com/byrdocs/bupt-survival-guide)，做成一个单独的生存指南网站；你也可以只下载维基真题的数据库及服务器文件，做成一个单独的维基网站；当然，只搭建主站而抛弃维基也是完全可行的，只不过会缺少一部分来自维基的题目；只搭建主站而不搭建 Publish 也没关系，只是元信息录入会有些麻烦。

不过，Publish 必须配合主站搭建，否则便没有意义。

以下我将分别介绍各个子项目的数据获取/搭建方案。

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
2. 在 `wiki.byrdocs/` 目录内编写 `compose.yaml`。这里仅提供示例代码，建议你自行修改 `services/database/environment` 中的 `MYSQL_DATABASE` `MYSQL_USER` `MYSQL_PASSWORD` 三项。
```yaml
services:
  mediawiki:
    # 维基真题使用的 MediaWiki 版本为 1.43；随着时间推移，你需要自行升级 MediaWiki 版本
    image: mediawiki:1.43
    restart: no
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
    restart: no
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
docker compose up -d
```
5. 待镜像拉取完毕（只有首次拉取镜像时需要）且容器运行稳定后（大约需要 10 秒），通过 `docker ps` 你可以看到两个新增的容器正在运行。例如在这里，`wikibyrdocs-mediawiki-1` 是服务器容器，`wikibyrdocs-database-1` 是数据库容器。
```
CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                                     NAMES
1b05fd4356fa   mediawiki:1.43   "docker-php-entrypoi…"   16 seconds ago   Up 16 seconds   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   wikibyrdocs-mediawiki-1
7c27b51baf95   mariadb:lts      "docker-entrypoint.s…"   16 seconds ago   Up 16 seconds   3306/tcp                                  wikibyrdocs-database-1
```
6. 修改 `wikifolder/LocalSettings.php` 中的内容，以便正确配置 MediaWiki 服务。
    1. `$wgServer` 改为 `http://[ip]:8080`。其中 `[ip]` 是你宿主机的IP 地址（不能使用 `localhost`），端口号需要与你 `compose.yaml` 中指定的端口号相同。
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
8. 重启服务。
```bash
docker compose restart
```
9. 最后，通过浏览器访问 `http://localhost:8080`，你可以看到维基真题的完整网页（如果你是在远程布署的，请将 IP 地址换作你远程主机的 IP）。

### 后续维护

#### 行政员

MediaWiki 系统需要至少存在一名**行政员**，才能为其它用户授予各类用户组权限。新站长可向旧站[行政员列表](https://wiki.byrdocs.org/index.php?title=%E7%89%B9%E6%AE%8A:%E7%94%A8%E6%88%B7%E5%88%97%E8%A1%A8&group=bureaucrat)中的任何一位索取管理员、行政员及其它用户组权限。（若链接失效，请发邮咨询 cpphusky@gmail.com）。

行政员直接关系到全部用户权限的授予和剥夺，请谨慎使用你的权限！

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

### 所需资料

### 所需环境

</PostDetail>
