# WebdriverIO API Tests (Desafio: https://serverest.dev/)

Este repositório contém um guia detalhado para configurar **WebdriverIO** com foco em **testes de API**
---

## 1. Crie um diretório para seu projeto

```bash
mkdir webdriverio-api-tests
cd webdriverio-api-tests
2. Inicialize o projeto Node.js
bash
Copiar código
npm init -y
Esse comando criará o arquivo package.json com as configurações básicas do seu projeto.

3. Instale as dependências necessárias
Mesmo para testes de API, aproveitamos a estrutura do WebdriverIO:

bash
Copiar código
npm install --save-dev \
  @wdio/cli \
  @wdio/local-runner \
  @wdio/mocha-framework \
  @wdio/spec-reporter \
  axios \
  chai
O que cada dependência faz:
@wdio/cli: CLI do WebdriverIO para configurar o projeto.
@wdio/local-runner: Permite rodar testes localmente.
@wdio/mocha-framework: Integração com o Mocha (framework de testes).
@wdio/spec-reporter: Exibe resultados de testes de forma legível no console.
axios: Biblioteca para fazer chamadas HTTP (GET, POST, PUT, DELETE...).
chai: Biblioteca de asserção (pode usar expect, assert, etc.).
Observação: Se preferir sintaxe async/await sem o “modo síncrono” do WDIO, não instale @wdio/sync.

4. Gere o arquivo de configuração do WebdriverIO
Execute o wizard do WebdriverIO para criar automaticamente o wdio.conf.js:

bash
Copiar código
npx wdio config
Passo a passo do wizard:
Onde salvar as configurações?
Escolha wdio.conf.js.
Tipo de teste?
Selecione local.
Framework?
Escolha mocha.
Padrão dos arquivos de teste?
Geralmente ./test/specs/**/*.js.
Serviço de browser?
Para testes de API, pode escolher “None” ou um serviço local para, caso queira futuramente, testar UI.
Reporter(s)
Selecione spec.
Nível de logs
info ou error, conforme preferência.
Confirma?
Sim.
Isso criará um arquivo wdio.conf.js na raiz do projeto.

5. Ajustes no wdio.conf.js para testes de API
Abra o wdio.conf.js e faça as seguintes alterações:

Remova ou comente as configurações de browser (capabilities) se não for usar testes de UI:

js
Copiar código
// capabilities: [{
//     maxInstances: 1,
//     browserName: 'chrome',
// }],
// ou deixe como array vazio:
capabilities: [],
Ajuste o timeout do Mocha se necessário (caso as requisições demorem muito):

js
Copiar código
mochaOpts: {
    timeout: 60000
},
Dessa forma, o WebdriverIO não tentará abrir nenhum navegador e estará focado em testes de API.

6. Estrutura de pastas de testes
O padrão definido pelo wizard deve ter sido algo como ./test/specs/**/*.js.
Crie essa estrutura:

bash
Copiar código
test
└── specs
    └── usersApi.spec.js
7. Criando um teste de exemplo
No arquivo test/specs/usersApi.spec.js:

js
Copiar código
const axios = require('axios');
const { expect } = require('chai');

describe('API /users', () => {
  const BASE_URL = 'https://serverest.dev'; // Ou outra URL da sua API
  let token;

  before(async () => {
    // Exemplo de obtenção de token JWT (ajuste para sua API)
    const response = await axios.post(`${BASE_URL}/login`, {
      email: 'seu-email@teste.com',
      password: 'sua-senha'
    });
    token = response.data.authorization; // Ajuste conforme a resposta retornada
  });

  it('Deve listar todos os usuários (GET /usuarios)', async () => {
    const response = await axios.get(`${BASE_URL}/usuarios`, {
      headers: { Authorization: token }
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object');
    expect(response.data.usuarios).to.be.an('array');
  });

  it('Deve criar um usuário (POST /usuarios)', async () => {
    const novoUsuario = {
      nome: 'Fulano de Tal',
      email: `fulano_${Date.now()}@teste.com`,
      password: 'senha123',
      administrador: 'true'
    };

    const response = await axios.post(`${BASE_URL}/usuarios`, novoUsuario, {
      headers: { Authorization: token }
    });

    expect(response.status).to.equal(201);
    expect(response.data.message).to.equal('Cadastro realizado com sucesso');
  });

  // Exemplos de testes adicionais:
  // it('Deve buscar detalhes de um usuário (GET /usuarios/{id})', async () => { ... });
  // it('Deve atualizar um usuário (PUT /usuarios/{id})', async () => { ... });
  // it('Deve deletar um usuário (DELETE /usuarios/{id})', async () => { ... });
});
8. Executando os testes localmente
Para executar, basta:

bash
Copiar código
npx wdio
O comando fará:

Ler o wdio.conf.js.
Procurar arquivos no padrão test/specs/*.js.
Executar os testes.
No final, você verá o resultado no console (graças ao spec-reporter).

9. Integração com CI
Em qualquer pipeline (GitHub Actions, GitLab CI, Jenkins, etc.):

Instale as dependências (npm ci ou npm install).
Execute o WebdriverIO (npx wdio).
Isso é suficiente para rodar os testes de API automaticamente em cada push ou Pull Request.

Exemplo (GitHub Actions)
yaml
Copiar código
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
Geração de relatórios
O @wdio/spec-reporter já fornece um relatório no console. Se quiser algo mais robusto (por exemplo, HTML ou JUnit), você pode instalar outros repórteres, como o Allure:

bash
Copiar código
npm install --save-dev @wdio/allure-reporter
Em seguida, configure no wdio.conf.js:

js
Copiar código
reporters: [
  'spec',
  ['allure', {
    outputDir: 'allure-results',
  }],
],
Para gerar e abrir o relatório:

bash
Copiar código
npx allure generate allure-results --clean && npx allure open
Estrutura Final de Pastas (Exemplo)
plaintext
Copiar código
.
├── package.json
├── package-lock.json
├── wdio.conf.js
└── test
    └── specs
        └── usersApi.spec.js
Resumo
Inicie um projeto Node.js (npm init -y).
Instale WebdriverIO e dependências (@wdio/cli, @wdio/mocha-framework, etc.).
Gere o arquivo de configuração (wdio.conf.js) via Wizard (npx wdio config).
Ajuste o arquivo para não abrir browser (remova capabilities ou deixe-as vazias).
Crie seus testes de API (exemplo usersApi.spec.js) usando axios e chai.
Execute localmente (npx wdio).
Integre no CI, chamando o mesmo comando de execução de testes.
Pronto! Dessa forma, você tem um ambiente de testes em WebdriverIO focado em API, sem nenhuma configuração de cobertura de código e sem abrir navegador.
