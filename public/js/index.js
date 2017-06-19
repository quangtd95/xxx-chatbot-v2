$(document).on('ready', (function () {
    $('.message_input').focus();
}));

(function () {

    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side,this.end = arg.end;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);

                if (_this.end) {
                    $('.message_input').prop('disabled', true);
                    $('.send_message').prop('disabled', true);
                    $message.find('.button').click(function (e) {
                     window.location.href=window.location.href;
                 });
                } else {
                    $message.find('.button'). hide();
                }
                

                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text,message_side,end) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            if (message_side === 'right') $('.message_input').val('');
            $messages = $('.messages');
            message = new Message({
                text: text,
                message_side: message_side,
                end:end
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            postMessageToServer(encodeURIComponent(getMessageText()));
            return sendMessage(getMessageText(),'right',false);
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                postMessageToServer(encodeURIComponent(getMessageText()));
                return sendMessage(getMessageText(),'right',false);
            }
        });

        function postMessageToServer(query){
            if (query =='clear'){
                window.location.href=window.location.href;
            }
            $.ajax({
                type: "POST",
                url: "/query",
                timeout: 10000,
                data: text = encodeURIComponent(query),
                success: function(data) {
                    var reply = decodeURIComponent(decodeURIComponent(data.result.fulfillment.speech));

                    if (data.result.action=='answer.dont' || data.result.fulfillment.source =='end'){
                        sendMessage(reply,'left',true);
                    } else {
                        sendMessage(reply,'left',false);
                    }
                },
                error: function(jqXHR, textStatus, err) {
                   sendMessage('text status '+textStatus+', err '+err,'left',false);
               }
           }); 
        }

        postMessageToServer('ENABLEWELCOMECHATBOT');
    });
}.call(this));
