//Importing core modules
const path = require('path');
const fs = require('fs');
const https = require('https');

//Third party packages requirements
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

//Importing User class
const User = require('./models/user');

//Importing different routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//Importing 404 error page controller
const errorController = require('./controllers/error');

//MongoDB connection string
//Use below string to connect to MongoDB atlas
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-vkggs.mongodb.net/${
  process.env.MONGO_DEFAULT_DATABASE
}?retryWrites=true&w=majority`;
// const MONGODB_URI = 'mongodb://localhost/ecommerce';

//Initialising express
const app = express();

//For storing session in MongoDB
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

//Initialising CSRF protection
const csrfProtection = csrf();

//Configuring view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Using helmet to set various http headers to protect the app
app.use(helmet());

//Using compression to send compressed response
app.use(compression());

// Using moragn for efficiently logging output
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

//Configuring bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//Configuring https and reading server.key and server.cert
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

// Configuring multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

//Making "public" folder static
app.use(express.static(path.join(__dirname, 'public')));

//Making "images" folder static
app.use('/images', express.static(path.join(__dirname, 'images')));

//Configuring express-session
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//Using CSRF protection
app.use(csrfProtection); //After Configuring session only

//Using flash
app.use(flash()); //After Configuring session only

//Routes
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(err);
    });
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.get('/500', (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error occurred!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

app.use('/', errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
});

//Connecting to MongoDB client and after successful connection listening

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    // Listening to port 12000
    console.log('Connected to MongoDB on MongoDB Atlas');
    // https                                                          //Uncomment this to enable SSL and then use https instead of app
    //   .createServer({ key: privateKey, cert: certificate }, app)
    app.listen(process.env.PORT || 13000, () => {
      console.log('Server started on port ' + (process.env.PORT || 13000));
    });

    //On app crashing
    process.on('uncaughtException', err => {
      console.log(err);
    });

    //On killing the app
    process.on('SIGTERM', err => {
      console.log(err);
    });
  })
  .catch(err => {
    console.log("Can't connect to MongoDB instance");
  });
