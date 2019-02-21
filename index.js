'use strict';

const
    bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request');

var app = express();
var port = process.env.PORT || process.env.port || 5000;
app.set('port',port);
app.use(bodyParser.json());

app.post('/webhook',function(req, res){
    let data = req.body;
    let queryroad = data.queryResult.parameters["RoadName"];
    let querylocation = data.queryResult.parameters["location123"];

    request({
        uri:'https://od.moi.gov.tw/MOI/v1/pbs',
        json:true,
    },
    
    function(error, response, body){
        if(!error && response.statusCode == 200){
            var thisFulfullmentMessages = [];
            

            for (var i=0;i<body.length;i++){
                if (querylocation == body[i].region && body[i].road.includes(queryroad)){
                    var thisText={};
                    thisText.text={};
                    thisText.text.text=[];
                    thisText.text.text.push("地區: "+body[i].areaNm+" 路名： "+body[i].road+" 路況: "+body[i].comment);

                    thisFulfullmentMessages.push(thisText);
                    var responseObject = {fulfillmentMessages:thisFulfullmentMessages};
        }
    }
    res.json(responseObject);
}
else{
        console.log("[RoadRobot] failed")
    }
});
});
    

app.listen(app.get('port'),function(){
    console.log('[app.listen] Node app is running on port', app.get('port'));
})

module.exports = app;