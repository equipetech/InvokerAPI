import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../application/services/userService';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../../application/services/emailService'; 

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, nome, senha_hash } = req.body;

    if (!email || !senha_hash) {
      return next(new Error('Email e senha são obrigatórios, mas aparentemente você esqueceu de fornecer.'));
    }

    if (!isValidEmail(email)) {
      return next(new Error('Formato de email inválido. Tente algo como "usuario@dominio.com".'));
    }

    if (!isValidPassword(senha_hash)) {
      return next(new Error('A senha precisa ter 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial. Porque, segurança... e porque complicar sua vida é um bônus.'));
    }

    try {
      // Cadastrar o usuário usando o serviço
      await this.userService.createUser(email, senha_hash);

      await sendWelcomeEmail(email, nome || 'Usuário');

      res.status(201).json({ message: 'Usuário criado com sucesso. Parabéns, você fez uma coisa funcionar!' });
    } catch (error) {
      console.error('Erro em createUser:', error);
      next(new Error('Erro interno do servidor. Talvez você devesse tentar novamente quando estivermos menos ocupados.'));
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro em getAllUsers:', error);
      next(new Error('Erro interno do servidor.'));
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ message: 'Email e senha são obrigatórios.' });
      return;
    }

    try {
      const user = await this.userService.verifyUser(email, senha);

      if (!user) {
        res.status(401).json({ message: 'Credenciais inválidas.' });
        return;
      }

      if (!process.env.JWT_SECRET) {
        console.error('JWT secret is not configured.');
        res.status(500).json({ message: 'Erro de configuração do servidor.' });
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error('Erro em login:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
