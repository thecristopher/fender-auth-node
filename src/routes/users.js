import { Router } from 'express';
import { register, me, updateMe, deleteMe } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateMe);
router.delete('/me', requireAuth, deleteMe);

export default router;
