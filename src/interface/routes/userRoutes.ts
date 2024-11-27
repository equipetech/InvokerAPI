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
 *             nome: "John Doe"
 *             telefone: "(11) 98765-4321"
 *             email: "user@example.com"
 *             senha: "SenhaForte123!"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Entrada inválida
 *       500:
 *         description: Erro interno do servidor
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

/**
 * @swagger
 * /api/change-password:
 *   post:
 *     summary: Altera a senha do usuário logado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *           example:
 *             oldPassword: "SenhaAntiga123!"
 *             newPassword: "SenhaNova123!"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Entrada inválida
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/change-password', authMiddleware, asyncHandler((req: Request, res: Response, next: NextFunction) => userController.changePassword(req, res, next)));

/**
 * @swagger
 * /api/send-password-reset-token:
 *   post:
 *     summary: Envia um token de recuperação de senha para o email do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       200:
 *         description: Token de recuperação enviado para o email
 *       400:
 *         description: Entrada inválida
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/send-password-reset-token', asyncHandler((req: Request, res: Response, next: NextFunction) => userController.sendPasswordResetToken(req, res, next)));

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Altera a senha do usuário usando o token de recuperação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *           example:
 *             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             newPassword: "SenhaNova123!"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Entrada inválida
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/reset-password', asyncHandler((req: Request, res: Response, next: NextFunction) => userController.resetPassword(req, res, next)));
/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Retorna os dados do usuário logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *                 telefone:
 *                   type: string
 *                 localizacao:
 *                   type: string
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               nome: "John Doe"
 *               email: "user@example.com"
 *               telefone: "(11) 98765-4321"
 *               localizacao: "São Paulo, SP"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/me', authMiddleware, asyncHandler((req: Request, res: Response, next: NextFunction) => userController.getUserProfile(req, res, next)));

export default router;