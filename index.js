var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
	var phoneNumber = event.Details.ContactData.CustomerEndpoint.Address;
	var paramsQuery = {
				TableName: 'ABCInternet-Customers',
  				KeyConditionExpression: "PhoneNumber = :varString",
  				IndexName: "PhoneNumber-index",

  				ExpressionAttributeValues: {
   					":varString": phoneNumber
  				}
 			};

	docClient.query(paramsQuery, function(err, data) {
  		if (err) {
   			console.log(err); // an error occurred
   			context.fail(buildResponse(false));
  		} 
		else {
   			console.log("DynamoDB Query Results:" + JSON.stringify(data));

			
   			if (data.Items.length === 1) {
				var name = data.Items[0].Name;
				callback(null, buildResponse(true, name));
   			} 
			else {
    			console.log("PhoneNumber not found");
    			callback(null, buildResponse(true, "none"));
   			}
  		}
 	});
};

function buildResponse(isSuccess, name) {
 	if (isSuccess) {
  		return { 
			name: name,
			lambdaResult: "Success"
		};
 	} 
	else {
  		console.log("Lambda returned error to Connect");
  		return { lambdaResult: "Error" };
 	}
}
