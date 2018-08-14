var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var Q = require('q');
var watson = require('watson-developer-cloud');

var conversationController = new Controller();

// var conversation = new watson.conversation({
//     url: 'https://gateway.watsonplatform.net/conversation/api',
//     username: process.env.CONVERSATION_USERNAME || '',
//     password: process.env.CONVERSATION_PASSWORD || '',
//     version_date: process.env.VERSION_DATE_CONVERSATION || '',
//     version: 'v1'
// });

var discovery = new watson.DiscoveryV1({
    version_date: process.env.VERSION_DATE_DISCOVERY || watson.DiscoveryV1.VERSION_DATE_2017_08_01,
    username: process.env.DISCOVERY_USERNAME || 'a95f5a99-6547-4a62-8bb6-ef71b5f33885',
    password: process.env.DISCOVERY_PASSWORD || 'IkHZVxuKXMTW'
});


conversationController.message = function () {
    var req = this.req;
    var res = this.res;

    if(req.body.input == undefined){
        var response = {
            "input": { "text": "" },
            "context": {},
            "output": {"text":"Bienvenido al Poder Judicial","flag":"inicio"},
            "discovery": []
        };
        return res.json(response);

    }else{
            // return discovery data
            var response = {
                "input": { "text": req.body.input.text },
                "context": {},
                "output": {"text":"esto salio de discovery"},
                "discovery": []
            };


            var version_date = process.env.VERSION_DATE_DISCOVERY || watson.DiscoveryV1.VERSION_DATE_2017_08_01;
            var environment_id = process.env.ENVIRONMENT_ID || '4c8ed97e-5634-496b-ba2a-6349a84fef66';
            var collection_id = process.env.COLLECTION_ID || 'b88180d9-2f59-491a-b685-0cccbb5789d2';

            discovery.query({
                version_date: version_date,
                environment_id: environment_id,
                collection_id: collection_id,
                natural_language_query: req.body.input.text,
                count: 10,
                passages: true
            },
                (err, data) => {
                    if (err) {
                        console.log("Error: ");
                        console.log(err);
                        return res.status(err.code || 500).json(err);
                    }

                    if (data.results.length > 0) {
                        for (var i = 0; i < data.results.length; i++) {
                            response.discovery.push(data.results[i]);
                            response.discovery[i].passage = [];

                        }

                        for (var i = 0; i < response.discovery.length; i++) {
                            for (var j = 0; j < data.passages.length; j++) {
                                if (response.discovery[i].id == data.passages[j].document_id) {
                                    var passages = { passage_text: data.passages[j].passage_text }
                                    response.discovery[i].passage.push(passages);
                                }
                            }
                        }

                        response.passages = data.passages;

                    } else {
                        response.discovery.push("No puedo encontrar una respuesta a tu pregunta");
                    }

                    return res.json(response);
                }
            );


        }

};


module.exports = conversationController;