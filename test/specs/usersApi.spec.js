const axios = require('axios');
const { expect } = require('chai');

describe('API /usuarios - Testes Serverest', () => {
  const BASE_URL = 'https://serverest.dev';
  let token;
  let userId; // Variável para armazenar o _id do usuário recém-criado

  before(async () => {
    // 1. Realiza LOGIN para obter token JWT
    const loginPayload = {
      email: 'fulano@qa.com',
      password: 'teste'
    };

    const loginResponse = await axios.post(`${BASE_URL}/login`, loginPayload);

    // Valida resposta do login
    expect(loginResponse.status).to.equal(200);
    expect(loginResponse.data).to.have.property('message', 'Login realizado com sucesso');

    // Guarda o token para uso nos testes
    token = loginResponse.data.authorization;
  });

  it('Deve listar todos os usuários (GET /usuarios)', async () => {
    const response = await axios.get(`${BASE_URL}/usuarios`, {
      headers: { Authorization: token },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object');
    expect(response.data).to.have.property('quantidade');
    expect(response.data).to.have.property('usuarios').that.is.an('array');
  });

  it('Deve criar um novo usuário (POST /usuarios)', async () => {
    const novoUsuario = {
      nome: `Fulano de Tal - ${Date.now()}`,
      email: `fulanodetal_${Date.now()}@teste.com`,
      password: 'senha123',
      administrador: 'true',
    };

    const response = await axios.post(`${BASE_URL}/usuarios`, novoUsuario, {
      headers: { Authorization: token },
    });

    // Validações
    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('message', 'Cadastro realizado com sucesso');
    expect(response.data).to.have.property('_id');

    // Armazena o ID para uso nos próximos testes (GET, PUT, DELETE)
    userId = response.data._id;
  });

  it('Deve retornar os dados de um usuário específico (GET /usuarios/{id})', async () => {
    expect(userId).to.be.a('string', 'É necessário ter criado um usuário anteriormente');
  
    const response = await axios.get(`${BASE_URL}/usuarios/${userId}`, {
      headers: { Authorization: token },
    });
  
    // Ajuste: Agora, a API devolve o objeto do usuário diretamente em `response.data`
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object');            // objeto
    expect(response.data).to.have.property('_id', userId); // confere o _id
    expect(response.data).to.have.property('nome');      // etc...
  });
  

  it('Deve atualizar um usuário (PUT /usuarios/{id})', async () => {
    expect(userId).to.be.a('string', 'É necessário ter criado um usuário anteriormente');

    const dadosAtualizados = {
      nome: 'Fulano de Tal (Atualizado)',
      email: `fulano_atualizado_${Date.now()}@teste.com`,
      password: 'novaSenha123',
      administrador: 'false',
    };

    const response = await axios.put(`${BASE_URL}/usuarios/${userId}`, dadosAtualizados, {
      headers: { Authorization: token },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('message', 'Registro alterado com sucesso');
  });

  it('Deve excluir um usuário (DELETE /usuarios/{id})', async () => {
    expect(userId).to.be.a('string', 'É necessário ter criado um usuário anteriormente');

    const response = await axios.delete(`${BASE_URL}/usuarios/${userId}`, {
      headers: { Authorization: token },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('message', 'Registro excluído com sucesso');
  });
});
