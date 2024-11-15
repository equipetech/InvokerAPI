import { UserRepository } from '../../domain/ports/userRepository';
import { User } from '../../domain/entities/user';
import { v4 as uuidv4 } from 'uuid'; 
import bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(email: string, senha: string): Promise<void> {
        const senha_hash = await bcrypt.hash(senha, 10); 
    
        const user = new User(
            uuidv4(),
            '', 
            email,
            senha_hash,
            '', 
            null, 
            ''  
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

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}