
var bp = require("body-parser");
var mongoose = require("mongoose");
var mongoURI = require("../config/keys").mongoURI;
mongoose.Promise = global.Promise;

mongoose.connect(mongoURI);

var urlencodedParser = bp.urlencoded({extended: false});

var todoschema = new mongoose.Schema({
    item: String
});

var todo = mongoose.model("Todo", todoschema);  // make a model


module.exports = function (app) {

    app.get("/todo", function (req, res) {
        // get data from mongodb and pass it to view
        todo.find({}, function (err, data) {
            if (err) throw err;
            else {
                res.render("todo", {todos: data})
            }
        });  // find all items in this model
    });

    app.post("/todo", urlencodedParser, function (req, res) {
        // get data from view and pass it to mongodb

        var newTodo = todo(req.body).save(function (err, data) {
            if (err) throw err;
            else {
                res.json(data);
            }
        });
    });

    app.delete("/todo/:item", function (req, res) {
        // delete the requested item from mongodb

        console.log(req.params.item);
        todo.find({item: req.params.item.replace(" ", "")}).remove(function (err, data) {
            if (err) throw err;
            res.json(data);

        })
    });
};