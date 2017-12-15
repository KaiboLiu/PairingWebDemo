function filterCity(){
  var province = $("#province").find('option:selected').text(); // stores province
  $("#option-container").children().appendTo("#city"); // moves <option> contained in #option-container back to their <select>
  var toMove = $("#city").children("[data-c1!='"+province+"']"); // selects city elements to move out
  toMove.appendTo("#option-container"); // moves city elements in #option-container
  $("#city").removeAttr("disabled"); // enables select
}