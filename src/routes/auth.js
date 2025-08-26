import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas/auth.js'; 

const router = Router();

router.post('/login', validate({ body: loginSchema }), login);
router.post('/logout', logout);

export default router;
