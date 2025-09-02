const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
require("dotenv").config();
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const initStockMonitor = require('./src/utils/stockMonitor');


const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET','POST','PUT','DELETE']
  }
});
app.set('io', io);

io.on('connection', (socket) => {
  // frontend: socket.emit('join', userId)
  socket.on('join', (userId) => {
    if (userId) socket.join(String(userId));
  });
});

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// db
connectDB();

// routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/pizza', require('./src/routes/pizzaRoutes'));
app.use('/api/user', require('./src/routes/userRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/pay', require('./src/routes/paymentRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/email', require('./src/routes/emailLogs'));

// server.js (add this with other app.use lines)
app.use('/api/orders', require('./src/routes/orderRoutes'));


app.get('/', (_req, res) => res.send('Pizza API running'));

// error handler (last)
app.use((err, _req, res, _next) => {
  console.error('ERR:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// cron
initStockMonitor();
