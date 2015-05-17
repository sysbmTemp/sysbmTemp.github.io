/**
 * Created by sam on 15/5/17.
 */

+function($){

  var $maikeWrap = $('#bm_lecture_appointment_maike');
  var $maikeIframe = $maikeWrap.find('iframe');
  var maikeFormSrc = 'http://www.mikecrm.com/f.php?t=Wy66WZ';

  $(document).ready(function(){
    $maikeIframe.attr('src', maikeFormSrc);
    $maikeIframe.load( function() {
      /*$maikeIframe.contents().find('head')
        .append($("<style type='text/css'>  .f_component{padding-top: 0; padding-bottom: 0;}  </style>"));
      //$('iframe').contents().find("head")*/
      var innerDoc = window.frames['maike_appointment'].document.body.innerHTML;
      console.log(innerDoc);
    });
  })

}(jQuery);
