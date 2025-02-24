# WebdriverIO API Tests (Desafio: https://serverest.dev/)

Este repositório contém um guia detalhado para configurar **WebdriverIO** com foco em **testes de API - Desafio serverest.dev**.

---

## 1. Crie um diretório para seu projeto

```bash
mkdir webdriverio-api-tests
cd webdriverio-api-tests
```

## 2. Inicialize o projeto Node.js

```bash
npm init -y
```

Esse comando criará o arquivo `package.json` com as configurações básicas do seu projeto.

## 3. Instale as dependências necessárias

Mesmo para testes de API, aproveitamos a estrutura do WebdriverIO:

```bash
npm install --save-dev \
  @wdio/cli \
  @wdio/local-runner \
  @wdio/mocha-framework \
  @wdio/spec-reporter \
  axios \
  chai
```

### O que cada dependência faz:
- `@wdio/cli`: CLI do WebdriverIO para configurar o projeto.
- `@wdio/local-runner`: Permite rodar testes localmente.
- `@wdio/mocha-framework`: Integração com o Mocha (framework de testes).
- `@wdio/spec-reporter`: Exibe resultados de testes de forma legível no console.
- `axios`: Biblioteca para fazer chamadas HTTP (GET, POST, PUT, DELETE...).
- `chai`: Biblioteca de asserção (pode usar `expect`, `assert`, etc.).

## 4. Gere o arquivo de configuração do WebdriverIO

Execute o wizard do WebdriverIO para criar automaticamente o `wdio.conf.js`:

```bash
npx wdio config
```

### Passo a passo do wizard:
1. **Onde salvar as configurações?**  
   Escolha `wdio.conf.js`.
2. **Tipo de teste?**  
   Selecione `local`.
3. **Framework?**  
   Escolha `mocha`.
4. **Padrão dos arquivos de teste?**  
   Geralmente `./test/specs/**/*.js`.
5. **Serviço de browser?**  
   Para testes de API, escolha "None" ou um serviço local.
6. **Reporter(s)?**  
   Selecione `spec`.
7. **Nível de logs?**  
   Escolha `info` ou `error`.
8. **Confirma?**  
   Sim.

Isso criará um arquivo `wdio.conf.js` na raiz do projeto.

## 5. Ajustes no `wdio.conf.js` para testes de API

Abra o `wdio.conf.js` e faça as seguintes alterações:

- Remova ou comente as configurações de browser (`capabilities`) se não for usar testes de UI:

```javascript
// capabilities: [{
//     maxInstances: 1,
//     browserName: 'chrome',
// }],
// ou deixe como array vazio:
capabilities: [],
```
Dessa forma, o WebdriverIO não tentará abrir nenhum navegador e estará focado em testes de API.

- Ajuste o timeout do Mocha se necessário:

```javascript
mochaOpts: {
    timeout: 60000,
},
```

## 6. Estrutura de pastas dos testes

O padrão definido pelo wizard deve ser algo como `./test/specs/**/*.js`.  
Crie essa estrutura:

```bash
test
└── specs
    └── usersApi.spec.js
```

## 7. Criando os Testes solicitados

No arquivo `test/specs/usersApi.spec.js`, criamos todos os testes solicitados no desafio:

1. Deve listar todos os usuários (GET /usuarios)
2. Deve criar um novo usuário (POST /usuarios)
3. Deve retornar os dados de um usuário específico (GET /usuarios/{id})
4. Deve atualizar um usuário (PUT /usuarios/{id})
5. Deve excluir um usuário (DELETE /usuarios/{id})


## 8. Executando os testes localmente

Para executar, basta:

```bash
npm run test ou  npm run test:debug

```

O comando npm run test fará:
1. Ler o `wdio.conf.js`.
2. Procurar arquivos no padrão `test/specs/*.js`.
3. Executar os testes.

e o comando npm run test:debug fará o mesmo só que em modo debug (Caso seja necessário)

No final, você verá o resultado no console (graças ao `spec-reporter`).

## 9. Integração com CI
Em qualquer pipeline (GitHub Actions, GitLab CI, Jenkins, etc.):

Instale as dependências (npm ci ou npm install).
Execute o WebdriverIO (npx wdio).
Isso é suficiente para rodar os testes de API automaticamente em cada push ou Pull Request.

### (GitHub Actions - Arquivo de configuração):

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npx wdio
```

## 10. Geração de relatórios - Optamos pelo SPEC pois é simples e bem objetivo

```bash
npm install --save-dev @wdio/spec-reporter
```

Configure no `wdio.conf.js`:

```javascript
reporters: ['spec'],
```

Para gerar o relatório, basta executar os testes que no final ele exibe um resumo. 

## Estrutura Final de Pastas

```plaintext
.
├── package.json
├── package-lock.json
├── wdio.conf.js
└── test
    └── specs
        └── usersApi.spec.js
```

## Resumo

1. Crie o diretório do Projeto
2. Inicie um projeto Node.js (`npm init -y`).
3. Instale WebdriverIO e dependências.
4. Configure o projeto via Wizard (`npx wdio config`).
5. Ajuste o arquivo para testes de API.
6. Estrutura de pastas de testes
7. Criando os testes solicitados
8. Execute localmente (`npx wdio`).
9. Integre no CI para execução automática.
10. Relatório SPEC

