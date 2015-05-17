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
