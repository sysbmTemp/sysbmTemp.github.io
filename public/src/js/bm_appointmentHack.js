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