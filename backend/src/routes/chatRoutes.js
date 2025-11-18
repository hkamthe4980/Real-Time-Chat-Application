import express from 'express';
import { streamChatResponse , getChatHistory} from '../controller/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
// import { checkTokenBudget } from '../middleware/tokenBudgetMiddleware.js';


const router = express.Router();

// SSE endpoint for streaming
router.get('/stream',verifyToken, streamChatResponse);
router.get('/history',verifyToken, getChatHistory);


export default router;
