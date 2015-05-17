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