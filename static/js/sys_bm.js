/*! sys_bm - v0.0.1 - 2015-05-25
 * https://github.com/SamHwang1990/sys_bm
 * Copyright (c) 2015 samhwang1990@gmail.com;
 * Licensed 
 */
/**
 * Created by sam on 15-4-1.
 */

// logic to send ajax to duoshuo

+function($){
  'use strict';



}(jQuery);

/**
 * Created by sam on 15-4-13.
 *
 * a plugin to hack :after and :before element in ie8-
 */


+function($){
  var appendBeforeAfter = function($el){
    if(document.querySelector || !$el.length) return;

    // TODO: 虽然是给IE6、7 的hack，不一定识别before、after 这两个元素哦，如果没效果，就修改下，使用div ，并修改css
    var $before = $('<before>');
    var $after = $('<after>');
    var content = $el.attr('data-content');

    $before.html(content);
    $after.html(content);
    $el.prepend($before);
    $el.append($after);
  };

  $(document).ready(function(){
    if(document.querySelector) return;

    $('.clearFix').each(function(){
      appendBeforeAfter($(this));
    });

  });

}(jQuery);
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

/**
 * Created by sam on 15-3-31.
 */


+function($){
  var Collapse = function(element, options){
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULT, options);
    this.$trigger = $('[data-toggle="collapse"][data-target="#'+ this.$element.id + '"], ' +
    '[data-toggle="collapse"][href="#' + this.$element.id + '"]');
    this.transitioning = null;

    this.addAriaAndCollapsedClass(this.$element, this.$trigger);

    if(this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '0.0.1';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULT = {
    toggle: true
  };

  Collapse.prototype.addAriaAndCollapsedClass = function($element, $trigger){
    var isOpen = $element.hasClass('in');
    $element.attr('aria-expended', isOpen);
    $trigger.toggleClass('bm_collapsed', !isOpen).attr('aria-expended', isOpen);
  };

  Collapse.prototype.getDimension = function(){
    // a control api
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function(){
    if(this.transitioning || this.$element.hasClass('in')) return;

    var dimension = this.getDimension();
    var scrollSize = $.camelCase(['scroll', dimension].join('-'));
    var complete = function(){
      this.$element.removeClass('bm_collapsing')
        .addClass('bm_collapse in')[dimension]('');   // TODO: set the dimension property to '' can remove the style role in html element
      this.transitioning = 0;
    };

    this.transitioning = 1;

    this.$trigger
      .removeClass('bm_collapsed')
      .attr('aria-expended', true);

    this.$element
      .removeClass('bm_collapse')
      .addClass('bm_collapsing')[dimension](0)// TODO: set the dimension property to zero again to ensure the height value
      .attr('aria-expended', true);

    if(!$.support.transition) return complete.call(this);

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function(){
    if(this.transitioning || !this.$element.hasClass('in')) return;

    var dimension = this.getDimension();
    var complete = function(){
      this.transitioning = 0;
      this.$element
        .removeClass('bm_collapsing')
        .addClass('bm_collapse');
    };

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight; // force reflow

    this.$element
      .addClass('bm_collapsing')
      .removeClass('bm_collapse in')
      .attr('aria-expended', false);

    this.$trigger
      .addClass('bm_collapsed')
      .attr('aria-expended', false);

    this.transitioning = 1;

    if(!$.support.transition) return complete.call(this);

    this.$element[dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function(){
    // Bad code below
    /*var isOpen = this.$element.hasClass('in');
    return isOpen ? this.hide.call(this) : this.show.call(this);*/

    return this[this.$element.hasClass('in') ? 'hide' : 'show'].call(this);
  };

  var getTargetFromTrigger = function($trigger){
    var href;
    var target = $($trigger.attr('data-target') ||
    (href = $trigger.attr('href')) && (href.replace(/.*(?=#[^\s]+$)/, '')));
    return target;
  };

  var Plugin = function(option){
    return this.each(function(){
      var $this = $(this);
      var data = $this.data('bm.collapse');
      var options = $.extend({}, $this.data(), typeof option == 'object' && option);

      // 初始化控件有两种方式，一种是html 上配置相关属性，通过事件触发，一种是js 中触发控件函数初始化

      // 这里针对第二种初始化方法而言的
      // 如果是初始化，则data 默认是不存在的，所以用 !data
      // 如果初始化是传入的值要么是一个字符串，用来声明是‘show’ 还是 ‘hide’，要么就是一个对象
      // 如果toggle 为false，则初始化时不需要担心控件会有行为
      // 如果toggle 为true，则需要检查是否有另外显式声明行为，比如show 或 hide，则把toggle 配置为false
      if(!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if(!data) $this.data('bm.collapse', new Collapse(this, options));

      if(typeof option == 'string') data[option]();

    })
  };

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;
  $.fn.collapse.noConflict = function(){
    $.fn.collapse = old;
    return;
  };

  $(document).on('click.bm.collapse.data-api', '[data-toggle=collapse]', function(e){
    var $this = $(this);
    var $target;
    var data;
    var options;

    // 如果使用href 属性来配置target 则要停止事件的默认行为
    if(!$this.attr('data-target')) e.preventDefault();

    $target = getTargetFromTrigger($this);
    data = $target.data('bm.collapse');
    options = data ? 'toggle' : $this.data();

    Plugin.call($target, options);

  })


}(jQuery);

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
/**
 * Created by sam on 15-4-14.
 */

+function($){
  'use strict';
  $(document).ready(function(){
    var $caution = $('#bm_caution');
    var $maike = $('#bm_maike');

    $caution.find('[role="ReadedCaution"]').bind('click', function(e){
      $caution.hide('fast', function(){
        $maike.show('fast');
      });
    });
  });

}(jQuery);
/**
 * Created by sam on 15/5/17.
 */

+function($){

  var $maikeWrap = $('#bm_maike');
  var $maikeLoading = $maikeWrap.find('p.loading');
  var $maikeIframe = $maikeWrap.find('iframe');
  var maikeFormSrc = 'http://www.mikecrm.com/f.php?t=Wy66WZ';

  $(document).ready(function(){
    $maikeIframe.attr('src', maikeFormSrc);
    $maikeIframe.load(function(){
      $maikeLoading.hide('fast', function(){
        $maikeIframe.show('fast');
      });
    })
  })

}(jQuery);

/**
 * Created by sam on 15-3-30.
 */


+function($){
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bm');

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one($.support.transition.end, function () { called = true });
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) };
    setTimeout(callback, duration);
    return this;
  }

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;
  })
}(jQuery);