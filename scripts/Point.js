var Point = function( x, y ){
    this.x = x;
    this.y = y;
    this.selected = false;
};
Point.prototype = {
    distance : function( p ){
        return Math.sqrt( (this.x - p.x) * (this.x - p.x) + 
                          (this.y - p.y) * (this.y - p.y) );
    },
    move: function( p ){
        this.x = p.x;
        this.y = p.y;
    },
    draw : function( ctx ){
        ctx.save();
        ctx.fillStyle = this.selected ? 'red' : 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },
    hit_test : function( p ){
        var TOLERANCE = 2;
        return this.distance( p ) < TOLERANCE;
    }
};
