// TODO look at using Curve instead of individual Segments
define(function(){

    var ALLOWED_ITERATIONS = 10;
    var TOLERANCE = 0.1;

    return function( path, target ){

        if ( path.firstSegment.point.getDistance(target) <= path.length ) {


            var iteration = 0;

            // TODO tolerance checking is wrong.  should be checking the amount
            // that the end point moved during the last iteration.  If it moved
            // above a tolerance, keep moving.  If it barely moved, it is possible
            // that the chain is constrained from moving anymore and we should stop.
            while( !path.lastSegment.point.isClose( target, TOLERANCE )
                   && iteration < ALLOWED_ITERATIONS ){


                var root = path.firstSegment.point.clone();

                var t = target;
                for( var s = path.lastSegment.previous; s !== null; s = s.previous ){

                    var d = s.point.getDistance(s.next.point);
                    s.next.point = t;
                    var a = s.point.subtract(s.next.point).normalize(d);
                    t = s.next.point.add(a);
                }
                path.firstSegment.point = t;

                t = root;
                path.reverse();

                for( var s = path.lastSegment.previous; s !== null; s = s.previous ){

                    var d = s.point.getDistance(s.next.point);
                    s.next.point = t;
                    var a = s.point.subtract(s.next.point).normalize(d);
                    t = s.next.point.add(a);
                }
                path.firstSegment.point = t;

                path.reverse();
                iteration++;
            }

        } else {

            var v = target.subtract(path.firstSegment.point);
            var t = path.firstSegment.point;

            for( var s = path.firstSegment.next; s !== null; s = s.next ){

                var d = s.point.getDistance(s.previous.point);
                s.previous.point = t;
                var a = v.normalize(d);
                t = s.previous.point.add(a);
            }
            path.lastSegment.point = t;
        }
    };
});
