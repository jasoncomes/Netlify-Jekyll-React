# OPM Liberty Landing Page

## Table of Contents
- [Setup](#setup)
- [Landing Page](#landing-page)
- [Widget](#widget)

## Setup

Jekyll as the build system, please read through for more information: https://jekyllrb.com/

### Commands to work locally

- `gem install jekyll bundler` - Install jekyll Gem
- `jekyll serve` or `bundle exec jekyll serve` - Local Browser Instance
- `jekyll build` or `bundle exec jekyll build` - Local Build Instance

### Deployment

The HigherEducation Repository(https://github.com/HigherEducation/opm-liberty) is setup on Netlify. This deploys the master branch or current working branch to a staging/production server on git push of your commits. On deployment, Netfify runs the `jekyll build` function to minifiy and setup the static site in the `_sites` folder.

*Staging:* `https://liberty.netlify.com`
*Password:* `HE`

For access to the Netlify Dashboard, please signup with Netlify using your Github account and have Eric Rasch grant you access to the Liberty Site.


## Landing Page

*_includes*

These are the paritals of the site. Includes: footer, header, modal, widget

*_layout*

This is the html document outline, includes the body with the jekyll markdown and head tag with the meta, styles, scripts.

*_scss*

These are the site styles that get minified once you run `jekyll build` or `jekyll serve`.

*_site*

The build of the site.

*assets*

Images, JS, CSS(imports from the `_scss` directory).

*Widget*

React widget form, there are instructions on the setup in the readme.md in the folder.

*404.html, index.html*

This is the contents of the two pages using the jekyll markdown.


## Widget

React widget form, there are instructions on setup and usage in the readme.md in the folder.

