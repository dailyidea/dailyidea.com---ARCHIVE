<h1 class="content-subhead">Inspiration</h1>
<section class="post">
    <div class="post-description">
        <p>
            <a href="http://www.jamesaltucher.com/" target="_blank">James Altucher</a> wrote a blog post called <a target="_blank" href="http://www.jamesaltucher.com/2012/10/how-to-become-an-idea-machine/">How To Become An Idea Machine</a>.
        </p>
        <p>
            And I thought it was awesome.
        </p>
        <p>
            In fact, he's written <a target="_blank" href="http://www.jamesaltucher.com/2012/04/how-to-have-great-ideas/">a lot</a> <a target="_blank" href="http://www.jamesaltucher.com/2014/10/the-idea-matrix-what-changed-everyones-life-after-choose-yourself/">on the topic</a> <a target="_blank" href="http://www.jamesaltucher.com/2014/05/the-ultimate-guide-for-becoming-an-idea-machine/">of generating ideas</a>, but the most important part of it is this:
        </p>
        <blockquote>
            Creating ideas is a skill. And like any skill, it takes practice. Thinking of ideas every day strengthens your "idea muscle".
        </blockquote>
        <p>
            I made Daily Idea to make it easy to practice coming up with ideas.
        </p>
    </div>
</section>

<h1 class="content-subhead">Future Features</h1>
<section class="post">
    <div class="post-description">
        <p>Today, Daily Idea is just a place where you can email your ideas and I'll store them for you. Here's what I have in mind for the site:</p>
        <p><strong>Searchability</strong> One of the main objectives is to make sure that your ideas are easily searchable, so the technology underlying this is built with document search in mind (<a target="_blank" href="http://exploringelasticsearch.com/overview.html#sec-over-what-is-elasticsearch">Elasticsearch</a>).</p>
        <p><strong>Comparison</strong> Another feature of search engines is that I can help you identify ideas submitted by other people that may be similar to your idea. I think this would be great for helping nurture your own idea or finding collaborators.</p>
        <p><strong>Voting</strong> If ideas are publicly accessible, they can be voted on and you can get feedback about which of your ideas are well-liked by others.</p>
        <p><strong>Update</strong> The documents will be designed to let you come back and update them or add to them. Ideas start as fragile, barely-formed sparks, but with nurturing and care, they can grow into amazing things.</p>
        <p><strong>Reminders</strong> I can send you occasional reminders of ideas you've had in the past, or let you know if a previous idea is receiving attention from other people.</p>
        <p><strong>Privacy?</strong> For now all ideas will be publicly searchable. Soon I'll allow users to have private ideas. I will probably charge for ideas. Ideas want to be shared!</p>

    </div>
    
    
## Troubleshooting 

#### ServerlessError: The security token included in the request is invalid.

Make sure you have your AWS credentials in `~/aws/credentials` [docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-where).

If credentials are set, then it requires to specify aws profile.
Can be fixed by adding `export AWS_PROFILE="default"` to your .bash_profile (.bashrc, .zshrc, etc...).
Alternatively by appending `--profile default` to the `aws` cli command.
