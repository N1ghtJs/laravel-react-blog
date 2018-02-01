<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('users')->insert([
          'name' => 'sad creeper',
          'email' => '87826632@qq.com',
          'password' => bcrypt('dmlhz1314'),
      ]);
    }
}
