var $profile = $('#profile');
if ($profile.length > 0) {
  var $mask = $('<div>');
  $mask.attr('id', 'profile-mask');
  $('body').append($mask);
  $('.ovfHiden').on('touchmove', function(event) {
    if (event.cancelable) {
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
    }
  });

  function toggleProfile() {
    $profile.toggleClass('is-active');
    $mask.toggleClass('is-active');
    $("body").toggleClass("ovfHiden");
  }

  $profile.on('click', toggleProfile);
  $mask.on('click', toggleProfile);
  $('.navbar-main .navbar-profile-icon').on('click', toggleProfile);
}

$("#toc").on('click', function() {
  $("body").toggleClass("ovfHiden");
});

$("#toc-mask").on('click', function() {
  $("body").toggleClass("ovfHiden");
});

$('.navbar-main .catalogue').on('click', function() {
  $("body").toggleClass("ovfHiden");
});