import { User } from '../../domain/entities/user';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>; 
  save(user: User): Promise<void>;
}