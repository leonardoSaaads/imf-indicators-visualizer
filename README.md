# IMF Data Visualizer 📊

Uma plataforma interativa para visualização de dados econômicos globais fornecidos pela API pública do Fundo Monetário Internacional (FMI). Explore indicadores, compare países e analise tendências ao longo do tempo com gráficos dinâmicos e métricas detalhadas.

## ✨ Funcionalidades

  * **Seleção de Dados Dinâmica**: Escolha entre dezenas de indicadores econômicos (PIB, população, inflação, etc.).
  * **Comparação Multipaíses**: Selecione um ou mais países/regiões para comparar suas métricas lado a lado.
  * **Análise Temporal**: Defina um período (ano inicial e final) para analisar a evolução dos dados.
  * **Visualizações Ricas**:
      * **Gráficos de Linha**: Para comparar a evolução temporal entre países.
      * **Gráficos de Área**: Para visualizar a composição ou tendência de indicadores cumulativos.
      * **Cards de Métricas**: Resumo do último valor registrado e a variação percentual em relação ao período anterior.
  * **Análise Estatística**: Uma aba dedicada para estatísticas descritivas básicas dos dados selecionados.
  * **Tabela de Dados**: Visualize e confira os dados brutos que alimentam os gráficos.
  * **Interface Responsiva (Desktop)**: Layout limpo e moderno construído com Tailwind CSS, otimizado para desktops.

-----

## 🚀 Tecnologias Utilizadas

  * **Framework Frontend**: [React](https://react.dev/)
  * **Build Tool**: [Vite](https://vitejs.dev/) (com plugin SWC para performance)
  * **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
  * **Gráficos**: [Recharts](https://recharts.org/) (implícito pela estrutura dos componentes de gráfico)
  * **Linguagem**: JavaScript
  * **API**: [IMF Data API](https://data.imf.org/)

-----

## 📂 Estrutura do Projeto

O projeto é organizado com uma arquitetura baseada em componentes, visando escalabilidade e manutenibilidade.

```
/src
├── assets/         # Recursos estáticos como imagens e SVGs
├── components/     # Componentes React reutilizáveis
│   ├── charts/     # Componentes de gráficos (Area, Bar, Line)
│   ├── data/       # Componentes de seleção de dados (País, Indicador)
│   ├── layout/     # Componentes estruturais (Header, Sidebar)
│   └── ui/         # Componentes básicos de UI (Button, Card, Input)
├── constants/      # Constantes globais
├── hooks/          # Hooks customizados (ex: useIMFData para lógica de API)
├── pages/          # Componentes de página (ex: Dashboard)
├── services/       # Módulos para comunicação com APIs externas (imfApi.js)
├── utils/          # Funções utilitárias (formatação, cálculos)
├── App.jsx         # Componente raiz da aplicação
└── main.jsx        # Ponto de entrada da aplicação
```

-----

## ⚙️ Instalação e Execução

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

  * [Node.js](https://nodejs.org/) (versão 18 ou superior)
  * [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Passos

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/leonardoSaaads/imf-indicators-visualizer
    cd imf-data-visualizer
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    A aplicação estará disponível em `http://localhost:5173`. O servidor de desenvolvimento do Vite utiliza Hot Module Replacement (HMR) para uma experiência de desenvolvimento rápida.

-----

## 🔌 Configuração da API (CORS)

A API do FMI não fornece headers CORS, o que impede chamadas diretas do navegador. O projeto utiliza duas estratégias para contornar essa limitação:

### 1\. Ambiente de Desenvolvimento

Em desenvolvimento (`npm run dev`), o Vite é configurado com um **proxy reverso**. Todas as chamadas para `/api/imf` no frontend são redirecionadas para a API oficial do FMI (`https://www.imf.org/external/datamapper/api/v1`), evitando problemas de CORS.

**`vite.config.js`**

```javascript
// ...
server: {
  proxy: {
    '/api/imf': {
      target: 'https://www.imf.org/external/datamapper/api/v1',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/imf/, ''),
    }
  }
}
```

### 2\. Ambiente de Produção

Para o build de produção, o proxy do Vite não está disponível. A solução implementada em `src/services/imfApi.js` utiliza um **proxy CORS de terceiros** (`api.allorigins.win`) para intermediar as requisições.

**Atenção:** A solução com `allorigins.win` é ideal para protótipos e projetos pessoais. Para uma aplicação de produção robusta e com alto tráfego, é **altamente recomendável** configurar seu próprio proxy reverso em um servidor backend (usando Node.js/Express, Nginx, etc.) para garantir estabilidade e segurança.

-----

## scripts disponíveis

  * `npm run dev`: Inicia o servidor de desenvolvimento.
  * `npm run build`: Gera a versão de produção do projeto na pasta `dist/`.
  * `npm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.
  * `npm run preview`: Inicia um servidor local para pré-visualizar o build de produção.

-----

## ⚠️ Limitações e Melhorias Futuras

  * **Responsividade**: A interface atual é otimizada para desktops. São necessários ajustes no Tailwind CSS para uma experiência completa em tablets e dispositivos móveis.
  * **Cache**: O cache atual é em memória e por sessão. Implementar um cache mais persistente (ex: `localStorage` com tempo de expiração) pode melhorar a performance.
  * **Tratamento de Erros**: O tratamento de erros da API pode ser aprimorado com mensagens mais claras para o usuário.
  * **Testes**: Adicionar testes unitários e de integração para garantir a estabilidade dos componentes e da lógica de negócio.

-----

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.
