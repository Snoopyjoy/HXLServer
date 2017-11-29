/**
 * Created by Jay on 14-5-19.
 */
var ratingMap = {};

function registerRating(id, value, locked, onChange) {

    var ul_element = $("#" + id);

    ratingMap[id] = { element: ul_element, value: value, onChange: onChange };

    if (!locked) {
        $("#" + id + " span").mouseover(function(){
            var cid = $(this).attr('name');
            updateRating(cid, 0);
            $(this).removeClass('active-star');
            $(this).addClass('active-star');
        });

        $("#" + id + " span").mouseout(function(){
            var cid = $(this).attr('name');
            updateRating(cid, ratingMap[cid].value);
        });

        $("#" + id + " span").click(function(){
            var cn = $(this).attr("class");
            var num = cn.match(new RegExp("_[0-9]{1,}"))[0];
            num = num.replace("_", "");
            var cid = $(this).attr('name');
            ratingMap[cid].value = num;
            updateRating(cid, num);

            if (onChange) {
                onChange(id, num);
            }
        });
    }

    updateRating(id, value);
}

function updateRating(id, value) {
    if (value < 0) return;
    if (value > 5) value = 5;

    for (var i = 1; i <= 5; i++) {
        $("#" + id + " .rating_star_" + i).removeClass('active-star');
    }
    if (value > 0) {
        var ele = $("#" + id + " .rating_star_" + value);
        ele.addClass('active-star');
    }
}