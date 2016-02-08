function addSong() {

  var youtube_key = "AIzaSyC_rY-ddTXByzTrJcNhUA5bob3M1BKPaQU"

  var vid = document.getElementById("submit_box").value;
  var button = document.getElementById("submit_button");

  if (vid === "") { // don't add accidental clicks
    return;
  }

  document.getElementById("submit_box").value = ""; //clear input box


  var vid_id = getParameterByName("v", vid);

  var youtube_url = "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id=" + vid_id + "&key=" + youtube_key;

  //var url = "http://localhost:7821/song";
  //var url = "http://www.google.com";

  jQuery.ajax({
    type: "GET",
    url: youtube_url,
    success : function(data) {
      $( "#p_table" ).append( "<tr><td><button class=song_select type=button onclick=playSong('" + vid_id + "')>" + data.items[0].snippet.title + "</button></tr></td>" );
      $( "#secret_table" ).append( "<tr><td>" + vid_id + "</tr></td>" );
    }
  });

}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function playSong(vid_id) {

  document.getElementById("vidbox").style.display = "block";

  player.loadVideoById(vid_id);

}
