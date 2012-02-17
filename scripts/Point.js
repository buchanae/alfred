define(function(){

    var Point = function( x, y ){
        this.x = x;
        this.y = y;
        this.prev = null;
        this.next = null;
    };

    Point.prototype = {

        distance_to: function( point ){

            var x = Math.abs(point.x - this.x);
            var y = Math.abs(point.y - this.y);

            return Math.sqrt( x * x + y * y );
        },
    };

    return Point;
});
