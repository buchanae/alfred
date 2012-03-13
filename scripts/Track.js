define( function(){

    var Track = function( obj, name ){

        this.obj = obj;
        this.name = name;
    };
    Track.prototype = {

        getValue: function( timeline ){

            var start = V3.$(0, 0, 0);
            var end = V3.$(timeline.length, 100, 0);

            var s = V3.sub(end, start);
            return V3.scale(s, timeline.now / timeline.length)[1];
        }
    };

    return Track;
});
