exports.config = {
  runner: 'local',
  specs: [
      './test/specs/**/*.js' // Testes localizados no diretório "test/specs"
  ],
  exclude: [],
  maxInstances: 1, // Apenas uma instância para testes de API

  // Capabilities (fictícias para rodar testes de API)
  capabilities: [{
      maxInstances: 1,
      browserName: 'fake', // Capacidade fictícia
  }],

  // Configurações gerais
  logLevel: 'info',
  bail: 0,
  baseUrl: 'https://serverest.dev', // URL base da API (ajuste para o seu caso)
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Framework de testes e configuração do Mocha
  framework: 'mocha',
  mochaOpts: {
      ui: 'bdd',
      timeout: 60000
  },

  // Configuração dos reporters
  reporters: [
      'spec',
      ['allure', {
          outputDir: 'allure-results',
          useCucumberStepReporter: false,
          disableWebdriverStepsReporting: true,
          disableWebdriverScreenshotsReporting: true,
      }],
  ],

  // Hooks (opcional, adicione conforme necessário)
  onPrepare: function (config, capabilities) {
      console.log('Preparando os testes...');
  },
  onComplete: function (exitCode, config, capabilities, results) {
      console.log('Testes finalizados.');
  },
};
