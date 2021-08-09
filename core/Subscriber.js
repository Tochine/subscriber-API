const express = require("express");

class Subscriber {
    app = null
    constructor(name, PORT, domain){
        this.name = name;
        this.PORT = PORT;
        this.domain = domain;
    }

    setup () {
        this.app = express();
        this.app.use(express.urlencoded({ extended:false }));
        this.app.use(express.json());

        this.app.use(this.domain, this.routes());

        this.app.use((req, res, next) => {
            console.log(`:::[SUBSCRIBER(${this.name})] => Visted route ${req.url} with method ${req.method}`);
            console.log(`:::[SUBSCRIBER(${this.name})] => body:: ${JSON.stringify(req.body)}`);
            next();
        })
        return this
    }

    routes() {
        const router = express.Router()
        router.post('/listener', (req, res) => {
            const { topic, data } = req.body;
            console.log({
                owner: `Subscriber::${this.name}`,
                topic,
                data
            });
            res.status(200).json({
                url: `publisher/${topic}`,
                data
            });
        });
        return router;
    }

    server() {
        this.app.listen(this.PORT, ()=> {
            console.log(`Subsriber[${this.name}] server started on port ${this.PORT}`);
        });
    }
}

module.exports = Subscriber;