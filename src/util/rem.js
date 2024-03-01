function remSize(){
    var deiveWidth = document.documentElement.clientWidth || window.innerWidth;
    if(deiveWidth>=750){
        deiveWidth=750
    }

    if(deiveWidth<= 320){
        deiveWidth=320
    }

    //750px-->1rem=100px,375px-->1rem=50px
    document.documentElement.style.fontSize=(deiveWidth/7.5)+'px';
    document.querySelector('body').style.fontSize=0.3+'rem';
}

remSize();

window.onresize=function(){
    remSize();
}