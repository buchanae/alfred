var ALLOWED_ITERATIONS = 10;
var TOLERANCE = 0.1;

var IKChain = function( points ){
    this.points = points;

    this.circle = new Circle( _.last( points ), 5 );
};

IKChain.prototype = {
    draw : function( ctx ){
        this.circle.draw( ctx );
    },
    select_tool : function( p ){
        this.circle.select_tool( p );
        this.selected = this.circle.selected;
    },
    drag : function(p){
        this.circle.drag( p );
        this.solve( this.circle.position );
    },
    solve : function( target ){

        this.circle.position.move( target );

        var points = this.points;
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

                dist = last.distance( target ); 
                count++;
            }

        } else {

            for( var i = 0; i < points.length - 1; i++ ){
                points[i + 1].move( target );
                Segment.setLength( points[i], points[i + 1], lengths[i] );
            }
        }
    },
};
