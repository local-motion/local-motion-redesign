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

function message_contant_nano() {
    if($('.chat-content .content').length) {
        var message = $('.chat-content');
        var content = $('.chat-content .content');

        if ($(message).height() > $(content).find('.nano-content').height()){
            $(content).nanoScroller({ destroy: true });
            $(content).removeClass('nano').css('margin-top', $(message).height() - $(content).find('.nano-content').height());
        }
        else{
            $(content).addClass('nano').css('margin-top', 0);
            $(content).nanoScroller({ scroll: 'bottom' });
        }
    }
}


window.hashName = window.location.hash;
window.location.hash = '';

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

        if($('#steps_content').length > 0){

            var content = $('#steps_content');
            var tab = content.find('.steps_content_pane .tab-list .item').eq(i);
            var tab_list = $('.steps_content_pane .tab-list .nav-pills').eq(i);
            var tab_content = $('.steps_content_pane .tab-content');
            var templateNavPill = $('#template-nav-pill-li').html();
            var templatePanelContent = $('#template-panel-content').html();

            tab.find('.tab_title').text(el.title);

            $.each(el.step, function (j, step) {
                var newPill = $(templateNavPill);
                var newContent = $(templatePanelContent);
                var new_id = 'step' + i + j;

                $(tab).attr('data-tab', i );
                $(tab_list).attr('data-tab', i)

                if(i == 0 && j == 0){
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
                tab_list.append(newPill);

                newContent.attr('id', new_id).attr('data-tab', i);
                if(step.image_url != ''){
                    newContent.find('.image').append($('<img />').attr('src', step.image_url))
                }
                newContent.find('.title').html(step.title);
                newContent.find('.step_content').html(step.paragraph);
                newContent.find('.tip').html(step.tip);
                newContent.find('.example').html(step.example);
                newContent.find('.quote').html(step.quote);

                tab_content.append(newContent);

            });
        }
    })

}).fail(function (res, data) {

    console.log(data);

});




