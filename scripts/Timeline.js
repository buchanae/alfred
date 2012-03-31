var Timeline = function(){

    this.tracks = [];
    this.length = 100;
    this.playing = false;
    this.LOOP = true;
    this.now = 0;

    this.rate = 0.5;
};
Timeline.prototype = {

    tick: function(){

        if( this.playing ){
            this.now += this.rate;

            if( this.now > this.length ){
                if( this.LOOP ){
                    this.now = 0;
                } else {
                    this.now = this.length;
                }
            }

            var p = this.now / this.length;
            for( var i = 0; i < this.tracks.length; i++ ){
                this.tracks[i].update( p );
            }

        }

    }
};
