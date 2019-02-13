function footer_position() {
    if( $('footer').length > 0){
        var footer = $('footer');
        var before_footer_height = $('#content').innerHeight() + $('header').innerHeight() ;

        if((before_footer_height + $(footer).innerHeight()) > $(window).height()){
            $(footer).css('position','inherit');
        }
        else{
            $(footer).css('position','fixed');
        }
    }
}



function activateTab(selector) {
    $(selector).on('click',function() { $(this).tab('show'); })
        .closest('.disabled').removeClass('disabled');
}

window.hashName = window.location.hash;
window.location.hash = '';

$(window).on('load', function () {
    footer_position();

});
$(window).on('resize', function () {
    footer_position();

});


var $star_rating = $('.rating .star');

var SetRatingStar = function() {
    return $star_rating.each(function() {
        if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
            return $(this).removeClass('off').addClass('on');
        } else {
            return $(this).removeClass('on').addClass('off');
        }
    });
};

$star_rating.on('click', function() {
    $star_rating.siblings('input.rating-value').val($(this).data('rating'));
    return SetRatingStar();
});

var jsonData = [];

var url = 'assets/jsonData/data.json';
$.getJSON(url, function (data) {
    jsonData = data;

    $.each(jsonData, function (i, el) {

        if($('#nav-tab').length > 0){

            var content = $('#nav-tab');
            var tab = content.find('.nav-tabs li').eq(i);
            var tab_content = $($(tab).find('a').attr('href'));
            var templateNavPill = $('#template-nav-pill-li').html();
            var templatePanelContent = $('#template-panel-content').html();

            tab.find('.tab_title').text(el.title);

            $.each(el.step, function (j, step) {
                var newPill = $(templateNavPill);
                var newContent = $(templatePanelContent);
                var new_id = 'step' + i + j;

                if(j == 0){
                    newPill.addClass('active');
                    newContent.addClass('active');
                }
                else {
                    newPill.addClass('disabled');
                }
                newPill.find('a').attr('href','#' + new_id);
                newPill.find('.number').text(j + 1);
                newPill.find('.info .pill_title').text(step.tab_title);
                newPill.find('.info .pill_subtitle').text(step.tab_subtitle);
                tab_content.find('.nav-pills').append(newPill);

                newContent.attr('id', new_id);
                if(step.image_url != ''){
                    newContent.find('.image').append($('<img />').attr('src', step.image_url))
                }
                newContent.find('.title').html(step.title);
                newContent.find('.step_content').html(step.paragraph);
                newContent.find('.tip').html(step.tip);
                newContent.find('.example').html(step.example);
                newContent.find('.quote').html(step.quote);

                tab_content.find('.tab-content').append(newContent);

            });
        }
    })

}).fail(function (res, data) {

    console.log(data);

});

$('.panel-content .content').nanoScroller();

$(document).ready(function() {

    $('.action_block .btn_block a').on('click', function (e) {

        e.preventDefault();

        var tab = $(this).closest('.tab-pane');
        var next_tab = $(this).closest('.tab-pane').next('.tab-pane');

        $(this).attr('disabled','disabled').prop('disabled','disabled');

        $('a[href="#' + next_tab.attr('id') + '"]').closest('li').addClass('viewed').removeClass('disabled');
        $('a[href="#' + next_tab.attr('id') + '"]').tab('show');

        $('a[href="#' + tab.attr('id') + '"]').closest('li').removeClass('viewed').removeClass('disabled').addClass('done');

        if(next_tab.length <= 0  ) {
            $(this).closest('#nav-tab').find('.nav-tabs li.active').addClass('done').next('li').removeClass('disabled').find('a').tab('show');
        }

    });

    $('.action_block .next_step a').on('click', function (e) {

        e.preventDefault();

        var next_tab = $(this).closest('.tab-pane').next('.tab-pane');

        if(next_tab.length > 0 && $(this).closest('.action_block').find('.btn_block a').attr('disabled') == "disabled" ) {

            if (!$('a[href="#' + next_tab.attr('id') + '"]').closest('li').hasClass('disabled')) {
                $('a[href="#' + next_tab.attr('id') + '"]').tab('show');
            }
        }
        else if(next_tab.length <= 0  && $(this).closest('.action_block').find('.btn_block a').attr('disabled') == "disabled"){

            $(this).closest('#nav-tab').find('.nav-tabs li.active').addClass('done').next('li').removeClass('disabled').find('a').tab('show');
        }

    });

    $('.action_block .prev_step a').on('click', function (e) {
        e.preventDefault();

        var prev_tab = $(this).closest('.tab-pane').prev('.tab-pane');

        if(prev_tab.length > 0) {

            $('a[href="#' + prev_tab.attr('id') + '"]').tab('show');
        }
        else if(prev_tab.length <= 0 ){

            console.log($(prev_tab));

            $(this).closest('#nav-tab').find('.nav-tabs li.active').prev('li').find('a').tab('show');
        }

    });

    $('#icons_block .fase_block').on('click', function (e) {
       e.preventDefault();

        $('#icons_block .fase_block').each(function (i, el) {
           $(el).removeClass('check-in');
        });

       $(this).toggleClass('check-in');
    });

    /*$('#icons_block .main_button.join').on('click', function (e) {
        e.preventDefault();
       var fase_check = $(this).closest('#icons_block').find('.fase_block.check-in');

       if(fase_check.length > 0 && fase_check.find('.icon.icon-voorbereiden').length > 0){
           var link = $(fase_check).find('.icon.icon-voorbereiden').data('href');

           window.location.href = location.protocol + "//" + location.host + link;
       }
    });*/

    return SetRatingStar();

    footer_position();


});

window.pushNotifications = new function ($node) {
    $node = $('[push-notifications]');

    var self = this;
    var notes = $node.find('.notification');
    var template = $node.find('.template');
    var shownNotes = [];
    var maxCount = 4;

    self.bind = function ($note) {
        if (!$note.hasClass('shown')) {
            $note.addClass('shown');
        }

        var note = {
            note: $note
        };

        note.timeout = setTimeout(function () {
            self.deleteNotification(note);
        }, parseInt(note.note.attr('expire')) * 1);

        shownNotes.push(note);

        note.note.find('.close-notification').unbind('click').bind('click', function () {
            self.deleteNotification(note);
        });

        if (shownNotes.length > maxCount) {
            var _note = shownNotes[0];

            self.deleteNotification(_note);
        }
    };

    self.deleteNotification = function (note) {
        clearTimeout(note.timeout);
        note.note.removeClass('shown');
        shownNotes.splice(shownNotes.indexOf(note), 1);

        setTimeout(function () {
            note.note.remove();
        }, 450);
    };

    self.init = function () {
        notes.each(function (index, note) {
            self.bind($(note));
        });
    };

    self.push = function (type, icon, text, timeout) {
        var notification = template.clone();

        notification.removeClass('template');
        notification.addClass('notification');
        notification.addClass('notification-' + type);

        notification.removeAttr('hidden');
        notification.attr('expire', timeout);
        notification.find('.text').text(text);
        notification.find('.icon').addClass('mdi mdi-' + icon);

        $node.find('.inner').prepend(notification);

        setTimeout(function () {
            self.bind(notification);
        }, 100);
    };

    self.init();
}();