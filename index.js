var amqp = require('amqplib/callback_api');

//todo subscribe to the following topics: house.sensor.plant.*
//the wild card will be in the form of plant-name.sensor-reading
//this app will log sensor information about an individual plant into a postgres database

amqp.connect(process.env.RABBIT_MQ_URL, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'topic_logs';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
});