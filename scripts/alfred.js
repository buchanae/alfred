var Alfred = function( p ){
    this.head = new Circle( new Point( p.x, p.y ), 15 );

    var shoulder = new Point( p.x, 90 );
    var hip = new Point( p.x, 150 );

    this.shoulder = shoulder;
    this.hip = hip;

    this.larm = new IKChain([ 
        shoulder, 
        new Point( shoulder.x + 30, shoulder.y ), 
        new Point( shoulder.x + 60, shoulder.y ) 
    ]);
    this.rarm = new IKChain([ 
        shoulder, 
        new Point( shoulder.x + 30, shoulder.y ), 
        new Point( shoulder.x + 60, shoulder.y ) 
    ]);

    this.lleg = new IKChain([ 
        hip, 
        new Point( hip.x + 30, hip.y ), 
        new Point( hip.x + 60, hip.y ) 
    ]);
    this.rleg = new IKChain([ 
        hip, 
        new Point( hip.x + 30, hip.y ), 
        new Point( hip.x + 60, hip.y ) 
    ]);
};
Alfred.prototype = {
    select_tool : function( p ){

        this.larm.select_tool( p );
        this.rarm.select_tool( p );
        this.lleg.select_tool( p );
        this.rleg.select_tool( p );
    },
    drag : function( p ){
        this.larm.drag( p );
        this.rarm.drag( p );
        this.lleg.drag( p );
        this.rleg.drag( p );
    },
    draw : function( ctx ){

        ctx.beginPath();
        ctx.moveTo(this.larm.points[0].x, this.larm.points[0].y);
        ctx.lineTo(this.larm.points[1].x, this.larm.points[1].y);
        ctx.lineTo(this.larm.points[2].x, this.larm.points[2].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rarm.points[0].x, this.rarm.points[0].y);
        ctx.lineTo(this.rarm.points[1].x, this.rarm.points[1].y);
        ctx.lineTo(this.rarm.points[2].x, this.rarm.points[2].y);
        ctx.stroke();

        this.head.draw( ctx );

        ctx.beginPath();
        ctx.moveTo(this.head.position.x, this.head.position.y);
        ctx.lineTo(this.shoulder.x, this.shoulder.y);
        ctx.lineTo(this.hip.x, this.hip.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.lleg.points[0].x, this.lleg.points[0].y);
        ctx.lineTo(this.lleg.points[1].x, this.lleg.points[1].y);
        ctx.lineTo(this.lleg.points[2].x, this.lleg.points[2].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rleg.points[0].x, this.rleg.points[0].y);
        ctx.lineTo(this.rleg.points[1].x, this.rleg.points[1].y);
        ctx.lineTo(this.rleg.points[2].x, this.rleg.points[2].y);
        ctx.stroke();

        this.larm.draw( ctx );
        this.rarm.draw( ctx );
        this.lleg.draw( ctx );
        this.rleg.draw( ctx );
    }
};
