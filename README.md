# Projeto F --- 1 --- 3 --- P --- 3
```bash
# Devido a o projeto ser publico evitei usar dados com o nome do órgão como pode ver acima 
```
Esta API construída com **Node.js**, **Express**, **Sequelize** e **PostgreSQL**.

---

## 📦 Tecnologias

* Node.js - Stack Principal do Desafio
* Express - Framework Sugerido
* Sequelize (ORM) - Para validar o banco de dados e com as migrations ter uma criação fiel ao projeto
* PostgreSQL - Databse Sugerida
* fast-json-patch (para JSON Patch) nos casos de rotas com patch
* dotenv (variáveis de ambiente) vai junto do projeto e fora do gitignore para facilitar a execução do projeto

---

## 🚀 Pré-requisitos

* Node.js v18+
* npm ou yarn
* PostgreSQL instalado e rodando

---

## 🔧 Instalação

1. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

2. Copie o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

3. Edite o `.env` com suas credenciais ou use a que estar por padrão no .env local:

   ```ini
   DB_USER=postgres
   DB_PASS=sua_senha
   DB_NAME=meubanco_dev
   DB_HOST=localhost ou o da sua database
   PORT=3000
   NODE_ENV=development
   ```

---

## 🗂 Estrutura de Pastas

```
project-root/
├── src/
│   ├── controllers/        # Controllers (HTTP handlers)
│   ├── database/
│   │   ├── config.js       # Configurações do Sequelize
│   │   ├── conn.js         # Instância Sequelize
│   │   ├── migrations/     # Migrations
│   │   └── models/         # Models Sequelize
│   ├── routes/             # Definição de rotas
│   └── services/           # Lógica de negócio
├── .sequelizerc            # Configuração paths Sequelize CLI
├── .env                    # Exemplo de variáveis de ambiente
├── package.json
└── README.md
```

---

## 📋 Configurando o Sequelize CLI

Crie o arquivo `.sequelizerc` na raiz:

```js
const path = require('path');

module.exports = {
  config: path.resolve('src', 'database', 'config.js'),
  'models-path': path.resolve('src', 'database', 'models'),
  'migrations-path': path.resolve('src', 'database', 'migrations'),
  'seeders-path': path.resolve('src', 'database', 'seeders')
};
```

---

## 📦 Banco de Dados e Migrations

1. Crie o banco de dados no PostgreSQL de acordo com o que foi configurado no .env:

   ```sql
   CREATE DATABASE meubanco_dev;
   ```

2. Execute as migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

3. (Opcional) Para resetar:

   ```bash
   npx sequelize-cli db:migrate:undo:all
   npx sequelize-cli db:migrate
   ```

---

## 🏃 Iniciando a aplicação

```bash
npm run dev   # com nodemon (se o script já configurado... sugiro olhar o package.json)
# ou
npm start     # sem hot reload
```

A API estará disponível em `http://localhost:/api/v1`.

---

## 📚 Endpoints Principais

### Produtos

| Método | Rota            | Descrição                                |
| ------ | --------------- | ---------------------------------------- |
| POST   | `/products`     | Criar produto (Location no header).      |
| GET    | `/products`     | Listar produtos com filtros e paginação. |
| GET    | `/products/:id` | Obter produto por ID.                    |
| PATCH  | `/products/:id` | Atualizar campos via JSON-Patch.         |
| DELETE | `/products/:id` | Soft-delete (inativação) de produto.     |

### Cupons

| Método | Rota           | Descrição                              |
| ------ | -------------- | -------------------------------------- |
| POST   | `/coupons`     | Criar cupom (Location no header).      |
| GET    | `/coupons`     | Listar cupons com filtros e paginação. |
| GET    | `/coupons/:code` | Obter cupom por código.              |

---

## 🛠️ Ferramentas úteis

* **Postman** / **curl** para testar endpoints junto ao projeto vai a documentação para utilizar no postman
* **DBeaver** ou **pgAdmin** para gerenciar o banco

---

## 📖 Referências

* [Sequelize Docs](https://sequelize.org/)
* [JSON Patch (RFC 6902)](https://tools.ietf.org/html/rfc6902)

---