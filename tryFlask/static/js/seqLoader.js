//$('#seqFile').bind('change', function () {
function loaded(){
  var filename = $("#seqFile").val();
  console.log(filename);
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass('active');
    $("#noFile").text("No file chosen..."); 
  }
  else {
    $(".file-upload").addClass('active');
    //$("#noFile").text(filename);
    $("#noFile").text(filename.replace("C:\\fakepath\\", "")); 

        var form_data = new FormData($('#seqFile')[0]);
        console.log(form_data);
        $.ajax({
            type: 'POST',
            url: '/uploadajax',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: false,
            success: function(data) {
                console.log('Success!');
            },
        });
  }
}


