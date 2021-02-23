var amqp = require('amqplib/callback_api');
var Parser = require("fast-xml-parser").j2xParser;

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'IdentityEndPoint';
    var msg = new Person();
    console.log(" Json %s", msg);

    channel.assertExchange(exchange, 'fanout', {
      durable: true
    });


    var defaultOptions = {
        attributeNamePrefix : "@_",
        attrNodeName: "@", //default is false
        textNodeName : "#text",
        ignoreAttributes : true,
        cdataTagName: "__cdata", //default is false
        cdataPositionChar: "\\c",
        format: false,
        indentBy: "  ",
        supressEmptyNode: false,
    };
    var parser = new Parser(defaultOptions);
    var xml = `<?xml version="1.0"?> <Person xmlns="http://tempuri.net/ConsoleApp1">${parser.parse(msg)}</Person>`;

    // let xml2 = `<?xml version="1.0"?><Person xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://tempuri.net/nodejs">`;
    // xml2 += `<message_id>${uuid()}</message_id>`+xml+"</Person>";

    // self.exch.publish('MyNsbQueueName', 
    //                   '{DateTimeSent: "'+ moment.utc().format() +'", Message: "'+msg.match[0]+'"}', {
    //     messageId: guid(),
    //     type: 'MyMessageAssembly.MessageFromHubot'
    //   });

    channel.publish(exchange, '', Buffer.from(xml),{
        messageId: uuid()
    });
    console.log(" [x] Sent %s", xml);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});

var uuid = function() {
    var rand = Math.random;
    var nbr, randStr = "";
    do {
        randStr += (nbr = rand()).toString(16).substr(3, 6);
    } while (randStr.length < 30);
    return (
        randStr.substr(0, 8) + "-" +
        randStr.substr(8, 4) + "-4" +
        randStr.substr(12, 3) + "-" +
        ((nbr*4|0)+8).toString(16) + // [89ab]
        randStr.substr(15, 3) + "-" +
        randStr.substr(18, 12)
    );
};

class Person {
    constructor(){
        this.Id = 100,
        this.Firstname = "abbas";
        this.Lastname="khalili";
    }
}