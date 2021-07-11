const mongoose = require("mongoose")

var mongoDB = "mongodb+srv://Christoffer9712:Chelsea9712@cluster0.l6bhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectDB = async() =>{
    await mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
    console.log('db connected')
}
mongoose.Promise = global.Promise;
module.exports = connectDB;