// The ConversationPanel module is designed to handle
// all display and behaviors of the conversation column of the app.
/* eslint no-unused-vars: "off" */
/* global Api: true, Common: true*/

var arrayResultadoDiscovery;

var ConversationPanel = (function() {
  var settings = {
    selectors: {
      chatBox: '.msg_container_base',
      fromUser: '.from-user',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    authorTypes: {
      user: 'user',
      watson: 'watson'
    }
  };

  // Publicly accessible methods defined
  return {
    init: init,
    inputKeyDown: inputKeyDown,
    botonClick: botonClick
  };

  function sleep(milliseconds) {
    var start = new Date().getTime();

    var timer = true;
    while (timer) {
      if ((new Date().getTime() - start)> milliseconds) {
        timer = false;
      }
    }
  }

  // Initialize the module
  function init() {
    chatUpdateSetup();
    Api.sendRequest( '', null );
  }
  // Set up callbacks on payload setters in Api module
  // This causes the displayMessage function to be called when messages are sent / received
  function chatUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function(newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.user);
    };

    var currentWaitPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function(newPayloadStr) {
      currentWaitPayloadSetter.call(Api, newPayloadStr);
      displayWait();
    };

    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function(newPayloadStr) {
      currentResponsePayloadSetter.call(Api, newPayloadStr);
      console.log(JSON.parse(newPayloadStr));
      
      sleep(2000);

      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.watson);
      
      
      arrayResultadoDiscovery = JSON.parse(newPayloadStr).discovery
      listaDiscovery(JSON.parse(newPayloadStr).discovery)
      console.log(arrayResultadoDiscovery);        
      
      
      
      
    };
  }
  
  







  function listaDiscovery(arrayDiscovery){
    console.log(arrayDiscovery)
    var chatBoxElement = document.querySelector(settings.selectors.chatBox);
    $('.panel-body.msg_container_base').append('<div class="row msg_container"><div class="col-md-15 base_receive_result_title"><a href="#" class="alternar-respuesta">- Ver menos</a></div></div>')
    var htmlDiscoveryInicio = '<div class="row msg_container"><div class="col-md-15 base_receive_result_busqueda"><div class="respuesta-busqueda">';
    var htmlDiscoveryFin = '</div></div></div>'
    var htmlDiscoveryBase = ''
    for (var i = 0; i< arrayDiscovery.length;i++){
      var passage = arrayDiscovery[i].passage[0] != undefined ? arrayDiscovery[i].passage[0].passage_text:'';
      htmlDiscoveryBase = htmlDiscoveryBase+'<p class="base_receive_result_busqueda_parrafo mostrar-detalle" data-index="'+i+'"><a href="#">'+arrayDiscovery[i].extracted_metadata.title+'</a></p>'+
                                    '<p class="base_receive_result_busqueda_parrafo base_space">'+passage+'</p>'
    }
    $('.panel-body.msg_container_base').append(htmlDiscoveryInicio+htmlDiscoveryBase+htmlDiscoveryFin);
    scrollToChatBottom();
  }
  // Display a user or Watson message that has just been sent/received
  function displayMessage(newPayload, typeValue) {

    $("div.row.msg_container.msg_hide").remove();

    var isUser = isUserMessage(typeValue);
    var textExists = (newPayload.input && newPayload.input.text)
      || (newPayload.output && newPayload.output.text);
    if (isUser !== null && textExists) {
      // Create new message DOM element
      var messageDivs = buildMessageDomElements(newPayload, isUser);
      var chatBoxElement = document.querySelector(settings.selectors.chatBox);
      var previousLatest = chatBoxElement.querySelectorAll((isUser
              ? settings.selectors.fromUser : settings.selectors.fromWatson)
              + settings.selectors.latest);
      // Previous "latest" message is no longer the most recent
      if (previousLatest) {
        Common.listForEach(previousLatest, function(element) {
          element.classList.remove('latest');
        });
      }

      messageDivs.forEach(function(currentDiv) {
        chatBoxElement.appendChild(currentDiv);
        // Class to start fade in animation
        currentDiv.classList.add('load');
      });
      // Move chat to the most recent messages when new messages are added
      scrollToChatBottom();
    }
  }

  // Checks if the given typeValue matches with the user "name", the Watson "name", or neither
  // Returns true if user, false if Watson, and null if neither
  // Used to keep track of whether a message was from the user or Watson
  function isUserMessage(typeValue) {
    if (typeValue === settings.authorTypes.user) {
      return true;
    } else if (typeValue === settings.authorTypes.watson) {
      return false;
    }
    return null;
  }

  // Constructs new DOM element from a message payload
  function buildMessageDomElements(newPayload, isUser) {
    var textArray = isUser ? newPayload.input.text : newPayload.output.text;
    if (Object.prototype.toString.call( textArray ) !== '[object Array]') {
      textArray = [textArray];
    }
    var messageArray = [];

    textArray.forEach(function(currentText) {
      if (currentText) {
        var messageJson = {
          // <div class='segments'>
          'tagName': 'div',
          'classNames': ['row','msg_container'],
          'children': [{
            // <div class='from-user/from-watson latest'>
            'tagName': 'div',
            'classNames': ['col-md-12'],
            'children': [{
              // <div class='message-inner'>
              'tagName': 'div',
              'classNames': [(isUser ? 'msg_sent' : 'msg_receive'), 'latest', ((messageArray.length === 0) ? 'messages' : 'messages')],
              'children': [{
                // <p>{messageText}</p>
                'tagName': 'p',
                'text': currentText
              }]
            }]
          }]
        };
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });

    return messageArray;
  }

  function displayWait() {
    // Create new message DOM element
    var messageDivs = buildWaitDomElements();
    var chatBoxElement = document.querySelector(settings.selectors.chatBox);

    messageDivs.forEach(function(currentDiv) {
      chatBoxElement.appendChild(currentDiv);
      // Class to start fade in animation
      currentDiv.classList.add('load');
    });
    // Move chat to the most recent messages when new messages are added
    scrollToChatBottom();
  }

  function buildWaitDomElements() {
    var messageArray = [];

    var messageJson = {
      // <div class='segments'>
      'tagName': 'div',
      'classNames': ['row','msg_container','msg_hide'],
      'children': [{
        // <div class='from-user/from-watson latest'>
        'tagName': 'div',
        'classNames': ['col-md-12'],
        'children': [{
          // <div class='message-inner'>
          'tagName': 'div',
          'classNames': ['msg_wait'],
          'children': [{
            'tagName': 'div',
            'classNames': ['loader'],
            'children': [{
              'tagName': 'div',
              'classNames': ['loader-inner','ball-pulse-sync'],
              'children': [{'tagName': 'div'},{'tagName': 'div'},{'tagName': 'div'}]
            }]
          }]
        }]
      }]
    };

    messageArray.push(Common.buildDomElement(messageJson));

    return messageArray;
  }

  // Scroll to the bottom of the chat window (to the most recent messages)
  // Note: this method will bring the most recent user message into view,
  //   even if the most recent message is from Watson.
  //   This is done so that the "context" of the conversation is maintained in the view,
  //   even if the Watson message is long.
  function scrollToChatBottom() {
    $('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 500);
  }

  // Handles the submission of input
  function inputKeyDown(event, inputBox) {
    // Submit on enter key, dis-allowing blank messages
    if (event.keyCode === 13 && inputBox.value) {
      // Retrieve the context from the previous server response
      var context;
      var latestResponse = Api.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }

      // Send the user message
      Api.sendRequest(inputBox.value, context);

      // Clear input box for further messages
      inputBox.value = '';
      Common.fireEvent(inputBox, 'input');
    }
  }
  function botonClick() {
    // Submit on enter key, dis-allowing blank messages
    var text = $("#btn-input").val();
    if(text != ""){
     var context;
     var latestResponse = Api.getResponsePayload();
     if (latestResponse) {
        context = latestResponse.context;
      }
      
      Api.sendRequest(text, context);
      $("#btn-input").val("");
    }
    
  }
}());
