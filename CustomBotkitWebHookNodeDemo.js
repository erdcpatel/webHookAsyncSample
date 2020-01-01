var botId = "st-163b7ef8-6293-5a67-965a-b22e7dbb7eb8";
var botName = "My Flight Search Sample";
var sdk            = require("./lib/sdk");
var Promise        = sdk.Promise;
var request        = require("request");
var config         = require("./config");

//Make request to service app
    
function callAPIEndPoint(api) {
var serviceUrl = undefined;

var min=1; 
var max=25;  
var random = Math.floor(Math.random() * (max - min + 1)) + min;
console.log('Delay - ' + random);

if(api){
	serviceUrl = 'https://reqres.in/api/users?delay=' + random;
} else {
	serviceUrl = 'https://reqres.in/api/users?delay=' + random;
}
console.log("callAPIEndPoint is calling URL :: " + serviceUrl);

return new Promise(function(resolve, reject) {
    request({
        url: serviceUrl,
        method: 'get',
    }, function(err, res) {
        if (err) {
            return reject(err);
		}
		//console.log(res);
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

		//My Code
		data.message = "Your request has been received : . " + requestId + " We will revert back once ready with result",
		sdk.sendUserMessage(data, callback);
		//


		var context = data.context;
		if (componentName === 'hookCallAPIFromBotkit') {
		  var api = null;
		  console.log("on_webhook ==> calling API for hookCallAPIFromBotkit");
		
		  console.log("wait on... " + new Date());
		
		sdk.saveData(requestId, data)
				.then(function() {
					setTimeout(function(){
						console.log("calling function")
						callAPIEndPoint(api).then(function(endPointResp) {
							data.context.endPointResp = endPointResp;
							data.context.requestId = requestId;
							console.log(data.context.endPointResp.data)
							//console.log(data)
							console.log('Sending Responce for :: ' + data.context.userInputs.originalInput.sentence);
							sdk.respondToHook(data);
							//sdk.sendUserMessage("Test",callback)
							//console.log("wait done... " + new Date());
						});
					},1);
					callback(null, new sdk.AsyncResponse());
				});

		}        
	},
	on_agent_transfer : function(requestId, data, callback){
		return callback(null, data);
	}
};