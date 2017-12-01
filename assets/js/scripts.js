/**
 * Event: JS Toggle
 */
(function($) {

  // Event: JS Toggle
  $('body').on('click', '.js-toggle', function() {
    var $this = $(this);

    // If toggles body class using data-bodyclass
    if ($this.attr('data-bodyclass')) {
      $('body').toggleClass($this.data('bodyclass'));
    }

    // If toggles body class using data-bodyclass
    if ($this.attr('data-modal')) {
      $('[id^="modal-"]').hide();
      $('#modal-' + $this.data('modal')).show();
    }

    // Toggle closest .js-target
    $this.closest('.js-target').toggleClass('is-active');
  });

})(jQuery);



/**
 * Event: Scroll To
 */
(function($) {

  $('#js-top').click(function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: 0}, 1000);
  });

  $('.js-scroll-trigger').click(function(e) {
    e.preventDefault();
    var targetPosition = $('.js-scroll-target' + $(this).attr('href')).offset().top;
    var topOffset      = $(window).width() >= 980 ? 0 : $('.site-header').height();
    
    $('html, body').animate({scrollTop: targetPosition - topOffset}, 1000);
  });

})(jQuery);


/**
 * Event: Sticky Navigation
 */
(function($) {

  $('#programs').waypoint({
    handler: function(direction) {


      if (direction == 'down') {
        $('body').addClass('is-nav-active');

        // setTimeout(function(){
        //   $('.nav-primary').addClass('slideIn');
        // }, 1000);
      } else {
        $('body').removeClass('is-nav-active');

        // setTimeout(function(){
        //   $('.nav-primary').removeClass('slideIn');
        // }, 1000);
      }
    }
  });

})(jQuery);