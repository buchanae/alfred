define(['underscore'], function(_) {

    var IKChain = function( points ){
        this.points = points;
    };

    IKChain.prototype = {

        length: function() {
            if (this.points.length < 2) 
                return 0;

            var len = 0;
            for( var i = 0; i < this.points.length - 1; i++ ){
                len += this.points[i].distance_to(this.points[i + 1]);
            }

            return len;
        },

        reachable: function( point ){
            return this.points[0].distance_to( point ) <= this.length();
        },

        solve: function( target ){
            
            var ALLOWED_ITERATIONS = 10;
            var TOLERANCE = 0.1;

            var lengths = [];
            for( var i = 0; i < this.points.length - 1; i++ ){
                lengths.push(this.points[i].distance_to(this.points[i + 1]));
            }

            if (this.reachable(target)) {

                var iteration = 0;

                // TODO tolerance checking is wrong.  should be checking the amount
                // that the end point moved during the last iteration.  If it moved
                // above a tolerance, keep moving.  If it barely moved, it is possible
                // that the chain is constrained from moving anymore and we should stop.
                while( _.last(this.points).distance_to( target ) > TOLERANCE
                       && iteration < ALLOWED_ITERATIONS ){

                    var root = _.clone(this.points[0]);
                    this.points[this.points.length - 1] = _.clone(target);

                    for( var i = this.points.length - 2; i >= 0; i-- ){

                        var p = this.points[i];
                        var q = this.points[i + 1];

                        var g = lengths[i] / p.distance_to(q);

                        p.x = (1 - g) * q.x + g * p.x;
                        p.y = (1 - g) * q.y + g * p.y;
                    }

                    this.points[0] = root;

                    for( var i = 0; i < this.points.length - 1; i++ ){

                        var p = this.points[i];
                        var q = this.points[i + 1];

                        var g = lengths[i] / p.distance_to(q);

                        q.x = (1 - g) * p.x + g * q.x;
                        q.y = (1 - g) * p.y + g * q.y;
                    }

                    iteration++;
                }

            } else {
                for( var i = 0; i < this.points.length - 1; i++ ){

                    var p = this.points[i];
                    var q = this.points[i + 1];

                    var g = lengths[i] / target.distance_to(p);

                    q.x = (1 - g) * p.x + g * target.x;
                    q.y = (1 - g) * p.y + g * target.y;
                }
            }
        },
    };

    return IKChain;
});
