var Path = function( points ){
    this.points = points;
    this.selected = false;
};
Path.prototype = {
    length : function() {
        var length = 0;
        if( this.points.length > 2) {
            for( var i = 0; i < this.points.length - 1; i++ ){
                length += this.points[i].distance(this.points[i+1]);
            }
        } else {
            length = this.points[0].distance(this.points[1]);
        }
        return length;
    },
    // TODO offset should be percent or length?
    pointAtOffset : function( offset ){

        var length = this.length();
        // TODO clean this up.  very inefficient and messy.
        var d = length * offset;
        var prev_len = 0;
        var i = 0;
        for( ; i < this.points.length - 1; i++ ){
            var l = this.points[i].distance(this.points[i+1]);
            if( prev_len + l >= d ){
                break;
            }
            prev_len += l;
        }
        var r = _.clone(this.points[i]);
        var t = _.clone(this.points[i+1]);
        Segment.setLength(r, t, d - prev_len);
        return t;
    },
    hit_test : function( p ){

        for( var i = 0; i < this.points.length - 1; i++ ){
            var d = Segment.distance( this.points[i], this.points[ i + 1 ], p );
            var TOLERANCE = 2;
            if ( d <= TOLERANCE )
                return d <= TOLERANCE;
        }
        return false;
    },
    draw : function( ctx ){
        if (this.points.length > 1) {
            ctx.save();
            ctx.strokeStyle = this.selected ? 'red' : 'black';
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for( var i = 1; i < this.points.length; i++ ){
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
            for( var i = 0; i < this.points.length; i++ ){
                this.points[i].draw( ctx );
            }
        }
    },
};

var load_path = function( data ){
    var pts = [];
    for( var i = 0; i < data.points.length; i++ ){
        pts.push( load_point( data.points[i] ) );
    }
    return new Path( pts );
}
