# 如何部署到自己的服务器？

## 首先你需要一台服务器

如果你还没有，建议你购买一台腾讯云服务器（凭学生证最低10元/月），使用腾讯云可以无缝部署本项目

## 配置环境

服务器系统建议使用 Ubuntu 16.04

运行环境是经典的lnmp环境，可以参考我的文章完成配置：[在阿里云（Ubuntu）上部署 Laravel 5.3 （LNMP 环境）步骤](http://dmmylove.cn:8080/article/9)

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
