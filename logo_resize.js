function resizeLogo() {
    var offset = parseInt($(".navbar").height());
    var duration = 50;
    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
            $(".image_logo").addClass("smaller");
        } else {
            if ($(".image_logo").hasClass("smaller")) {
                $(".image_logo").removeClass("smaller");
            }
        }
    });
}

$(document).ready(function() {
    resizeLogo();
});

