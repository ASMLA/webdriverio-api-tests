Guia Passo a Passo para Configurar Testes de API com WebdriverIO (https://serverest.dev/)

Este documento apresenta um guia detalhado para configurar WebdriverIO com foco em testes de API com as seguintes instruções:

"Você está trabalhando em uma aplicação que gerencia informações de usuários (Criação,
atualização, exclusão e leitura de usuário). A aplicação expõe uma API RESTfull para
realizar essas operações. Os endpoints da API são os seguintes:
○ GET /users: Retorna uma lista de todos os usuários.
○ POST /users: Cria um novo usuário.
○ GET /users/{id}: Retorna os detalhes de um usuário específico.
○ PUT /users/{id}: Atualiza as informações de um usuário.
○ DELETE /users/{id}: Exclui um usuário.
Sugestão de API: https://serverest.dev/#/"


1. Crie um diretório para seu projeto

mkdir webdriverio-api-tests
cd webdriverio-api-tests

2. Inicialize o projeto Node.js

npm init -y

Esse comando criará o arquivo package.json com as configurações básicas do seu projeto.

3. Instale as dependências necessárias

Mesmo para testes de API, aproveitamos a estrutura do WebdriverIO:

npm install --save-dev ^
  @wdio/cli ^
  @wdio/local-runner ^
  @wdio/mocha-framework ^
  @wdio/spec-reporter ^
  axios ^
  chai

O que cada dependência faz:

- @wdio/cli: CLI do WebdriverIO para configurar o projeto.
- @wdio/local-runner: Permite rodar testes localmente.
- @wdio/mocha-framework: Integração com o Mocha (framework de testes).
- @wdio/spec-reporter: Exibe resultados de testes de forma legível no console.
- axios: Biblioteca para fazer chamadas HTTP (GET, POST, PUT, DELETE...).
- chai: Biblioteca de asserção (pode usar expect, assert, etc.).

4. Gere o arquivo de configuração do WebdriverIO

Execute o wizard do WebdriverIO para criar automaticamente o wdio.conf.js:

npx wdio config

Passo a passo do wizard:
- Onde salvar as configurações? Escolha wdio.conf.js.
- Tipo de teste? Selecione local.
- Framework? Escolha mocha.
- Padrão dos arquivos de teste? Geralmente ./test/specs/**/*.js.
- Serviço de browser? Para testes de API, pode escolher “None” ou um serviço local para, caso queira futuramente, testar UI.
- Reporter(s)? Selecione spec.
- Nível de logs? info ou error, conforme preferir.
- Confirma? Sim.

Isso criará um arquivo wdio.conf.js na raiz do projeto.

5. Ajustes no wdio.conf.js para testes de API

Abra o wdio.conf.js e faça as seguintes alterações:

- Retire ou comente as configurações de browser (capabilities) se não for usar testes de UI:
  
  // capabilities: [{
  //     maxInstances: 1,
  //     browserName: 'chrome',
  // }],
  // ou deixe como array vazio:
  capabilities: [],

- Ajuste o timeout do Mocha se necessário (caso as requisições demorem muito):

  mochaOpts: {
      timeout: 60000
  },

Dessa forma, o WebdriverIO não tentará abrir nenhum navegador e estará focado em testes de API.

6. Estrutura de pastas de testes

O padrão definido pelo wizard deve ter sido algo como ./test/specs/**/*.js.
Crie essa estrutura:

test
└── specs
    └── usersApi.spec.js

7. Criando os testes solicitados
No arquivo test/specs/usersApi.spec.js
Criei todos os testes solicitados:
 - >> Deve listar todos os usuários (GET /usuarios)
   >> Deve criar um novo usuário (POST /usuarios)
   >> Deve retornar os dados de um usuário específico (GET /usuarios/{id})
   >> Deve atualizar um usuário (PUT /usuarios/{id})
   >> Deve excluir um usuário (DELETE /usuarios/{id})


8. Executando os testes localmente

Para executar, basta digitar num prompt:

npx wdio

O comando:
1. Lê o wdio.conf.js.
2. Procura arquivos no padrão test/specs/*.js.
3. Executa os testes.

No final, você verá o resultado no console (graças ao spec-reporter).

9. Integração com CI

Em qualquer pipeline (GitHub Actions, GitLab CI, Jenkins, etc.):

1. Instale as dependências (npm ci ou npm install).
2. Execute o WebdriverIO (npx wdio).

Isso é suficiente para rodar os testes de API automaticamente em cada push ou Pull Request.

Exemplo (GitHub Actions):

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

10. Geração de relatórios

O @wdio/spec-reporter já fornece um relatório no console, mas, optei por algo mais visual e robusto, como o Allure:

npm install --save-dev @wdio/allure-reporter

Em seguida, configure no wdio.conf.js:

reporters: [
  'spec',
  ['allure', {
    outputDir: 'allure-results',
  }],
],

Para gerar e abrir o relatório:

npx allure generate allure-results --clean && npx allure open

Estrutura Final de Pastas (Exemplo):

.
├── package.json
├── package-lock.json
├── wdio.conf.js
└── test
    └── specs
        └── usersApi.spec.js

Resumo

1. Crie um diretporio para seu projeto
2. Inicie um projeto Node.js (npm init -y).
3. Instale WebdriverIO e dependências (@wdio/cli, @wdio/mocha-framework, etc.).
4. Gere o arquivo de configuração (wdio.conf.js) via Wizard (npx wdio config).
5. Ajuste o arquivo para não abrir browser (remova capabilities ou deixe-as vazias).
6. Estrutura de pastas de testes
7. Crie seus testes.
8. Execute localmente (npx wdio).
9. Integre no CI, chamando o mesmo comando de execução de testes.
10. Relatorios Amigáveis (Allure) 

