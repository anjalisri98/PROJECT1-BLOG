const express = require('express');
var bodyParser = require('body-parser');

const route = require('./assignment_axios/route');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://saurabh042160:iafSq7ML1zCfugKI@cluster1.ymdh1.mongodb.net/saurabh042160?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB_connected"))
    .catch(err => console.log(err))
app.use('/', route);

app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});
