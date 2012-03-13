var Path = function( points ){
    this.points = points;
};
Path.prototype = {
    // TODO offset should be percent or length?
    pointAtOffset : function( offset ){
        // TODO clean this up.  very inefficient and messy.
        var length = 0;
        if( this.points.length > 2) {
            for( var i = 0; i < this.points.length - 1; i++ ){
                length += this.points[i].distance(this.points[i+1]);
            }
        } else {
            length = this.points[0].distance(this.points[1]);
        }

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
    }
};
