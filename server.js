const path = require('path');
require('dotenv').config();
require('colors');
const express = require('express');
const securityMiddlewares = require('./security');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const auth = require('./routes/auth');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const globalErrorMiddleware = require('./controllers/error');

const app = express();

require('./startup/db');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(fileupload());

app.use(cookieParser());

securityMiddlewares(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', auth);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);

app.use(globalErrorMiddleware);

const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
require('./startup/error-handling')(server);
