Callback [![Build status](https://secure.travis-ci.org/theozaurus/callback-js.png)](http://travis-ci.org/theozaurus/callback-js)
========

[Callback.js](http://github.com/theozaurus/callback-js) is a slim library that
aims to make it easy to add more advanced callback functionality to Javascript
projects.

It supports features such as adding multiple callbacks, and the ability to
control whether a callback is temporary or permanent.

Usage
=====

In order to avoid any namespace conflicts `Callback` uses the public namespace
`com.jivatechnology` (reverse DNS scheme). You can import this into your local
scope with something like:

    var Callback     = com.jivatechnology.Callback;
    var CallbackList = com.jivatechnology.CallbackList;

If we want to add callback functionality to our app we can do so using the
`CallbackList`. Here's some examples to get you started.

    # Create a new callback list
    var callbacks = new CallbackList();

    # Add a callback
    callbacks.add(function(){
      console.info("I'll be run later");
    });

    # Add another callback
    callbacks.add(function(a,b,c){
      console.info("I can also deal with arbitary arguments",a,b,c);
    });

    # When we want to run our callbacks
    callbacks.handle("a","b","c");

    # We can also remove all callbacks
    callbacks.clear();

    # Inspect how many callbacks we have
    callbacks.size();
    => 0

    # Add multiple callbacks
    callbacks.add([function(){ console.info("1"); }, function(){ console.info("2")}])
    callbacks.size();
    => 2

It is also possible to deal with the lifecycle of callback. By default they are
only ever run once:

    # Create a new callback list
    var callbacks = new CallbackList();

    # Add a callback
    callbacks.add(function(){
      console.info("I'll be run later");
    });

    callbacks.size();
    => 1

    callbacks.handle();
    callbacks.size();
    => 0

We can add a permanent one by doing this:

    var callback = new Callback({
      func: function(){ console.info("I'll always stay") },
      must_keep: true
    });

    callbacks.add(callback);

    callbacks.size();
    => 1

    callbacks.handle();
    callbacks.size();
    => 1

Or we could have more sophisticated logic for keeping callbacks:

    var callbacks = new CallbackList();

    var callback = new Callback({
      i: 0,
      max: 4,
      func: function(){
        this.i++;
        console.info("I've run " + this.i + " out of " + this.max + " times");
      },
      must_keep: function(){
        return this.i < this.max;
      }
    });

    callbacks.add(callback);

    callbacks.handle(); callbacks.size()
    => 1
    callbacks.handle(); callbacks.size()
    => 1
    callbacks.handle(); callbacks.size()
    => 1
    callbacks.handle(); callbacks.size()
    => 1
    callbacks.handle(); callbacks.size()
    => 0

We can also add callbacks when creating the callback list:

    var callbacks = new CallbackList(function(){ console.info("Hello") });
    callbacks.size()
    => 1

    var callbacks = new CallbackList([function(){},function(){}]);
    callbacks.size()
    => 2

Tests
=====

All of the tests are written in [Jasmine](http://pivotal.github.com/jasmine/).
To run the tests, you will first need to install [Ruby](http://ruby-lang.org)
and [Bundler](http://gembundler.com/). Once you have this:

    $ bundle install
    $ rake jasmine

Open your browser to [http://localhost:8888](http://localhost:8888)

If you want to run the tests directly in the console just type:

    $ rake jasmine:ci
    /Users/theo/.rvm/rubies/ruby-1.9.3-p0/bin/ruby -S rspec spec/javascripts/support/jasmine_runner.rb --colour --format progress
    [2012-03-15 15:46:50] INFO  WEBrick 1.3.1
    [2012-03-15 15:46:50] INFO  ruby 1.9.3 (2011-10-30) [x86_64-darwin11.1.0]
    [2012-03-15 15:46:50] INFO  WEBrick::HTTPServer#start: pid=39919 port=63714
    Waiting for jasmine server on 63714...
    jasmine server started.
    Waiting for suite to finish in browser ...
    ..........................................

Or you can check the current status of master using [Travis](http://travis-ci.org/#!/theozaurus/callback-js)
