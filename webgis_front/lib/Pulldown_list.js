$(function() {
    // 鼠标经过
    // $(".nav>li").mouseover(function() {
    //     // $(this) jQuery 当前元素  this不要加引号
    //     // show() 显示元素  hide() 隐藏元素
    //     $(this).children("ul").slideDown(200);
    // });
    // // 鼠标离开
    // $(".nav>li").mouseout(function() {
    //     $(this).children("ul").slideUp(200);
    // });
    // 1. 事件切换 hover 就是鼠标经过和离开的复合写法
    // $(".nav>li").hover(function() {
    //     $(this).children("ul").slideDown(200);
    // }, function() {
    //     $(this).children("ul").slideUp(200);
    // });
    // 2. 事件切换 hover  如果只写一个函数，那么鼠标经过和鼠标离开都会触发这个函数
    $(".nav>li").hover(function() {
        $(this).children("ul").slideToggle();
    });
})