const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const questionRoutes = require('./routes/question.routes');
const answerRoutes = require('./routes/answer.routes');
const mongoDB = require('./config/db');

mongoDB();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
