/**
 * @autor NohponeX
 */
var lastfm_last_listened_track = {
    API_KEY : '',
    username : '',
    element_id : 'lastfm_last_listened_track',
    ttl : 20*60, /*Seconds*/
    invoke : function( element_id ){
        this.element_id = element_id;
        $this = this;
        var element = document.getElementById( this.element_id );
        
        var url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + this.username + '&api_key=' + this.API_KEY + '&format=json&limit=1';
        
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            
            var track = ( Object.prototype.toString.call( data.recenttracks.track ) === '[object Array]'
                         ? data.recenttracks.track[0]
                         : data.recenttracks.track ); 
                         
            var artist = track.artist['#text'];
            var name = track.name;
            var diff;
            if( track['@attr'] && track['@attr'][ 'nowplaying'] ){
                diff = 0;
            }else{
                var date = parseInt( track.date['uts'] || 0 );
                var now = new Date;
                var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
                    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()) / 1000;
                diff = utc_timestamp - date;
            }
            
            if( diff <= $this.ttl ){
                element.innerHTML = '♫ ' + artist + ' - ' + name ;
            }
            
          } else {
            // We reached our target server, but it returned an error
        
          }
        };
        
        request.onerror = function() {
          // There was a connection error of some sort
        };
        
        request.send();
    }
};


//Run
lastfm_last_listened_track.API_KEY = 'YOUR-LASTFM-API-KEY';
lastfm_last_listened_track.username = 'nohponex';
lastfm_last_listened_track.invoke( 'lastfm_last_listened_track' ); //element with id lastfm_last_listened_track
