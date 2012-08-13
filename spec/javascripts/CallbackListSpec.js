describe("CallbackListSpec", function(){

  var Callback     = com.jivatechnology.Callback;
  var CallbackList = com.jivatechnology.CallbackList;

  var subject;

  var match = function(){};

  var bare_callback_factory = function(){
    return function(){};
  };

  var callback_factory = function(){
    return new Callback({func: bare_callback_factory()});
  };

  beforeEach(function(){
    subject = new CallbackList();
  });

  describe("add", function(){

    it("should allow adding of one bare callback", function(){
      var bare_callback = bare_callback_factory();

      subject.add(bare_callback);

      expect(subject.size()).toEqual(1);
    });

    it("should allow adding of an array of bare callbacks", function(){
      var bare_callbacks = [bare_callback_factory(),bare_callback_factory()];

      subject.add(bare_callbacks);

      expect(subject.size()).toEqual(2);
    });

    it("should allow adding of one callback", function(){
      var callback = callback_factory();

      subject.add(callback);

      expect(subject.size()).toEqual(1);
    });

    it("should allow adding of an array of callbacks", function(){
      var callback1 = callback_factory();
      var callback2 = callback_factory();

      subject.add([callback1,callback2]);

      expect(subject.size()).toEqual(2);
    });

  });

  describe("clear", function(){
    it("should clear all callbacks", function(){
      var callback1 = bare_callback_factory();
      var callback2 = bare_callback_factory();
      subject.add(callback1);
      subject.add(callback2);

      expect(subject.size()).toEqual(2);

      subject.clear();

      expect(subject.size()).toEqual(0);
    });
  });

  describe("handle", function(){

    it("should run callbacks", function(){
      var ran1 = false;
      var ran2 = false;
      subject.add( function(){ ran1 = true; } );
      subject.add( function(){ ran2 = true; } );

      subject.handle();

      expect(ran1).toEqual( true );
      expect(ran2).toEqual( true );
    });

    it("should execute callback with correct this value", function(){
      var result;
      var callback = new Callback({i: 5, func: function(){ result = this.i; } });

      subject.add(callback);

      subject.handle();

      expect(result).toEqual(5);
    });

    it("should pass correct arguments to callback", function(){
      var first, second, third, fourth = false;

      // Override the callbacks handle function with our mock
      var func = function(extra1,extra2,extra3){
        first  = extra1;
        second = extra2;
        third  = extra3;
      };

      var callback = new Callback({func: func});

      subject.add(callback);

      subject.handle("one","two","three");

      expect( first  ).toEqual("one");
      expect( second ).toEqual("two");
      expect( third  ).toEqual("three");
    });

    it("should remove callback if must_keep returns false", function(){
      var alive = null;

      var callback = new Callback({func: function(){alive = true;}, must_keep: false});

      // Register callback
      subject.add(callback);

      // Size increase, alive not affected
      expect(subject.size()).toEqual(1);
      expect(alive).toBeNull();

      // Callback run
      subject.handle();

      // Size decrease and alive set
      expect(subject.size()).toEqual(0);
      expect(alive).toEqual(true);

      // Reset alive
      alive = false;

      // Callback run
      subject.handle();

      // alive not touched
      expect(alive).toEqual(false);
    });

    it("should not remove callback if must_keep returns true", function(){
      var alive = null;

      var callback = new Callback({func: function(){alive = true;}, must_keep: true});

      // Register callback
      subject.add(callback);

      // Size increase, alive not affected
      expect(subject.size()).toEqual(1);
      expect(alive).toBeNull();

      // Callback run
      subject.handle();

      // Size remains constant and alive set
      expect(subject.size()).toEqual(1);
      expect(alive).toEqual(true);

      // Reset alive
      alive = false;

      // Callback run
      subject.handle();

      // alive not touched
      expect(alive).toEqual(true);
    });

  });

});
