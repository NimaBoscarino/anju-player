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

  /*
  var message = {
    "video":vid,
    "title":youtube_response
  }

  var message_json = JSON.stringify(message);
  /*
  jQuery.ajax({
    type: "POST",
    url: url,
    data: message_json,
    dataType:"json",
  });
  */

  //playSong(vid_id);

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

  var youtube_head = "https://www.youtube.com/embed/"
  var youtube_tail = "?autoplay=1&showinfo=0"

  var url = youtube_head + vid_id + youtube_tail;

  $( "iframe" ).attr("src", url);

}
