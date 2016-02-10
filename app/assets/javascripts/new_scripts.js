

/**
  Important constants and variables
**/
var youtube_key = "AIzaSyC_rY-ddTXByzTrJcNhUA5bob3M1BKPaQU";
var youtube_head = "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id=";
var youtube_search_h = "https://www.googleapis.com/youtube/v3/search?type=video&order=viewCount&q=";
var playlist = {};
playlist.name = "";
playlist.queue = [];
var current_index;
var playing;
var result_array = [];

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
      highlightCurrent();
      break;
    case 2:
      playing = false;
      break;

  }
}


////////////////////////


$( document ).ready(function() {

  $("#action_part").hide(); // because this part should slide down or up later
  $("#youtube_search").hide();


  //When adding a song
  $(document).on('click', '.song_result', function() {
    index = $(this).index();
    playlist.queue.push(result_array[index]);
    redrawTable();
    $("#input_box").val("");
    $("#youtube_search").slideUp();
    $("#action_part").slideDown();
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
    if ((delete_index == current_index) && (playing)) {
      player.stopVideo();
      playing = false;
    }
    playlist.queue.splice(delete_index, 1);
    if (delete_index < current_index){current_index = current_index - 1;}

    redrawTable();
  });

  //move a song up
  $(document).on('click', '#up', function() {
    var selected_index = $(event.target).parent().parent().index();
    if (selected_index == 0){return;} //check if at top already
    if (selected_index == current_index) {current_index = current_index - 1;}
    else if (selected_index == current_index + 1){current_index = current_index + 1;}
    var movingSong = playlist.queue.splice(selected_index, 1);
    playlist.queue.splice(selected_index - 1, 0, movingSong[0]);
    redrawTable();
  });

  //move a song down
  $(document).on('click', '#down', function() {
    var selected_index = $(event.target).parent().parent().index();
    if (selected_index == (playlist.queue.length - 1)){return;} //check if at pottom
    if (selected_index == current_index) {current_index = current_index + 1;}
    else if (selected_index == current_index - 1){current_index = current_index - 1;}
    var movingSong = playlist.queue.splice(selected_index, 1);
    playlist.queue.splice(selected_index + 1, 0, movingSong[0]);
    redrawTable();
  });

  //click a song to play it
  $(document).on('click', '.song', function() {
    current_index = $(event.target).parent().index();
    var vid_id = playlist.queue[current_index].id;
    player.loadVideoById(vid_id);
  });

  //search for songs
  $("#input_box").keyup(function (){
    $("#youtube_search").slideDown();
    var search = $("#input_box").val();
    var youtube_url = youtube_search_h + $("#input_box").val() + "&part=id&key=" + youtube_key;
    getVidSearch(youtube_url, search);
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

function getVidSearch(youtube_url, search) { //used for instant search
  $.ajax({
    type: "GET",
    url: youtube_url,
    dataType: "json",
    success : function(data) {
      result_array.length = 0;
      $.each(data.items, function(index, value) {
        var title_url = youtube_head + value.id.videoId + "&key=" + youtube_key;
        $.ajax({
          type: "GET",
          url: title_url,
          dataType: "json",
          success : function(data) {
            var song = {id:data.items[0].id, title:data.items[0].snippet.title, thumb:data.items[0].snippet.thumbnails.default.url};
            result_array.push(song);
            drawSearch();
          }
        });
      });
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
  if(playing) {
    highlightCurrent();
  }
}

function highlightCurrent() {
  //highlight video currently playing
  $.each( $(".song"), function(index, value) {
    $(this).css("color", "white");
    if (index == current_index) {
      $(this).css("color", "#A0681D");
    }
  });
}

function drawSearch() {
  $("#result_table").empty();
  $.each(result_array, function(index, value) {
    $("#result_table").append("<tr class=song_result><td>" + value.title + "</td><td><img src=" + value.thumb + "></td></tr>");
  });
}
