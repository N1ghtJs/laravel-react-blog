<?php

namespace App\Common;

class MyFunction
{
  /**
   * 获取 IP  地理位置
   * 淘宝IP接口
   * @Return: array
   */
  static public function getCity($ip = '')
  {
      if($ip == ''){
          $url = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json";
          $ip=json_decode(file_get_contents($url),true);
          $data = $ip;
      }else{
          $url="http://ip.taobao.com/service/getIpInfo.php?ip=".$ip;
          $ip=json_decode(file_get_contents($url));
          if((string)$ip->code=='1'){
             return false;
          }
          $data = (array)$ip->data;
      }

      return $data;
  }
}
