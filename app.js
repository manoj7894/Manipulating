// const path = require('path');

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
// const flash = require('connect-flash');

// const errorController = require('./controllers/error');
// const User = require('./models/user');

// require('dotenv').config();

// const MONGODB_URI = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

// const app = express();
// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: 'sessions'
// });
// const csrfProtection = csrf();

// // Set up view engine and view directory
// app.set('view engine', 'ejs');
// app.set('views', 'views');

// // Import routes
// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');

// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: false,
//     store: store
//   })
// );
// app.use(csrfProtection);
// app.use(flash());

// // Middleware to attach user to request if authenticated
// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => {
//       console.log(err);
//       next(); // Ensure we call next() to avoid hanging
//     });
// });

// // Middleware to set local variables for views
// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// // Set up routes
// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);

// // 404 error handler
// app.use(errorController.get404);

// // Connect to MongoDB and start the server
// mongoose
//   .connect(MONGODB_URI, {
//     useNewUrlParser: true, // Use new URL parser
//     useUnifiedTopology: true // Use unified topology
//   })
//   .then(result => {
//     console.log('Connected to MongoDB');
//     app.listen(3000, () => {
//       console.log('Server is running on http://localhost:3000');
//     });
//   })
//   .catch(err => {
//     console.log('Failed to connect to MongoDB:', err);
//   });


const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

require('dotenv').config();

// Get MongoDB URI from environment variables or use a default
const MONGODB_URI = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

const app = express();

// Set up MongoDB session store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// CSRF protection middleware
const csrfProtection = csrf();

// Set up view engine and view directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// Import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

// Use CSRF protection and flash messages middleware
app.use(csrfProtection);
app.use(flash());

// Middleware to attach user to request if authenticated
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
      next(); // Ensure we call next() to avoid hanging
    });
});

// Middleware to set local variables for views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Set up routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 404 error handler
app.use(errorController.get404);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true // Use unified topology
  })
  .then(result => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB:', err);
  });
