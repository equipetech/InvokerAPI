# Dockerfile

# 1. Use uma imagem base do Node.js
FROM node:16

# 2. Crie um diretório de trabalho
WORKDIR /app

# 3. Copie o arquivo package.json e package-lock.json
COPY package*.json ./

# 4. Instale as dependências do projeto
RUN npm install

# 5. Copie todo o código do projeto para o contêiner
COPY . .

# 6. Compile o código (se necessário)
# RUN npm run build (caso haja um script build)

# 7. Exponha a porta em que a aplicação está rodando (por exemplo, 3000)
EXPOSE 3000

# 8. Defina o comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
