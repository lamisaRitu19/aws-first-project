const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const cors = require('cors');

const schema = require('./server/schema/schema');
const { default: mongoose } = require('mongoose');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))

mongoose.connect(
    `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphql-cluster.em4hdni.mongodb.net/?retryWrites=true&w=majority&appName=graphQL-cluster`, 
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    app.listen({port: port}, () => {
        console.log('Listening for requests on my awesome post ' + port);
    })  
}).catch((e) => console.log("Error::" + e))       

// app.listen({port: port}, () => {
//     console.log('Listening for requests on my awesome post ' + port);
// })  



// mongodb+srv://lamisa:<password>@graphql-cluster.em4hdni.mongodb.net/?retryWrites=true&w=majority&appName=graphQL-cluster