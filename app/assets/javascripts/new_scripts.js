

/**
  Important constants and variables
**/

var youtube_key = "AIzaSyC_rY-ddTXByzTrJcNhUA5bob3M1BKPaQU";
var youtube_head = "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id=";
var playlist = {};
playlist.name = "";
playlist.queue = [];
var current_index;
var playing ;

function song(title, id) {
  this.title = title;
  this.id = id;
}


/**
  Youtube iframe setup
**/

//from Youtube's iframe api website

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var done = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: '',
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}


//Autoplay next song
function onPlayerStateChange(event) {

  switch(event.data) {
    case 0:
      if (current_index + 1 === playlist.queue.length ) {
        current_index = 0;
        var vid_id = playlist.queue[current_index].id;
        player.loadVideoById(vid_id);
      } else {

        current_index = current_index + 1;
        var vid_id = playlist.queue[current_index].id;
        player.loadVideoById(vid_id);

      }
      break;
    case 1:
      playing = true;
      break;
    case 2:
      playing = false;
      break;

  }
}


////////////////////////


$( document ).ready(function() {

  $("#action_part").hide(); // because this part should slide down or up later

  //When adding a song
  $( "#add" ).click(function() {
    var input_URL = $('#input_box').val();
    var vid_id = getParameterByName("v", input_URL);
    var youtube_url = youtube_head + vid_id + "&key=" + youtube_key;
    $('#input_box').val("");
    getVidTitle(youtube_url, vid_id);
  });

  //clicking play all
  $(document).on('click', '#play_all', function() {
    current_index = 0;
    var vid_id = playlist.queue[current_index].id;
    player.loadVideoById(vid_id);
  });

  //deleting a song
  $(document).on('click', '#delete', function() {
    var delete_index = $(event.target).parent().parent().index();
    playlist.queue.splice(delete_index, 1);
    redrawTable();
  });

  //move a song up
  $(document).on('click', '#up', function() {
    var current_index = $(event.target).parent().parent().index();
    if (current_index == 0){return;} //check if at top already
    var movingSong = playlist.queue.splice(current_index, 1);
    playlist.queue.splice(current_index - 1, 0, movingSong[0]);
    redrawTable();
  });

  //move a song down
  $(document).on('click', '#down', function() {
    var current_index = $(event.target).parent().parent().index();
    if (current_index == (playlist.queue.length - 1)){return;} //check if at pottom
    var movingSong = playlist.queue.splice(current_index, 1);
    playlist.queue.splice(current_index + 1, 0, movingSong[0]);
    redrawTable();
  });

  //click a song to play it
  $(document).on('click', '.song', function() {
    current_index = $(event.target).parent().index();
    var vid_id = playlist.queue[current_index].id;
    player.loadVideoById(vid_id);
  });

});

//from stack exchange lol
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function getVidTitle(youtube_url, vid_id) { //this also inserts into array and calls redraw table
  $.ajax({
    type: "GET",
    url: youtube_url,
    dataType: "json",
    success : function(data) {
      var vid_title = data.items[0].snippet.title;
      var new_song = new song(vid_title, vid_id);
      playlist.queue.push(new_song);
      redrawTable();
      $("#action_part").slideDown();
    }
  });
}

function redrawTable() {

  if (playlist.queue.length == 0) { $("#action_part").slideUp(); return;}

  $("#p_table").empty(); //clear everything, then redraw. Not my proudest bit of code.

  var delete_button = "<button id=delete class=anju_button type=button>DELETE</button>";
  var move_up_button = "<button id=up class=anju_button type=button>UP</button>";
  var move_down_button = "<button id=down class=anju_button type=button>DOWN</button>";

  $.each(playlist.queue, function(index, value) {
    $("#p_table").append("<tr><td class=song>" + value.title + "</td><td>" + move_up_button + move_down_button + delete_button + "</td></tr>");
  });

  //I'll move this to it's own function later
  //It just sets the thumbnail of the video to be the first video
  //ONLY IF NO VIDEO IS CURRENTLY PLAYING
  if (!playing) {
    current_index = 0;
    var vid_id = playlist.queue[current_index].id;
    player.cueVideoById(vid_id);
  }
}
