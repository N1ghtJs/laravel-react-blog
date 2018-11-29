<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>TEST TITLE</title>
</head>
<body>
    <h4>您发布的内容 “{{ $title }}” 收到了回复：</h4>
    <p> {{ $comment->name }} ：{{ $comment->content }} </p>
    <p><a href="{{ $url }}">点此查看</a></p>
</body>
</html>
