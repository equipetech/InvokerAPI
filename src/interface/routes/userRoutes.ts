import express, { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../../application/services/userService';
import { UserRepositoryImpl } from '../../infrastructure/repository/userRepositoryImpl';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction): Promise<void> => {
        return fn(req, res, next).catch(next);
    };
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', authMiddleware, asyncHandler((req: Request, res: Response, next: NextFunction) => userController.getAllUsers(req, res, next)));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: "user@example.com"
 *             senha_hash: "SenhaForte123!"
 */
router.post('/users', asyncHandler((req: Request, res: Response, next: NextFunction) => userController.createUser(req, res, next)));

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Faz login de um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: "user@example.com"
 *             senha: "SenhaForte123!"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Entrada inválida
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', asyncHandler((req: Request, res: Response, next: NextFunction) => userController.login(req, res, next)));
export default router;