$(document).ready(function() {

    $(document).on('click','.action_block .btn_block a', function (e) {

        e.preventDefault();

        var tab_list = $(this).closest('.steps_content_pane').find('.tab-list');
        var tab = $(tab_list).find('.item.active').next('.nav-pills').find('li.active');
        var next_tab = $(tab_list).find('.item.active').next('.nav-pills').find('li.active').next('li');
        var n = $(tab).closest('.nav-pills').data('tab');

        if(!$(tab_list).find('.item.active').hasClass('disabled')) {
            if (next_tab.length > 0) {
                $(this).attr('disabled', 'disabled').prop('disabled', 'disabled');

                $(next_tab).addClass('viewed').removeClass('disabled');
                $(next_tab).find('a').tab('show');
                $('.tab-pane.active').find('.panel-content .content').nanoScroller();

                $(tab).removeClass('viewed').removeClass('active').removeClass('disabled').addClass('done');

            }
            else if (next_tab.length <= 0 && n < ($(tab_list).find('.item').length - 1)) {

                $(this).attr('disabled', 'disabled').prop('disabled', 'disabled');

                $(tab).removeClass('viewed').removeClass('active').removeClass('disabled').addClass('done');

                $(tab_list).find('.item').each(function (i, el) {
                    if ($(el).data('tab') == (n + 1)) {

                        $(tab_list).find('.nav-pills').each(function (n, pill) {
                            $(pill).find('li').each(function (j, li) {
                                $(li).removeClass('active');
                            });
                        });

                        $(tab_list).find('.item.active').addClass('done').removeClass('active').removeClass('disabled').removeClass('viewed');

                        $(el).addClass('active').removeClass('disabled').next('.nav-pills').find('li:first-child a').tab('show');

                        $('.tab-pane.active').find('.panel-content .content').nanoScroller();
                    }
                });
            }
            else if (next_tab.length <= 0 && n == ($(tab_list).find('.item').length - 1)) {
                $(this).attr('disabled', 'disabled').prop('disabled', 'disabled');
                $(tab).removeClass('viewed').removeClass('disabled').addClass('done');
            }
        }
    });

    $(document).on('click', '.action_block .next_step a', function (e) {

        e.preventDefault();

        var tab_list = $(this).closest('.steps_content_pane').find('.tab-list');
        var tab = $(tab_list).find('.item.active').next('.nav-pills').find('li.active');
        var next_tab = $(tab_list).find('.item.active').next('.nav-pills').find('li.active').next('li');
        var n = $(tab).closest('.nav-pills').data('tab');

        if (next_tab.length > 0 && $(this).closest('.action_block').find('.btn_block a').attr('disabled') == "disabled") {
            console.log(n);
            if (!$(next_tab).hasClass('disabled')) {
                $(next_tab).find('a').tab('show');
                $('.tab-pane.active').find('.panel-content .content').nanoScroller();
            }
        }
        else if (next_tab.length <= 0 && $(this).closest('.action_block').find('.btn_block a').attr('disabled') == "disabled") {


            $(tab_list).find('.item.active').addClass('done').removeClass('active').removeClass('disabled').removeClass('viewed');


            $(tab_list).find('.nav-pills').each(function (i, el) {
                $(el).find('li').each(function (j, li) {
                    $(li).removeClass('active');
                });
            });
            $(tab_list).find('.item').each(function (i, el) {
                if ($(el).data('tab') == (n + 1)) {
                    $(el).addClass('active').removeClass('disabled').next('.nav-pills').find('li:first-child a').tab('show');

                    $('.tab-pane.active').find('.panel-content .content').nanoScroller();
                }
            });
        }

    });

    $(document).on('click', '.action_block .prev_step a', function (e) {
        e.preventDefault();

        var tab_list = $(this).closest('.steps_content_pane').find('.tab-list');
        var tab = $(tab_list).find('.item.active').next('.nav-pills').find('li.active');
        var prev_tab = $(tab_list).find('.item.active').next('.nav-pills').find('li.active').prev('li');
        var n = $(tab).closest('.nav-pills').data('tab');

        if (prev_tab.length > 0 ) {
            $(prev_tab).find('a').tab('show');
            $('.tab-pane.active').find('.panel-content .content').nanoScroller();
        }
        else if (prev_tab.length <= 0 && n > 0) {

            $(tab_list).find('.item.active').addClass('done').removeClass('active').removeClass('disabled').removeClass('viewed');

            $(tab_list).find('.nav-pills').each(function (i, el) {
                $(el).find('li').each(function (j, li) {
                    $(li).removeClass('active');
                });
            });

            $(tab_list).find('.item').each(function (i, el) {
                if ($(el).data('tab') == (n - 1)) {
                    $(el).addClass('active').removeClass('disabled').next('.nav-pills').find('li:last-child a').tab('show');
                    $('.tab-pane.active').find('.panel-content .content').nanoScroller();
                }
            });
        }
        else if (prev_tab.length <= 0 && n == 0) {

        }

    });

    $('.steps_content_pane .item a').on('click', function (e) {
        e.preventDefault();

        var tab_list = $(this).closest('.tab-list');
        var n = $(this).closest('.item').data('tab');

        $(tab_list).find('.item').each(function (i, el) {
            $(el).removeClass('active');
        });


        $(tab_list).find('.nav-pills').each(function (i, el) {
            $(el).find('li').each(function (j, li) {
                $(li).removeClass('active');
            });
        });


        $(tab_list).find('.item').each(function (i, el) {
            if ($(el).data('tab') == (n)) {
                $(el).addClass('active').next('.nav-pills').find('li:last-child a').tab('show');
                $('.tab-pane.active').find('.panel-content .content').nanoScroller();
            }
        });

        $(this).closest('.item').addClass('active').next('.nav-pills').find('li:first-child a').tab('show');

    });


    $('#icons_block .fase_block').on('click', function (e) {
       e.preventDefault();

        $('#icons_block .fase_block').each(function (i, el) {
           $(el).removeClass('check-in');
        });

       $(this).toggleClass('check-in');
    });


    $('.be_admin').on('click', function (e) {
       e.preventDefault();

       $(this).closest('.content').toggleClass('admin');
    });

    return SetRatingStar();

    footer_position();


    $('.send_message .send').on('click',function (e) {
        e.preventDefault();
        message_contant_nano();
    });
});

$(window).on('load', function () {
    message_contant_nano();
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