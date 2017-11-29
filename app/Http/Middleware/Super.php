<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class Super
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::id() != 1) {
            return redirect('/');
        }
        return $next($request);
    }
}
