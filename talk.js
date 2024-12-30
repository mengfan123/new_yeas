$(function() {
  $(document).ready(function() {
    modal(function() {
        fireworks();
    });
});
});


function fireworks() {
//    $('.page_one').addClass('hide');
    initAnimate();
}

function modal() {
// 倒计时3秒后自动执行
setTimeout(() => {
    fireworks();
}, 000);
}
