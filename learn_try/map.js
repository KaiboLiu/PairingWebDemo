$description = $(".description");

  $('.enabled').hover(function() {
    
    //$(this).attr("class", "enabled heyo");
    $description.addClass('active');
    $description.html($(this).attr('id'));
    console.log($description.html());
  }, function() {
    $description.removeClass('active');
  });

$(document).on('mousemove', function(e){  
  $description.css({
    left:  e.pageX,
    top:   e.pageY - 70
  });
});