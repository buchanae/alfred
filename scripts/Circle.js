var Circle = function( p, r ){
    this.position = p;
    this.r = r;
    this.selected = false;
};
Circle.prototype = {
    draw : function(){
        ctx.save();
        ctx.beginPath();
        if (this.selected){
            ctx.fillStyle = 'red';
        }
        ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },
    hit_test : function( p ){
        return p.x >= this.position.x - this.r && p.x <= this.position.x + this.r &&
               p.y >= this.position.y - this.r && p.y <= this.position.y + this.r;
    }
};
