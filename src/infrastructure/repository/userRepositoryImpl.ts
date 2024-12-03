import { UserRepository } from '../../domain/ports/userRepository';
import { User } from '../../domain/entities/user';
import { UserEntity } from '../../infrastructure/database/entities/userEntity';
import { AppDataSource } from '../../ormconfig';
export class UserRepositoryImpl implements UserRepository {
  async findAll(): Promise<User[]> {
    const repository = AppDataSource.getRepository(UserEntity);
    const users = await repository.find();
    return users.map((user) => new User(
      user.id,
      user.nome,
      user.email,
      user.senha_hash,
      user.biografia,
      user.localizacao,
      user.avatar_url,
      user.telefone, 
      user.criado_em
    ));
  }

  async findById(id: string): Promise<User | null> {
    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository.findOneBy({ id });
    if (!user) return null;
    return new User(
      user.id,
      user.nome,
      user.email,
      user.senha_hash,
      user.biografia,
      user.localizacao,
      user.avatar_url,
      user.telefone, 
      user.criado_em
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository.findOneBy({ email });
    if (!user) return null;
    return new User(
      user.id,
      user.nome,
      user.email,
      user.senha_hash,
      user.biografia,
      user.localizacao,
      user.avatar_url,
      user.telefone, 
      user.criado_em
    );
  }

  async save(user: User): Promise<void> {
    const repository = AppDataSource.getRepository(UserEntity);

    const userEntity = new UserEntity();
    userEntity.id = user.id;
    userEntity.nome = user.nome;
    userEntity.email = user.email;
    userEntity.senha_hash = user.senha_hash;
    userEntity.biografia = user.biografia;
    userEntity.localizacao = user.localizacao || null; 
    userEntity.avatar_url = user.avatar_url;
    userEntity.telefone = user.telefone; 
    userEntity.criado_em = user.criado_em ?? new Date();

    await repository.save(userEntity);
  }
}