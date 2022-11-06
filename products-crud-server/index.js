const express = require("express");
const { MongoClient, ObjectId, ServerApiVersion, ObjectID } = require("mongodb");
const app = express();
const cors = require('cors');
const port = process.env.port || 5000;


// middleware 
app.use(cors());
app.use(express.json());
// console.log(app);

// DB setup
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// const uri = "mongodb+srv://dbuser3:avf3oIXuKtHLfxIw@cluster0.6vknfdj.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function DbConnect() {
    try {
        await client.connect();
        console.log("_________________connected _________________");

        // const productCollection = client.db("practicCRUD").collection("products");
        // const userCollection = client.db("practicCRUD").collection("users")
        // // productCollection.insertMany([{ name: "burger", price: 200 }, { name: "Juice", price: 100 }]);
        // // userCollection.insertMany([{ name: "Ashikur Rahman", mobile: "0190289333423" }, { name: "RObu", mobile: "0121789736313" }])

    }
    catch (error) {
        console.error(`${error.name}=>${error.message} from ->${error.stack}`);

    }
}
DbConnect();

// Tables___________________________________________


const productCollection = client.db("practicCRUD").collection("products");
const userCollection = client.db("practicCRUD").collection("users")






//___________________________
// get, post egula ak akta mathod 
// create opeation 
app.post("/products", async (req, res) => {
    try {
        const result = await productCollection.insertOne(req.body)
        // undefined.null();
        if (result.insertedId) {
            res.send({
                success: true,
                message: `successfully created the ${req.body.name} with id ${result.insertedId}`
            })
            console.log(result);
        }
        else {
            res.send({
                success: false,
                message: `interrupt insert operation ! something wrong!!!!`
            })
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// get/read  the data ....
app.get("/products", async (req, res) => {
    try {
        const query = {};
        const cursor = productCollection.find(query);
        const result = await cursor.toArray();
        res.send({
            success: true,
            message: `successfully got the data `,
            data: result
        });
        // console.log(result);
    } catch (error) {

    }
})
// get id based product details 
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params
        const productData = await productCollection.findOne({ _id: ObjectId(id) })
        res.send({
            success: true,
            data: productData
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// id based product info updation specific upte but put can change whole data or replace
app.patch("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body })
        console.log(req.body);
        if (result.matchedCount) {
            res.send({
                success: true,
                message: `Successfully updated ${req.body.name}`
            })
        }
        else {
            res.send({
                success: false,
                error: ` couldnot update `
            })
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})



app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id);

    try {
        const query = { _id: ObjectID(id) }
        // get the product to show info
        const productInfo = await productCollection.findOne(query);
        if (!productInfo?._id) {
            res.send({
                success: false,
                message: ` ${productInfo.name}  doesn't exist !!`
            })
            return;
        }

        const result = await productCollection.deleteOne(query);
        if (result.deletedCount) {
            res.send({
                success: true,
                message: `Successfully deleted ${productInfo.name}`,
                data: result
            })
        }


    } catch (error) {

    }
})















app.get("/", (req, res) => {
    res.send("server running...............")
})
app.listen(5000, () => console.log("Server running on", port))