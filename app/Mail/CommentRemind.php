<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CommentRemind extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($title, $comment, $url)
    {
        $this->subject('Re:' . $title);
        $this->title = $title;
        $this->comment = $comment;
        $this->url = $url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.comments.remind')
                    ->with([
                        'title' => $this->title,
                        'comment' => $this->comment,
                        'url' => $this->url,
                    ]);;
    }
}
