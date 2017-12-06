$(function () {

    var folder = $("#main .folder"),
        front = folder.find('.front'),
        img = $("#main img"),
        droppedCount = 0;

    img.draggable();

    folder.droppable({
        drop: function (event, ui) {

            // let photoPath = $(ui.draggable).attr("src");
            // console("photoPath:" + photoPath);
            //向服务器发送删除照片的post请求
            $.ajax({
                url: "http://localhost:3000/photos/myPhotos/delete",
                type: 'POST',
                data: {"photoPath": $(ui.draggable).attr("src")},

                success: function (responseStr) {

                },
                error: function (responseStr) {

                }
            });

            // Remove the dragged icon
            ui.draggable.remove();

            // update the counters
            // front.text(++droppedCount);

        },

        activate: function () {
            // When the user starts draggin an icon
            folder.addClass('open');
        },

        deactivate: function () {
            // Close the folder
            folder.removeClass('open');
        }
    });
});