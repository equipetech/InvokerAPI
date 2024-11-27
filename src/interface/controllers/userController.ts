import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../application/services/userService';
import jwt from 'jsonwebtoken';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, telefone, email, senha } = req.body;

      if (!nome || !telefone || !email || !senha) {
        res.status(400).json({ message: 'Nome, telefone, email e senha são obrigatórios.' });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({ message: 'Formato de email inválido.' });
        return;
      }

      if (!isValidPassword(senha)) {
        res.status(400).json({ message: 'A senha precisa ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.' });
        return;
      }

      const cleanedPhone = cleanPhoneNumber(telefone);

      await this.userService.createUser(nome, cleanedPhone, email, senha);
      res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error: any) {
      console.error('Erro em createUser:', error);

      if (error.code === '23505') {
        res.status(409).json({ message: 'Email já cadastrado. Por favor, use outro email.' });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor.', details: error.message });
      }
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({ message: 'Formato de email inválido.' });
        return;
      }

      const user = await this.userService.verifyUser(email, senha);

      if (!user) {
        res.status(401).json({ message: 'Credenciais inválidas.' });
        return;
      }

      if (!process.env.JWT_SECRET) {
        console.error('JWT secret is not configurado.');
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

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = (req as any).user.id;

      if (!oldPassword || !newPassword) {
        res.status(400).json({ message: 'Old password and new password are required.' });
        return;
      }

      if (!isValidPassword(newPassword)) {
        res.status(400).json({ message: 'A senha precisa ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.' });
        return;
      }

      await this.userService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (error) {
      console.error('Erro em changePassword:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async sendPasswordResetToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: 'Email é obrigatório.' });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({ message: 'Formato de email inválido.' });
        return;
      }

      await this.userService.sendPasswordResetToken(email);
      res.status(200).json({ message: 'Token de recuperação enviado para o email.' });
    } catch (error) {
      console.error('Erro em sendPasswordResetToken:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
        return;
      }

      if (!isValidPassword(newPassword)) {
        res.status(400).json({ message: 'A senha precisa ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.' });
        return;
      }

      await this.userService.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (error) {
      console.error('Erro em resetPassword:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
  async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await this.userService.getUserProfile(userId);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        localizacao: user.localizacao,
      });
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}