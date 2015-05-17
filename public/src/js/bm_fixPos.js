/**
 * Created by sam on 15-4-11.
 */

+function($){
  'use strict';

  var FixPos = function(element, options){
    this.$element = $(element);
    this.options = $.extend({}, FixPos.DEFAULT, options);
    this.$target = this.$element.find('[data-fixPosTarget="true"]').eq(0);

    this.offsetRight = null;
    this.offsetLeft = null;
    this.offsetTop = null;

    if(this.options.fix) this.initOffset().setOffset();
  };

  FixPos.VERSION = '0.0.1';

  FixPos.DEFAULT = {
    direction: 'right',
    fix: true
  };

  FixPos.prototype.initOffset = function(){
    this.options.direction == 'right'
      ? (this.offsetRight = $(window).width() - (this.$element.offset().left + this.$element.outerWidth()))
      : (this.offsetLeft = this.$element.offset().left);
    this.offsetTop = this.$element.offset().top;
    return this;
  };

  FixPos.prototype.setOffset = function(){
    if($(document).scrollTop() > this.offsetTop){
      this.$target.css({
        'position':'fixed',
        'right':(this.options.direction == 'right' ? this.offsetRight : 'auto'),
        'left':(this.options.direction == 'right' ? 'auto' : this.offsetLeft),
        'top':'10px'})
    }else{
      this.$target.css({
        'position':'absolute',
        'right':(this.options.direction == 'right' ? 0 : 'auto'),
        'left':(this.options.direction == 'right' ? 'auto' : 0),
        'top':'10px'})
    }
  };

  var Plugin = function(option){
    return this.each(function(){
      var $this = $(this);
      var data = $this.data('bm.appointment');
      var options = $.extend({}, $this.data(), typeof option == 'object' && option);
      if(!data && !options.fix) return false;
      if(!data) $this.data('bm.appointment', (data = new FixPos(this, options)));

      if(data.options.fix){
        if(options.action == 'resize'){
          data.initOffset().setOffset();
        }
        else if(options.action == 'scroll'){
          data.setOffset();
        }
      }
    })
  };

  var scrollHandler = function(){
    $('[data-fixPos="true"]').each(function(){
      var $target = $(this);
      var options = $.extend({}, $target.data());
      options.action = 'scroll';

      Plugin.call($target, options);
    })
  };

  var resizeHandler = function(){
    $('[data-fixPos="true"]').each(function(){
      var $target = $(this);
      var options = $.extend({}, $target.data());
      options.action = 'resize';

      Plugin.call($target, options);
    })
  };

  var old = $.fn.bmFixPos;
  $.fn.bmFixPos = Plugin;
  $.fn.bmFixPos.Constructor = FixPos;
  $.fn.bmFixPos.notConflict = function(){
    $.fn.bmFixPos = old;
    return;
  }

  $(window).on('load', function(){
    $('[data-fixPos="true"]').each(function(){
      var $wrap = $(this);
      Plugin.call($wrap, $wrap.data());
    })
  });

  $(document).scroll(scrollHandler);
  $(window).resize(resizeHandler);

}(jQuery);