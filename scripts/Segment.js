var Segment = {
    setLength : function( a, b, l ){
        var d = l / a.distance(b);
        b.x = a.x + (b.x - a.x) * d;
        b.y = a.y + (b.y - a.y) * d;
    },
    distance : function( a, b, p ){
        // Return minimum distance between line segment vw and point p
        var av = V3.$( a.x, a.y, 0 );
        var bv = V3.$( b.x, b.y, 0 );
        var pv = V3.$( p.x, p.y, 0 );
        var l2 = V3.lengthSquared( V3.sub( bv, av ) );

        if (l2 == 0.0) return p.distance(a);
        // Consider the line extending the segment, parameterized as v + t (w - v).
        // We find projection of point p onto the line. 
        // It falls where t = [(p-v) . (w-v)] / |w-v|^2
        var t = V3.dot( V3.sub( pv, av ), V3.sub( bv, av ) ) / l2;

        if (t < 0.0) return p.distance(a);       // Beyond the 'v' end of the segment
        else if (t > 1.0) return p.distance(b);  // Beyond the 'w' end of the segment

        var rv = V3.add( av, V3.scale( V3.sub( bv, av ), t ) );
        var r = new Point( rv[0], rv[1] );
        return p.distance(r);
    }
};
