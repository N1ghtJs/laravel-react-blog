# Laravel-blog-v2

此博客重构中...敬请期待...   2018-11-01

交流加群 3113961

---

css 命名规则：BEM规范

---

基于 Laravel 5.5 和 react 的个人博客系统

演示地址：[http://dmmylove.cn](http://dmmylove.cn)

前台介绍：前台采用极简风格制作，注重移动端显示，只使用了最基础的 bootstrap，加载速度快：

- 文章浏览，浏览量统计，标签，标题搜索，标签搜索
- 文章评论，评论回复

后台介绍：管理后台使用 React + Ant Design 设计：

- 【后台面板】文章统计，留言统计，流量统计
- 【文章管理】集成富文本编辑器，图片使用云存储，一键导出 HTML/Markdown
- 【文章管理】新建文章默认为笔记，发表后才能在首页显示
- 【文章管理】文章置顶，首页优先显示置顶文章
- 【文章管理】文章添加标签，标签管理
- 【留言管理】管理收到的文章评论及回复
- 【访客记录】记录网站的访客信息

后台截图：

![image](https://user-images.githubusercontent.com/19741140/36642407-edee821e-1a79-11e8-8d7f-ef55c1fd3eaf.png)

更新日志：

02-06 | 基础功能完成 | [我是 sad creeper ，好久不见咯](http://dmmylove.cn/articles/3)

02-11 | 增加评论功能 | [评论功能完成，顺便总结下开发评论的经验](http://dmmylove.cn/articles/7)

02-24 | 增加访客记录 | [日访问量破百，分享关于IP的一点有趣的事](http://dmmylove.cn/articles/8)

如果你喜欢这个开源项目，按照下面操作部署到本地或者服务器就可以轻松拥有，顺便点个 star 拉，谢谢：）

# 如何部署到自己的服务器？

## 首先你需要一台服务器

如果你还没有，建议你购买一台腾讯云服务器（凭学生证最低10元/月），使用腾讯云可以无缝部署本项目

如果你仅仅想在本地运行，任意支持 Laravel 的环境都可以，但推荐使用官方提供的 Homestead

## 配置环境

服务器系统建议使用 Ubuntu 16.04

运行环境是经典的lnmp环境，可以参考我的文章完成配置：[Laravel 部署到阿里云/腾讯云](http://dmmylove.cn/articles/12)

## 配置完环境后登录服务器，按照如下步骤完成部署


选取任意位置，下载代码：（以 www 目录为例）（可自己定义工程名，这里以 myblog 为例）

```
cd /var/www

git clone git@github.com:SadCreeper/laravel-blog-v2.git myblog
```

进入工程目录，安装依赖（以 www 目录下的 myblog 为例）

```
cd /var/www/myblog

composer install
```

进入 mysql，创建一个数据库，以 myblog 为例

```
mysql -u <你的数据库名字> -p

//然后输入密码登录，之后会进入 mysql 命令行状态，在该状态下输入：

create database myblog;

//然后输入 exit 退出 mysql 命令行

exit
```

将工程目录下的 `.env.example` 文件复制一份，重命名为`.env`，然后修改数据库相关的配置，并添加腾讯云存储COS相关配置

```
DB_DATABASE=quanbang
DB_USERNAME= <你的数据库账号>
DB_PASSWORD= <你的数据库密码>

COS_REGION= <你的COS区域>
COS_APPID=  <你的腾讯云API ID>
COS_KEY=    <你的腾讯云API KEY>
COS_SECRET= <你的腾讯云API SECRET>
```

执行数据库迁移，并生成 laravel key（在工程根目录执行，以 www 目录下的 myblog 为例）

```
cd /var/www/myblog

php artisan migrate

php artisan key:generate
```

最后一步，需要修改一下 storage 文件夹的权限，依旧以 www 目录下的 myblog 为例

```
cd /var/www/myblog

sudo chmod -R 777 storage
```

部署完成，博客应该可以正常访问了~（不能正确部署请提 issue 我会及时回复）

## 使用

访问 '根目录/admin' 进入后台，第一次进入会弹出登录/注册界面，请先注册一个账号，只有ID为1的账号可以进入后台

## 更新

该博客会一直维护下去，并随时添加新功能，在服务器项目根目录下依次执行下列命令即可完成更新同步：

```
git pull

composer install

php artisan migrate
```
