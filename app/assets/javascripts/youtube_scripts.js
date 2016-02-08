
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

function onPlayerStateChange(event) {

  if (event.data == 0) {

    var rowCount = $('#p_table tr').length;
    if (parseInt(current_song) + 1 === rowCount ) {

      playSong(0);

    } else {

      playSong(parseInt(current_song) + 1);

    }

    //testFunction();

  }

}
