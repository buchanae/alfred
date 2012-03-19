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

        // TODO playing check belongs inside Timeline?

        if( timeline.playing ){
            this.now += this.rate;

            if( this.now > this.length ){
                if( this.LOOP ){
                    this.now = 0;
                } else {
                    this.now = this.length;
                }
            }

        }

    }
};
