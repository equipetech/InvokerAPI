# **InvokerAPI**

Ah, o **InvokerAPI**. Inspirado no mago mais complexo (e irritante) de Dota 2, este backend não lança bolas de fogo ou invoca espíritos, mas tenta ser igualmente impressionante. Uma API poderosa e versátil que pode (com sorte) lidar com todas as suas necessidades – desde criar usuários até questionar suas escolhas de vida.

---

## **Sobre o Projeto**
O **InvokerAPI** foi projetado para ser o backend que você *não pediu*, mas que *merece*. Com uma arquitetura modular e código escrito às 3 da manhã (obviamente a melhor hora para programar), ele é tão flexível quanto a build de um Invoker que não sabe se vai para Exort ou Quas.

---

## **Principais Funcionalidades**
- **Autenticação e Autorização**: Proteja seus usuários... ou pelo menos tente.
- **Gerenciamento de Usuários**: Porque todo mundo precisa de um banco de dados cheio de usuários fictícios.
- **Escalabilidade Modular**: Cresça sem medo... ou com muito medo, dependendo de quem codificou.
- **Integração com Banco de Dados**: PostgreSQL: porque NoSQL é coisa de outro meta.
- **Documentação Automatizada**: Swagger para impressionar os amigos e fingir que o projeto é organizado.

---

## **Tecnologias Utilizadas**
- **Node.js**: A escolha padrão porque *por que não?*
- **Express.js**: Para que o backend seja tão "leve" quanto possível.
- **PostgreSQL**: O cérebro por trás dos seus dados. Ou algo assim.
- **Swagger**: Documentação? Claro, porque ninguém lê mesmo.
- **bcrypt**: Porque proteger senhas é mais importante do que proteger as wards.

---

## **Como Rodar o Projeto**

1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/seu-usuario/InvokerAPI.git
   cd InvokerAPI
   ```
   *(Sim, copiar e colar ainda funciona. Você está indo bem.)*

2. **Instale as Dependências**:
   ```bash
   npm install
   ```
   *"npm install"*: onde seus sonhos de disco rígido livre vão para morrer.

3. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` com informações que você definitivamente não deve esquecer (mas vai):
   ```
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=invoker
   JWT_SECRET=alguma_coisa_muito_secreta
   ```

4. **Execute as Migrações**:
   ```bash
   npm run migrate
   ```
   Se falhar, tente novamente. E novamente. Bem-vindo ao backend.

5. **Inicie o Servidor**:
   ```bash
   npm run dev
   ```
   Agora vá para `http://localhost:3000` e veja a mágica (ou bugs) acontecerem.

---

## **Contribuição**
Se você leu até aqui, parabéns! Aceitamos **issues**, **pull requests** e elogios gratuitos. Se você encontrar um bug, pode fingir que é uma *"feature"* – nós também fazemos isso.

![invoker](https://github.com/user-attachments/assets/07c89e65-8aa7-41ba-b2ec-259e28851c70)


---

Obrigado por explorar o **InvokerAPI**. E lembre-se: se algo der errado, culpe o suporte.
