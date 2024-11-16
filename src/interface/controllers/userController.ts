import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../application/services/userService';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../../application/services/emailService'; 
import { CreateUserDto } from '../../application/dto/createUserDto';
import { LoginDto } from '../../application/dto/loginDto';

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
    try {
      const createUserDto = new CreateUserDto(req.body.email, req.body.senha);

      // Validação dos campos obrigatórios
      if (!createUserDto.email || !createUserDto.senha) {
        res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        return;
      }

      // Validação do formato do email e senha
      if (!isValidEmail(createUserDto.email)) {
        res.status(400).json({ message: 'Formato de email inválido.' });
        return;
      }

      if (!isValidPassword(createUserDto.senha)) {
        res.status(400).json({ message: 'A senha precisa ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.' });
        return;
      }

      // Criação do usuário e envio de e-mail de boas-vindas
      await this.userService.createUser(createUserDto.email, createUserDto.senha);
      await sendWelcomeEmail(createUserDto.email);

      res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error) {
      console.error('Erro em createUser:', error);
      next(new Error('Erro interno do servidor.'));
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginDto = new LoginDto(req.body.email, req.body.senha);

      // Validação dos campos obrigatórios
      if (!loginDto.email || !loginDto.senha) {
        res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        return;
      }

      // Validação do formato do email e senha
      if (!isValidEmail(loginDto.email)) {
        res.status(400).json({ message: 'Formato de email inválido.' });
        return;
      }

      const user = await this.userService.verifyUser(loginDto.email, loginDto.senha);

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
      next(new Error('Erro interno do servidor.'));
    }
  }
  
}
