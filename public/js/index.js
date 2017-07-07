(function () {
  var mHasCode = false;
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
    sendMessage = function (text,message_side,end,password) {
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
        if ($('.message_input')[0].type == 'text'){
            return sendMessage(getMessageText(),'right',false);
        } else {
            sendMessage('****','right',false);
            return $('.message_input')[0].type = 'text';
        }
    });
    $('.message_input').keyup(function (e) {
        if (e.which === 13) {
            postMessageToServer(encodeURIComponent(getMessageText()));
            if ($('.message_input')[0].type == 'text'){
                return sendMessage(getMessageText(),'right',false);
            } else {
                sendMessage('****','right',false);
                return $('.message_input')[0].type = 'text';
            }
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
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                xhr.setRequestHeader('Access-Control-Allow-Credentials', true);
            },
            success: function(data) {
                var reply = decodeURIComponent(decodeURIComponent(data.result.fulfillment.speech));
                reply = reply.replace('%0A','\n');
                if (data.result.fulfillment.source =='end.session'){
                    sendMessage(reply,'left',true);
                } else 
                sendMessage(reply,'left',false);
                if (data.result.fulfillment.source =="ask.password"){
                    $(".message_input")[0].type = 'password';
                } 

                if (data.result.fulfillment.source =="countTime"){
                    mHasCode = false;
                    setTimeout(function  () {
                        if (mHasCode == false){
                            postMessageToServer('cancel');
                            mHasCode = true;
                        }
                    }, 60000);
                }
                if (data.result.fulfillment.source =="hasCode"){
                    mHasCode = true;
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
