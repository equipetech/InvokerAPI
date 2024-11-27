import bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/ports/userRepository';
import { User } from '../../domain/entities/user';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import axios from 'axios';


export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(nome: string, telefone: string, email: string, senha: string): Promise<void> {
    const senha_hash = await bcrypt.hash(senha, 10);

    const user = new User(
      uuidv4(),
      nome,
      email,
      senha_hash,
      '',
      null,
      '',
      telefone
    );

    await this.userRepository.save(user);
  }
  

  async verifyUser(email: string, senha: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        console.log('User not found');
        return null;
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);

      if (!isPasswordValid) {
        console.log('Invalid password');
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error in verifyUser:', error);
      throw new Error('Internal server error');
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.senha_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.senha_hash = newHashedPassword;

    await this.userRepository.save(user);
  }

  async sendPasswordResetToken(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const token = (await bcrypt.genSalt(12)).substring(0, 12);
    try {
      await axios.post(
        `${process.env.BREVO_API_URL}/v3/smtp/email`,
        {
          sender: { email: process.env.EMAIL_USER },
          to: [{ email: user.email }],
          subject: 'Password Reset',
          textContent: `Use este token para redefinir sua senha: ${token}`,
          htmlContent: `<p>Use este token para redefinir sua senha: <strong>${token}</strong></p>`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
          },
        }
      );
      console.log('Email enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar o email:', error);
      throw new Error('Erro ao enviar o email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.userRepository.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.senha_hash = newHashedPassword;

    await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
  
  async getUserProfile(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }
}

