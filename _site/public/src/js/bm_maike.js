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
