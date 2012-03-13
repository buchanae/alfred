var Segment = {
    setLength : function( a, b, l ){
        var d = l / a.distance(b);
        b.x = a.x + (b.x - a.x) * d;
        b.y = a.y + (b.y - a.y) * d;
    }
};
