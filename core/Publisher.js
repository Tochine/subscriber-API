const express = require("express");
const axios = require('axios')

class Publisher {
    subscribers = {}
    app = null

    setup () {
        this.app = express()
        this.app.use(express.urlencoded({ extended:false }));
        this.app.use(express.json());

        this.app.use("/publisher", this.routes())

        this.app.use((req, res, next) => {
            console.log(`:::[PUBLISHER] => Visted route ${req.url} with method ${req.method}`)
            next()
        })
        return this
    }

    routes() {
        const router = express.Router()

        // This is to add subscribers
        router.post('/addsubscriber', (req,res) => {
            const { subscriber, topic } = req.body

            // It adds subscribers to a topic depending om if the topic exists
            if (topic in this.subscribers) {
                this.subscribers[topic].push(subscriber)
            } else {
                this.subscribers[topic] = [subscriber]
            }

            res.status(200).json({
                subscribers : this.subscribers,
                message: "Subs added"
            })
        })

        // This is to notify the subscribers
        router.post('/notify/:topic', async (req, res) => {
            try {
                const { topic } = req.params
                const { data } = req.body

                if (topic in this.subscribers) {
                    for ( const url  of this.subscribers[topic]) {
                        // This is where the messages are being broadcasted to the subscribers
                        await axios.post(`${url}/listener`, {
                            topic, data 
                        })
                    }
                }
                
                res.status(200).json({
                    url: `publisher/${topic}`,
                    data
                })
            } catch (err) {
                res.status(401).json(err)
            }
            
        })

        return router
    }

    server(port) {
        this.app.listen(port, ()=> {
            console.log(`publisher server started on port ${port}`)
        })
    }
}

module.exports = Publisher;