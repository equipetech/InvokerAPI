export class User {
  constructor(
    public id: string,
    public nome: string = '',
    public email: string,
    public senha_hash: string,
    public biografia: string = '',
    public localizacao: string | null = null, 
    public avatar_url: string = '',
    public telefone: string = '', 
    public criado_em?: Date
  ) {}
}