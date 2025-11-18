import express from 'express';
import cors from 'cors';
import chatRoutes from '../src/routes/chatRoutes.js';
import authRoutes from '../src/routes/authRoutes.js';
import analyticsRoutes from '../src/routes/analyticsRoutes.js';

const app = express();

app.use(cors(""));

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET"],
  credentials: true,
}));


app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/', (req, res) => {
  res.send('LLM Streaming Backend Running ');
});

export default app;

