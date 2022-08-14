# CSVConf.com

A static site, [http://csvconf.com/](http://csvconf.com).

Forked from [martini](https://github.com/codegangsta/martini) gh-pages branch.

## Develop

This is a [Jekyll](https://github.com/jekyll/jekyll) site!

Requirements:

To work on the CSVConf site locally, you'll first need to have the following installed:

- [Ruby 2.7](https://www.ruby-lang.org/en/)
- [Bundler](http://bundler.io/)

Once that's taken care of, here are the steps necessary to get it running locally:

1. clone this repository and `cd` into the `csvconf.com` directory
1. run the `bundle` command
1. run `bundle exec jekyll serve -w`

If everything worked, you should now have a local server running at http://localhost:4000. The `w` flag means the server will watch for changes and rebuild, so you can edit the site as needed and see the updated version in your browser right away.

## Instalation notes

The current site is only compatible with Ruby 2.7.1.

Using `apt` on Ubuntu 22.04 will install Ruby 3.0, to install a previous version you can use the following instructions:

```bash
# Install rbenv in your home directory
$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv

# Add it to your PATH variable
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ exec $SHELL

# Install ruby-build plugin
$ git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build

# Install Ruby 2.7
$ rbenv install 2.7.1
$ rbenv global 2.7.1

# Check the correct install
$ ruby -v

# Install bundler
$ gem install bundler
$ rbenv rehash

```

## License

[MIT](LICENSE)
