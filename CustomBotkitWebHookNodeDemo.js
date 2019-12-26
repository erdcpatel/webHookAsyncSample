var botId = "st-XXXXXXXXX";
var botName = "webHookTestShan";
var sdk            = require("./lib/sdk");
var Promise        = sdk.Promise;
var request        = require("request");
var config         = require("./config");

//Make request to service app
    
function callAPIEndPoint(api) {
var serviceUrl = undefined;

if(api){
	serviceUrl = api;
} else {
	serviceUrl = 'https://httpbin.org/delay/5';
}
console.log("callAPIEndPoint is calling URL " + serviceUrl);

return new Promise(function(resolve, reject) {
    request({
        url: serviceUrl,
        method: 'get',
    }, function(err, res) {
        if (err) {
            return reject(err);
        }
        resolve(JSON.parse(res.body));			
	});
});


}



module.exports = {
	botId   : botId,
	botName : botName,
	 on_user_message : function(requestId, data, callback) {
		sdk.sendBotMessage(data, callback);
		console.log("###request id: " + requestId);
		console.log("on_user_message ==> " + data.message);
	},
	on_bot_message  : function(requestId, data, callback) {
		sdk.sendUserMessage(data, callback);
		console.log("###request id: " + requestId);
		console.log("on_bot_message ==> " + data.message);
	},
	on_webhook      : function(requestId, data, componentName, callback) {
		console.log("###request id: " + requestId);
		var context = data.context;
		if (componentName === '<enter your webhook component name here>') {
		  var api = null;
		  console.log("on_webhook ==> calling API for hookCallAPIFromBotkit");
		console.log("wait on... " + new Date());
		sdk.saveData(requestId, data)
				.then(function() {
					setTimeout(function(){

						callAPIEndPoint(api).then(function(endPointResp) {
							data.context.endPointResp = endPointResp;
							sdk.respondToHook(data);
							console.log("wait done... " + new Date());
						});
					},30000);
					callback(null, new sdk.AsyncResponse());
				});

		}        
	},
	on_agent_transfer : function(requestId, data, callback){
		return callback(null, data);
	}
};