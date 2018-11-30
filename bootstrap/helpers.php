<?php

    /**
     * 根据存储盘生成图片地址
     *
     */
    function imageURL($url)
    {
        if(!$url){
            return;
        }

        $file_disk = App\Setting::where('key', 'file_disk')->value('value');
        if ($file_disk == 'cos') {
            return 'http://images-1253193383.cosbj.myqcloud.com/' . $url;
        }else {
            return '/storage/images/' . $url;
        }
    }

    /**
     * 获取配置值
     *
     */
    function setting($key, $default=null)
    {
        return App\Setting::getSetting($key) ?: $default;
    }
