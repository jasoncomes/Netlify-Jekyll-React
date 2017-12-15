# OPM Liberty Landing Page

## Table of Contents
- [Setup](#setup)
- [Landing Page](#landing-page)
- [Widget](#widget)

## Setup

Jekyll is the Static Site Build System, it is used for paritals, markdown, layouts, structure. Please read through for more information: https://jekyllrb.com/

### Commands to work locally

- `gem install jekyll bundler` - Install jekyll Gem

**`jekyll serve` or `bundle exec jekyll serve`**

Jekyll also comes with a built-in development server that will allow you to preview what the generated site will look like in your browser locally. A development server will run at http://localhost:4000/

** `jekyll build` or `bundle exec jekyll build`**

The current folder will be generated into ./_site. The contents of `_site` are automatically cleaned, by default, when the site is built. 

### Deployment

The HigherEducation Repository(https://github.com/HigherEducation/opm-liberty) is setup on Netlify. On Git Push of your Commits, this deploys the master branch or current working branch to a staging/production server. On deployment, Netfify runs the `jekyll build` function to minifiy and setup the static site in the `_sites` folder.

*Staging:* `https://liberty.netlify.com`
*Password:* `HE`

For access to the Netlify Dashboard, please signup with Netlify using your Github account and have Eric Rasch grant you access to the Liberty Site.


## Landing Page

**_config.yml**

Stores configuration data. Many of these options can be specified from the command line executable but it’s easier to specify them here so you don’t have to remember them.

**_includes**

These are the partials that can be mixed and matched by your layouts and posts to facilitate reuse. The liquid tag `{% include file.ext %}` can be used to include the partial in `_includes/file.ext`.

Paritals on the site: `footer.html`, `header.html`, `modal.html`, `widget.html`

**_layout**

These are the templates that wrap posts. Layouts are chosen on a post-by-post basis in the YAML Front Matter, which is described in the next section. The liquid tag `{{ content }}` is used to inject content into the web page.

**_scss**

These are sass partials that can be imported into your main.scss which will then be processed into a single stylesheet `main.css` that defines the styles to be used by your site.

These are the site styles that get minified once you run `jekyll build` or `jekyll serve`.

**_site**

This is where the generated site will be placed (by default) once Jekyll is done transforming it. It’s probably a good idea to add this to your `.gitignore` file.

**assets**

Images, JS, CSS(imports from the `_scss` directory).

**Widget**

React widget form, there are instructions on the setup in the readme.md in the folder.

**404.html, index.html**

Provided that the file has a YAML Front Matter section, it will be transformed by Jekyll. The same will happen for any .html, .markdown,  .md, or .textile file in your site’s root directory or directories not listed above.

This is the contents of the two pages using the jekyll markdown.

## Widget

React widget form, there are instructions on setup and usage in the readme.md in the folder.

