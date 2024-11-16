export class CreateUserDto {
    email: string; // Email obrigatório
    senha: string; // Senha obrigatória
  
    constructor(email: string, senha: string) {
      this.email = email;
      this.senha = senha;
    }
  }
  