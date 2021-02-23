var amqp = require('amqplib/callback_api');
var parser = require('fast-xml-parser');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'IdentityEndPoint';

    channel.assertExchange(exchange, 'fanout', {
      durable: true
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, function(msg) {
        if(msg.content) {
            let content = msg.content.toString();
            console.log("[x] %s", content);

            var options = {
                attributeNamePrefix : "@_",
                attrNodeName: "attr", //default is 'false'
                textNodeName : "#text",
                ignoreAttributes : true,
                ignoreNameSpace : false,
                allowBooleanAttributes : false,
                parseNodeValue : true,
                parseAttributeValue : false,
                trimValues: true,
                cdataTagName: "__cdata", //default is 'false'
                cdataPositionChar: "\\c",
                parseTrueNumberOnly: false,
                arrayMode: false, //"strict"
                //attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
                //tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
                stopNodes: ["parse-me-as-string"]
            };

            
            if(parser.validate(content) === true) { 
                var jsonObj = parser.parse(content,options)
                console.log(jsonObj);
            }
          }
      }, {
        noAck: true
      });
    });
  });
});