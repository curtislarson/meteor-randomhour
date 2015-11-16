// From https://gist.github.com/tanepiper/4215634
HighResolutionTimer = (function() {
 
  var HighResolutionTimer = function(options) {
    this.timer = false;
 
    this.total_ticks = 0;
 
    this.start_time = undefined;
    this.current_time = undefined;
 
    this.duration = (options.duration) ? options.duration : 1000;
    this.callback = (options.callback) ? options.callback : function() {};
 
    this.run = function() {
      this.current_time = Date.now();
      if (!this.start_time) { this.start_time = this.current_time; }
      
      this.callback(this);
 
      var nextTick = this.duration - (this.current_time - (this.start_time + (this.total_ticks * this.duration) ) );
      this.total_ticks++;
 
      (function(i) {
        i.timer = setTimeout(function() {
          i.run();
        }, nextTick);
      }(this));
 
      return this;
    };
 
    this.stop = function(){
      clearTimeout(this.timer);
      return this;
    };
    
    return this;
  };
 
  return HighResolutionTimer;
 
}());