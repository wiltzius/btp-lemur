$(function() {
  var load_inmate_id = function(inmate_id) {
    console.log('loading', inmate_id);
    $.get('/lemur/inmate_search_proxy/' + inmate_id, function(results) {
      console.log(results);
      if(results.parole_single) {
        $('#paroledDate' + inmate_id).text(results.parole_single || "--");
        var parole_date = new Date(Date.parse(results.parole_single));
        var today = new Date();
        if (parole_date.getTime() < today.getTime()) {
          $('#paroledDate' + inmate_id).addClass('error');
        }
      }
      $('#parentInstitution' + inmate_id).text(results.parent_institution || "unknown");
    }, "json");
  };

  // this is populated by the inline <script> tags, old school
  if(window.inmates) {
    window.inmates.map(function(el) {
      load_inmate_id(el);
    });
  }

});
