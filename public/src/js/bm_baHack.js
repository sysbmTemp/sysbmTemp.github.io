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