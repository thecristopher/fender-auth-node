import { Router } from 'express';
import { register, me, updateMe, deleteMe } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, updateMeSchema } from '../schemas/user.js';

const router = Router();

router.post('/register', validate({ body: registerSchema }), register);

router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, validate({ body: updateMeSchema }), updateMe);
router.delete('/me', requireAuth, deleteMe);

export default router;

