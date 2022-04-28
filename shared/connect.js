
const {MongoClient} = require('mongodb');

module.exports = {
    db: {},
    async connect() {
        try {
            const client = await MongoClient.connect(process.env.mongodb_url);
            this.db = client.db("app");
            // console.log(this.db)
        }
        catch (err) {
            console.log(err)
        }
    }
}