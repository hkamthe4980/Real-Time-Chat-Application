import express from 'express';
import cors from 'cors';
import chatRoutes from '../src/routes/chatRoutes.js';
import authRoutes from '../src/routes/authRoutes.js';
import analyticsRoutes from '../src/routes/analyticsRoutes.js';
import tokenRoutes from "../src/routes/tokenRoutes.js"
import groupRoutes from "../src/routes/groupRoutes.js";
import messageRoutes from "../src/routes/messageRoutes.js";
import sseRotes from "../src/routes/sseRoutes.js"
// import groupChatRoutes from '../src/routes/groupChatRoutes.js';

const app = express();

app.use(cors(""));

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));



app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', tokenRoutes);
// app.use('/api/group-chat', groupChatRoutes);


// ROUTES
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/sse", sseRotes);




app.get('/', (req, res) => {
  res.send('LLM Streaming Backend Running ');
});

export default app;

