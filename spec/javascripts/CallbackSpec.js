describe("Callback", function(){

  var Callback     = com.jivatechnology.Callback;
  var CallbackList = com.jivatechnology.CallbackList;

  var must_keep     = function(){ return true;  };
  var must_not_keep = function(){ return false; };
  var func          = function(){ };

  describe("initialization", function(){

    it("should raise error if no function is supplied", function(){
      expect(function(){ new Callback({}); }).toThrow("Callback created without a func");
    });

    it("should setup must_keep", function(){
      var subject = new Callback({func: func, must_keep: must_keep});

      expect(subject.must_keep()).toBe(must_keep());
    });

    it("should default must_keep to a function that returns false", function(){
      var subject = new Callback({func: func});

      expect(subject.must_keep()).toBe(false);
    });

    it("should convert must_keep value to function", function(){
      var subject = new Callback({func: func, must_keep: true});

      expect(subject.must_keep()).toBe(true);

      subject = new Callback({func: func, must_keep: false});

      expect(subject.must_keep()).toBe(false);
    });

  });


  describe("the function func", function(){
    it("should call func", function(){
      var function_called = false;

      var func = function(){ function_called = true; };
      subject = new Callback({func: func});

      subject.func();

      expect( function_called ).toEqual(true);
    });

    it("should call func with 'this' set correctly", function(){
      var function_called = false;

      var func = function(){ function_called = this.misc; };
      var subject = new Callback({func: func, misc: "hello"});

      subject.func();

      expect(function_called).toEqual("hello");
    });

    it("should pass extra parameters", function(){
      var result1, result2, result3;
      var func = function(one,two,three){
        result1 = one;
        result2 = two;
        result3 = three;
      };
      var subject = new Callback({func: func});

      subject.func("first", "second", "third");

      expect(result1).toEqual("first");
      expect(result2).toEqual("second");
      expect(result3).toEqual("third");
    });

  });

  describe("the function must_keep", function(){

    it("should call must_keep with 'this' set correctly", function(){
      var subject = new Callback({
        hello:     "hi",
        func:      func,
        must_keep: function(){ return this.hello; }
      });

      expect( subject.must_keep() ).toEqual( "hi" );
    });

  });

});
