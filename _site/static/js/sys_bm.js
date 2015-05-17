/*! sys_bm - v0.0.1 - 2015-05-17
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
 * Created by sam on 15-4-11.
 */

+function($){
  'use strict';

  var Appointment = function(element, options){
    this.$element = $(element);
    this.options = $.extend({}, Appointment.DEFAULT, options);
    this.$appointment = this.$element.find('.bm_appointment_trigger').eq(0);

    this.offsetRight = null;
    this.offsetLeft = null;
    this.offsetTop = null;

    if(this.options.fix) this.initOffset().setOffset();
  };

  Appointment.VERSION = '0.0.1';

  Appointment.DEFAULT = {
    direction: 'right',
    fix: true
  };

  Appointment.prototype.initOffset = function(){
    this.options.direction == 'right'
      ? (this.offsetRight = $(window).width() - (this.$element.offset().left + this.$element.outerWidth()))
      : (this.offsetLeft = this.$element.offset().left);
    this.offsetTop = this.$element.offset().top;
    return this;
  };

  Appointment.prototype.setOffset = function(){
    if($(document).scrollTop() > this.offsetTop){
      this.$appointment.css({
        'position':'fixed',
        'right':(this.options.direction == 'right' ? this.offsetRight : 'auto'),
        'left':(this.options.direction == 'right' ? 'auto' : this.offsetLeft),
        'top':'10px'})
    }else{
      this.$appointment.css({
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
      if(!data) $this.data('bm.appointment', (data = new Appointment(this, options)));

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
    $('[data-appointment="true"]').each(function(){
      var $appointment = $(this);
      var options = $.extend({}, $appointment.data());
      options.action = 'scroll';

      Plugin.call($appointment, options);
    })
  };

  var resizeHandler = function(){
    $('[data-appointment="true"]').each(function(){
      var $appointment = $(this);
      var options = $.extend({}, $appointment.data());
      options.action = 'resize';

      Plugin.call($appointment, options);
    })
  };

  var old = $.fn.appointment;
  $.fn.appointment = Plugin;
  $.fn.appointment.Constructor = Appointment;
  $.fn.appointment.notConflict = function(){
    $.fn.appointment = old;
    return;
  }

  $(window).on('load', function(){
    $('[data-appointment="true"]').each(function(){
      var $appointment = $(this);
      Plugin.call($appointment, $appointment.data());
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

  var appointmentHack = function(){
    this.$rootElement = null;
    this.$caution = null;
    this.$form = null;
    this.isIE6 = false;
    this.currentStep = '';
  };

  appointmentHack.init = function(){
    var isIE6 = navigator.userAgent.indexOf("MSIE 6.0") !== -1 ;
    return isIE6 ? new appointmentHack() : false;
    //return new appointmentHack();
  };

  appointmentHack.prototype.setup = function(){
    var that = this;
    this.$caution = {
      $el: $('#bm_lecture_caution'),
      currentStep: 'caution'
    };
    this.$caution.$next = this.$caution.$el.find('a[rel="bm-modal-ie6"]');

    this.$form = {
      $el: $('#bm_lecture_appointment_form'),
      currentStep: 'form'
    };
    this.$form.$prev = this.$form.$el.find('a[rel="bm-modal-ie6"]');

    that.$caution.$next.bind('click.bm.modal.ie6', function(e){
      e.preventDefault();
      that.to(that.currentStep, that.$form.currentStep);

      return false;
    });

    that.$form.$prev.bind('click.bm.modal.ie6', function(e){
      e.preventDefault();

      that.to(that.currentStep, that.$caution.currentStep);

      return false;
    });

    this.to(this.currentStep, this.$caution.currentStep);

  };

  appointmentHack.prototype.to = function(fromStep, toStep){
    if(fromStep) this.hide(fromStep);
    if(toStep || (toStep='Form')) this.show(toStep);
    this.currentStep = toStep;
  };

  appointmentHack.prototype.hide = function(step){
    return this['$' + step].$el.hide();
  };

  appointmentHack.prototype.show = function(step){
    return this['$' + step].$el.show();
  };

  $(document).ready(function(){
    var aH = appointmentHack.init();
    if(!aH) return false;
    aH.setup();
  });

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
 * Created by sam on 15-4-12.
 */


+function($){
  'use strict';

  var bmDuoshuo = function(formEl, config){
    this.$form = $(formEl);
    this.config = $.extend({}, bmDuoshuo.CONFIG, typeof config == 'object' && config);
    this.intervalArray = [];
    this.config.successCode = 0;
    this.config.short_name = 'sysbmtest';
    this.config.secret = '35fd76467164cdf595a9c788d86cb377';
    this.config.threadKey = this.$form.find('.bm_form_title').eq(0).text();
    this.config.author = this.$form.find('.bm_form_author').eq(0).text();
    this.config.url = this.$form.find('.bm_form_url').eq(0).text();
    this.config.isIE6 = navigator.userAgent.indexOf("MSIE 6.0") !== -1 ;

    this.$feedbackEle = $('#bm_lecture_appointment_feedback');
    this.config.feedback = {
      successClass: 'success',
      errorClass: 'wrong',
      closeCountdown: 5 // second
    };

    this.$form.on('submit.bm.duoshuo', $.proxy(this.submit, this));
  };

  bmDuoshuo.CONFIG = {
    api: {
      json: 'http://sysbmtest.duoshuo.com/posts/create.json',
      jsonp: 'http://sysbmtest.duoshuo.com/posts/create.jsonp'
    },
    shortName: null,
    secret: null,
    message: null,
    method: 'POST',
    successHandler: null,
    errorHandler: null,
    wrongInputClass: 'bm_form_errorInput'
  };

  bmDuoshuo.prototype.submit = function(e){
    e.preventDefault();
    var that = this;

    // TODO: can not send ajax to duoshuo, so just test the feedback function first
    if(!this.checkInput()) return false;
    this.sendAjax(this.collectInput());

    //this.checkInput() && this.success.call(this);
    return false;
  };

  bmDuoshuo.prototype.clearInterval = function(){
    if(!this.intervalArray.length) return;
    var intervalTmp = this.intervalArray.pop();
    clearInterval(intervalTmp);
    return this.clearInterval.call(this);
  };

  bmDuoshuo.prototype.checkInput = function(){
    var that = this;
    var wrongFlag = false;
    var checkResult = false;
    var wrongMsg = '内容不能为空！';
    this.clearInterval();
    this.$form.find('.bm_form_group').each(function(){
      var $label = $(this).find('label');
      var $input = $(this).find('input.bm_form_control');
      if(!$input.val()){
        !wrongFlag && (wrongFlag = true);
        that.wrongInput($input, wrongMsg);
      }
    });
    !wrongFlag && (checkResult = true);
    return checkResult;
  };

  bmDuoshuo.prototype.wrongInput = function($wrongElement, wrongMessage){
    var that = this;
    $wrongElement.addClass(this.config.wrongInputClass);
    $wrongElement.attr('placeholder', wrongMessage);
    var interval = setInterval(function(){
      $wrongElement.removeClass(that.config.wrongInputClass);
    }, 2000);
    this.intervalArray.push(interval);
    return;
  };

  bmDuoshuo.prototype.collectInput = function(){
    var that = this;
    var message = '';

    message += "讲座名称：" + this.config.threadKey + '\n';
    message += "主讲人：" + this.config.author + '\n';
    message += "文章链接：" + this.config.url + '\n';

    this.$form.find('.bm_form_group').each(function(){
      var $label = $(this).find('label');
      var $input = $(this).find('input.bm_form_control');
      var msgTmp = $label.text() + '：' + $input.val() + '\n';
      message += msgTmp;
    });
    return message;
  };

  bmDuoshuo.prototype.sendAjax = function(message){
    var that = this;

    // use jsonp
    /*var url = that.config.api.jsonp + '?';
    url += 'short_name=' + this.config.short_name
    + '&'
    + 'secret=' + this.config.secret
    + '&'
    + 'message=' + message
    + '&'
    + 'thread_key=' + this.config.threadKey
    + '&'
    + 'author_name=' + this.config.author
    + '&'
    + 'author_email=' + "funnyecho@foxmail.com";*/

    var ajaxData = {
      'short_name': that.config.short_name,
      'secret': that.config.secret,
      'message': message,
      'thread_key': that.config.threadKey,
      'author_name': that.config.author,
      'author_email': "funnyecho@foxmail.com"
    };
    $.ajax({
      url: that.config.api.jsonp,
      crossDomain: true,

      // The name of the callback parameter, as specified by the YQL service
      // jsonp: "callback",
      type: 'GET',

      // Tell jQuery we're expecting JSONP
      dataType: "jsonp",
      contentType: "application/json; charset=utf-8",

      // have problem in IE8-
      data: ajaxData,

      // Work with the response
      success: function(response){
        console.log(response);
      },
      error: function(error){
        console.log(error);
      }
    });
  };

  bmDuoshuo.prototype.success = function(response){
    //console.log(response);
    var message = "预约成功，我方会尽快安排，并与您沟通联系，感谢您的预约！";
    this.$feedbackEle.find('.fb_message').addClass(this.config.feedback.successClass).text(message);
    this.handlerFbModal();
  };

  bmDuoshuo.prototype.error = function(response){
    //console.log(response);
    var message = "预约失败，请稍后再次尝试，或者联系管理员。感谢您的支持！";
    this.$feedbackEle.find('.fb_message').addClass(this.config.feedback.errorClass).text(message);
    this.handlerFbModal();
  };

  bmDuoshuo.prototype.handlerFbModal = function(fbType){
    var $fbCloseBtn = this.$feedbackEle.find('.fb_closeBtn');
    var $fbCloseCountdown = this.$feedbackEle.find('.fb_closeCountdown');
    var fbCloseCountdown = this.config.feedback.closeCountdown;

    // init the $fbCloseCountdown text
    $fbCloseCountdown.text(fbCloseCountdown);

    // 需要引入jquery.modal 控件
    if(!this.config.isIE6 && $.modal){
      this.$feedbackEle.modal();
      var closeInterval = setInterval(function(){
        if(fbCloseCountdown <= 1){
          clearInterval(closeInterval);
          $fbCloseBtn.trigger('click.modal');
        }
        $fbCloseCountdown.text(--fbCloseCountdown);
      }, 1000);
    }else{
      alert(this.$feedbackEle.find('.fb_message').text());
    }
  };

  var initModule = function(config){
    return this.each(function(){
      var $this = $(this);
      var data = $this.data('bm.duoshuo');
      var configs = $.extend({}, $this.data(), typeof config == 'object' && config);

      if(!data) $this.data('bm.duoshuo', (data = new bmDuoshuo(this, configs)));
    });
  };

  $(window).on('load', function(){
    $('form[data-duosho="true"]').each(function(){
      var $element = $(this);
      var data = $element.data();
      initModule.call($element, data);
    });
  });


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