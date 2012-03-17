var Alfred = function( p ){
    this.head = new Circle( new Point( p.x, p.y ), 15 );

    var shoulder = new Point( p.x, 90 );
    var hip = new Point( p.x, 150 );

    this.shoulder = shoulder;
    this.hip = hip;

    this.larm = [ 
        shoulder, 
        new Point( shoulder.x + 30, shoulder.y ), 
        new Point( shoulder.x + 60, shoulder.y ) 
    ];
    this.rarm = [
        shoulder,
        new Point( shoulder.x + 30, shoulder.y ),
        new Point( shoulder.x + 60, shoulder.y )
    ];


    this.lleg = [ hip, new Point( hip.x + 30, hip.y ), new Point( hip.x + 60, hip.y ) ];
    this.rleg = [ hip, new Point( hip.x + 30, hip.y ), new Point( hip.x + 60, hip.y ) ];
};
Alfred.prototype = {
    draw : function( ctx ){

        ctx.beginPath();
        ctx.moveTo(this.larm[0].x, this.larm[0].y);
        ctx.lineTo(this.larm[1].x, this.larm[1].y);
        ctx.lineTo(this.larm[2].x, this.larm[2].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rarm[0].x, this.rarm[0].y);
        ctx.lineTo(this.rarm[1].x, this.rarm[1].y);
        ctx.lineTo(this.rarm[2].x, this.rarm[2].y);
        ctx.stroke();

        this.head.draw();

        ctx.beginPath();
        ctx.moveTo(this.head.position.x, this.head.position.y);
        ctx.lineTo(this.shoulder.x, this.shoulder.y);
        ctx.lineTo(this.hip.x, this.hip.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.lleg[0].x, this.lleg[0].y);
        ctx.lineTo(this.lleg[1].x, this.lleg[1].y);
        ctx.lineTo(this.lleg[2].x, this.lleg[2].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rleg[0].x, this.rleg[0].y);
        ctx.lineTo(this.rleg[1].x, this.rleg[1].y);
        ctx.lineTo(this.rleg[2].x, this.rleg[2].y);
        ctx.stroke();

    }
};
