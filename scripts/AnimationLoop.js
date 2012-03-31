var AnimationLoop = function( render, element ) {

    var running, lastFrame = +new Date;
    function loop( now ) {
        // stop the loop if render returned false
        if ( running !== false ) {
            requestAnimationFrame( loop, element );
            running = render( now - lastFrame );
            lastFrame = now;
        }
    }
    loop( lastFrame );
};
