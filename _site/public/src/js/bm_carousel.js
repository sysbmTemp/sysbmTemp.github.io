/**
 * Created by sam on 15-3-28.
 */

+function($){
  'use strict';

  var Carousel = function(element, options){
    this.$element = $(element);   // 根元素
    this.$indicators = this.$element.find('.bm_carousel_indicators');
    this.options = options;     // Carousel 配置选项，options 对象的属性包含Carousel.DEFAULT 的属性
    this.$items = null;         // Carousel 所有内容条目
    this.$active = null;        // Carousel 当前激活的内容条目
    this.paused = null;         // 控件是否处于停止状态
    this.sliding = null;        // 控件是否处于滑动状态
    this.interval = null;       // interval 对象，setInterval 返回，并用于clearInterval

    this.options.pause == 'hover' &&
    !('ontouchstart' in document.documentElement) &&
    this.$element.on('mouseenter.bm.carousel', $.proxy(this.pause, this))
                 .on('mouseleave.bm.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '0.0.1';

  Carousel.TRANSITION_DURATION = 600;   // 单位是ms，用于控制滑动时长

  Carousel.DEFAULT = {
    interval: 5000,     // 用于控制滑动间隔，单位是ms
    pause: 'hover',     // 哪种类型的用户行为会暂停滑动
    wrap: true,         // 用于控制是否循环滑动
    keyboard: false     // 用户控制是否启用键盘控制
  };

  Carousel.prototype.getItemIndex = function(item){
    this.$items = $(item).parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function(direction, active){
    var activeIndex = this.getItemIndex(active);
    var willWrap = (direction == 'prev' && activeIndex === 0) ||
                    (direction == 'next' && activeIndex === this.$items.length -1);
    if(willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (delta + activeIndex) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.pause = function(e){
    e || (this.paused = true);

    this.interval = clearInterval(this.interval);
    return this;
  };

  Carousel.prototype.cycle = function(e){
    e || (this.paused = false);

    this.interval = clearInterval(this.interval);

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.next = function(){
    if(this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function(){
    if(this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.to = function(pos){
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if(pos > this.$items.length -1 || pos < 0) return;

    // 如果还在滑动状态，那就监听after 事件，等滑动结束后再次尝试调用to 方法
    // after 事件的激发是在slide 方法中的
    if(this.sliding) return this.$element.one('carousel.slide.after', function(){that.to(pos);});

    if(pos === activeIndex) return this.pause().cycle();

    return this.slide((pos > activeIndex) ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.slide = function(type, next){
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'prev' ? 'right' : 'left';
    var that = this;

    if($next.hasClass('active')) return this.sliding = false;

    this.sliding = true;

    var relatedTarget = $next[0];

    isCycling && this.pause();

    if(this.$indicators.length){
      this.$indicators.find('.active').removeClass('active');
      var nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      nextIndicator && nextIndicator.addClass('active');
    }

    var slideEvent = $.Event('carousel.slide.after', {relatedTarget: relatedTarget, direction: direction});
    if($.support.transition && this.$element.hasClass('slide')){
      $next.addClass(type);
      $next[0].offsetWidth; // force reflow
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one($.support.transition.end, function(e){
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function(){
          that.$element.trigger(slideEvent);
        }, 0)
      })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    }else{
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
    }

    isCycling && this.cycle();
  };

  function Plugin(option){
    var $this = $(this);
    var data = $this.data('bm.carousel');
    var options = $.extend({}, Carousel.DEFAULT, $this.data(), typeof option == 'object' && option);

    if(!data) $this.data('bm.carousel', (data = new Carousel(this, options)));

    // Plugin 的行为初始化有三种方式：
    // 1. 指定插件的动作，prev 或者 next，用来响应点击事件
    // 2. 上面两种都没有的话，就进入自循环模式，用于插件初始化使用
    if(options.action) {
      data[options.action]();
    }
    else if(options.interval) {
      data.pause().cycle();
    }else if(options.slideIndex){
      data.to(options.slideIndex);
    }
    return;
  }

  var oldPlugin = $.fn.carousel;
  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;
  $.fn.carousel.notConflict = function(){
    $.fn.carousel = oldPlugin;
    return ;
  };

  var clickHandle = function(e){
    var href;
    var $this = $(this);
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''));
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if(slideIndex) {
      options.interval = false;
      options.action = false;
      options.slideIndex = slideIndex;
    }else{
      options.action = $this.attr('data-slide');
      options.slideIndex = false;
    }

    Plugin.call($target, options);

    e.preventDefault();
  };

  $(document)
    .on('click.bm.carousel.data-api', '[data-slide]', clickHandle)
    .on('click.bm.carousel.data-api', '[data-slide-to]', clickHandle);

  $(window).on('load', function(){
    $('[data-ride="carousel"]').each(function(){
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    })
  });


}(jQuery);
