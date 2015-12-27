$(function() {
  var load_inmate_id = function(inmate_id) {
    console.log('loading', inmate_id);
    $.get('/lemur/inmate_search_proxy/' + inmate_id, function(results) {
      console.log(results);
      $('#paroledDate' + inmate_id).text(results.paroled_date || "unknown");
      $('#projectedParole' + inmate_id).text(results.projected_parole || "unknown");
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
