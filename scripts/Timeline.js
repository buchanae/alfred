var Timeline = function(){

    this.tracks = [];
    this.length = 100;
    this.playing = false;
    this.now = 0;
};
Timeline.prototype = {

    tick: function( scene ){

        for( var i = 0; i < this.tracks.length; i++ ){
            this.tracks[i].tick( this );
        }

        if (this.playing) {

            this.now += 1;

            if (this.now > this.length) {
              this.playing = false;
            }
        }
    }
};
