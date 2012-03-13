var ALLOWED_ITERATIONS = 10;
var TOLERANCE = 0.1;

var ik = function( points, target ){

    var lengths = [];
    var length = 0;

    for( var i = 0; i < points.length - 1; i++ ){
        var l = points[ i ].distance( points[ i + 1 ] );
        length += l;
        lengths.push( l );
    }

    var first = points[ 0 ];
    var last = points[ points.length - 1 ];
    var root = _.clone( first );

    if( root.distance( target ) <= length ){

        var count = 0;
        var dist = last.distance( target );

        while( count < ALLOWED_ITERATIONS && dist > TOLERANCE ){

            last.move( target );

            for( var i = points.length - 1; i > 0; i-- ){
                Segment.setLength( points[ i ], points[ i - 1 ], lengths[ i - 1 ] );
            }

            first.move( root );
            
            for( var i = 0; i < points.length - 1; i++ ){
                Segment.setLength( points[ i ], points[ i + 1 ], lengths[ i ] );
            }

            dist -= last.distance( target ); 
            count++;
        }

    } else {

        for( var i = 0; i < points.length - 1; i++ ){
            points[i + 1].move( target );
            Segment.setLength( points[i], points[i + 1], lengths[i] );
        }
    }
};
