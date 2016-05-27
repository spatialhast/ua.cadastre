/**
 * Name:    Tooltip JS
 * Version: 1.0.00 (2012-09-03)
 * Author:  Oliekh Iaroslav
 */
if (!tooltip) {
    var tooltip = {
        delta_left_x: -10,
        delta_right_x: -370, /* -(tooltip_width - 10) */
        delta_top_y: 48,
        delta_bottom_y: -276, /* -(tooltip_height + 48) */
        open: function (id, x, y) {
            //var window_h = getWindowHeight();
            //var window_w = getWindowWidth();            
            
            var window_h = $(window).height();
            var window_w = $(window).width();

            var delta_x = this.delta_left_x;
            var delta_y = this.delta_top_y;

            if (y > (window_h / 2)) {
                delta_y = this.delta_bottom_y;
            }

            if (x > (window_w / 2 + 200)) {
                delta_x = this.delta_right_x;
            }

            $('#' + id + ' .pointer').hide();

            if (delta_x == this.delta_left_x && delta_y == this.delta_top_y) {
                $('#' + id + ' .pointer.lt').show();
            } else if (delta_x == this.delta_left_x && delta_y == this.delta_bottom_y) {
                $('#' + id + ' .pointer.lb').show();
            } else if (delta_x == this.delta_right_x && delta_y == this.delta_top_y) {
                $('#' + id + ' .pointer.rt').show();
            } else if (delta_x == this.delta_right_x && delta_y == this.delta_bottom_y) {
                $('#' + id + ' .pointer.rb').show();
            }

            $('#' + id)
                .attr('style', 'top: ' + (y + delta_y) + 'px; left: ' + (x + delta_x) + 'px;')
                .show();
        }, close: function () {
            $('.my-tooltip').hide();
        }
    }
}

function change_tab(p) {
    $('div.page_dilanka').hide();
    $('div.page_ikk').hide();
    $('div.page_atu').hide();
    $('div.page_rajonunion').hide();
    $('div.page_obl').hide();
    $('div.page_grunt').hide();
    $('div.page_land_disposal').hide();
    $('div.page_dilanka_arch').hide();

    $('div.innerNav li a').removeClass("on");
    $('div.innerNavig li a').removeClass("on");

    $("div.page_dilanka[rel=" + p + "]").show();
    $("div.page_ikk[rel=" + p + "]").show();
    $("div.page_atu[rel=" + p + "]").show();
    $("div.page_rajonunion[rel=" + p + "]").show();
    $("div.page_obl[rel=" + p + "]").show();
    $("div.page_grunt[rel=" + p + "]").show();
    $("div.page_land_disposal[rel=" + p + "]").show();
    $("div.page_dilanka_arch[rel=" + p + "]").show();

    $("#tabOn").val(p);

    $("a[rel=" + p + "]").addClass("on");
}
