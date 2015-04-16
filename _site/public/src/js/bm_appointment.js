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

  var scollHandler = function(){
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

  $(document).scroll(scollHandler);
  $(window).resize(resizeHandler);

}(jQuery);
