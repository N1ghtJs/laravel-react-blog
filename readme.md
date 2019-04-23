# Laravel-react-blog

基于 Laravel 5.5 和 react 的个人博客系统

演示地址：[http://dmmylove.cn](http://dmmylove.cn)
版本：v1.0.10（2019-04-23）

**前台：** 极简风格制作，注重移动端显示，只使用了最基础的 bootstrap，加载速度快：
1. 文章浏览：浏览量统计，标签功能
2. 文章搜索：支持标题、标签搜索
3. 文章评论：支持评论与回复，邮件提醒，广告过滤

**后台：** 使用 React + Ant Design ：

文章管理：
1. 支持置顶、公开/隐藏文章
2. 支持排序、筛选、搜索
3. 支持富文本编辑器、Markdown编辑器
4. 支持从数据库导入文章
5. 标签管理

留言管理：
1. 支持跳转评论位置
2. 支持查看评论者IP
3. 支持拉黑IP，拉黑后的IP无法评论
4. 黑名单管理

设置中心：
1. 可设置博主信息，网站名称
2. 支持图片系统盘存储、腾讯云存储两种方式，一键切换
3. 支持开启/关闭评论和回复邮件提示功能

![image](https://user-images.githubusercontent.com/19741140/49372628-430cb100-f736-11e8-88af-8e8a5db97539.png)

如果你喜欢这个开源项目，按照下面操作部署到本地或者服务器就可以轻松拥有，顺便点个 star 拉，谢谢：）

## 在服务器上安装，直接使用

参考文章：[Laravel 部署到阿里云/腾讯云](http://dmmylove.cn/articles/12)

## 在本地安装，进行开发

本地开发建议使用 Homestead，配置 Homestead 参考官方文档：[Laravel 虚拟开发环境 Homestead](https://laravel-china.org/docs/laravel/5.5/homestead/1285)

配置好 Homestead 并确保可以正确登录到虚拟机

在共享目录下拉取代码（本机应该有一个目录，映射到 Homestead 虚拟机，用来存放 Laravel 工程的）

拉取完毕后，进入项目目录，安装依赖

```
composer install
```

生成.env文件

```
cp .env.example .env
```

生成 laravel key

```
php artisan key:generate
```

然后修改 Homestead.yaml：

在 sites 属性中增加两行（注意格式必须严格按照标准）
```
    - map: laravel-react-blog.test
      to: /home/vagrant/code/laravel-react-blog/public
```
在 databases 属性中增加一行（注意格式必须严格按照标准）
```
    - laravel-react-blog
```

然后退出虚拟机，执行`vagrant provision`，该指令会重启虚拟机并更新配置

重新进入虚拟机后，进入代码根目录，修改.env文件中数据库相关部分代码，然后执行`php artisan migrate`

最后修改 hosts 文件，在最底部加一行`192.168.10.10 laravel-react-blog.test`

## 使用

执行 seed 生成默认账号

```
php artisan db:seed --class=UsersTableSeeder
```

访问 '根目录/admin' 进入后台

使用默认账号：admin@qq.com，密码：admin 进行登录

文件存储有两种方式：系统盘和cos，如果要使用系统盘存储系统，还需要创建一个软连接

```
php artisan storage:link
```

如果要使用 COS，请参考下面【腾讯云 COS 配置】

## 更新

在服务器项目根目录下依次执行下列命令即可完成更新同步：

```
git pull origin master

composer install

php artisan migrate
```

## 腾讯云 COS 配置

根目录下的 .env文件中加入下列几行：

```
COS_REGION= <你的COS区域>
COS_APPID=  <你的腾讯云API ID>
COS_KEY=    <你的腾讯云API KEY>
COS_SECRET= <你的腾讯云API SECRET>
COS_BUCKET= <你的腾讯云存储桶>
```

其中 COS区域和存储桶是在创建存储桶后，要使用的存储桶的基础配置中查看

API ID/KEY/SECRET 这三项是在密钥管理里查看

## 发送邮件配置

推荐使用QQ邮箱，根目录下的 .env文件中修改下列几行：

```
MAIL_DRIVER=smtp
MAIL_HOST=smtp.qq.com
MAIL_PORT=465
MAIL_USERNAME= <你的QQ邮箱账号>
MAIL_PASSWORD= <你的QQ邮箱smtp授权码>
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS= <配置发送地址>
MAIL_FROM_NAME= <配置发送人>
```

## 帮助与反馈

有任何问题可以提 issue，或者加 QQ 交流群：3113961
