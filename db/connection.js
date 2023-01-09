const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
let database = "mongodb+srv://jitendramahali:Jitendra8018@cluster0.rwlcavh.mongodb.net/sample_airbnb?retryWrites=true&w=majority";


mongoose.connect(database).then(() => {
    console.log('connection ')
}).catch((e) => {
    console.log("not conntct")
})




