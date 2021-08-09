const supertest = require("supertest");
const Publisher = require("../core/Publisher");
const Subscriber = require("../core/Subscriber");

let app = null
let server = null
const subscriberPort = 7000

beforeAll(async ()=> {
    new Subscriber("england", subscriberPort, '/england1').setup().server()
    app = new Publisher().setup().app
    server = supertest(app)
})

describe('Publisher', () => {
    it ('This should add subscriber', async () => {
        const res = await server.post('/publisher/addsubscriber')
            .send({
                "subscriber": `http://localhost:${subscriberPort}/england1`,
                "topic": "tochi"
            })
        
        expect(res.body.subscribers).toEqual({
            "tochi": [`http://localhost:${subscriberPort}/england1`]
        })
    });
});

describe('Subscriber', () => {
    it('This should publish a topic', async () => {
        const res = await server.post('/publisher/notify/precious')
            .send({
                "data": {
                    "url": "https://google.com"
                }
            });

        expect(res.body.data).toEqual({
            "url": "https://google.com"
        });
    });
});