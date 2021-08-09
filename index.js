const Publisher = require('./core/Publisher');
const Subscriber = require('./core/Subscriber');

const PORT = 9000;

const subscriber1 = new Subscriber("england", 7070, '/england1');
const subscriber2 = new Subscriber("spain", 7071, "/spain1");

const publisher = new Publisher();

subscriber1.setup().server();
subscriber2.setup().server();

publisher.setup().server(PORT);

module.exports = {
    Subscriber, Publisher
};