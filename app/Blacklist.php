<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Blacklist extends Model
{
    protected $table = 'blacklist';

    /**
     * 检查 IP 是否存在于黑名单中
     * @var [int]
     */
    public static function check($ip)
    {
        if (Blacklist::where('ip', $ip)->first()) {
            return true;
        }else {
            return false;
        }
    }
}
