// Initialize the express framework
var express 	 	= require('express'),
	path 			= require('path'),
	mongoose		= require('mongoose'),
	bodyParser		= require('body-parser'),
    favicon         = require('serve-favicon');



// Express setup 
var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client')));
app.use(favicon(__dirname + '/../client/images/favicon.ico'));

// Routes set up
var router 	= express.Router();


// Create a product
//router.post('/api/product', product.create);

// Get one product, update one product, delete one product
//router.route('/api/product/:id')
//	.get(product.read)
//	.put(product.update)
//	.delete(product.delete);

// Register the routing
router.use('/stops', require('./controllers/mongo/stops'));
router.use('/api', require('./controllers/api'));
app.use('/', router);

mongoose.connect('mongodb://localhost/livept');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', startServer);


// Start up the server
function startServer(){
	var server = app.listen(3000, function(){
		var port = server.address().port;
		console.log('Listening on port ' + port);
	})
}

