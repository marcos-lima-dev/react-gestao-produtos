# Sistema de Gestão de Produtos

Sistema web desenvolvido em React para gerenciamento de produtos e suas variações.

## 🚀 Funcionalidades

- Cadastro de produtos com múltiplas variações
- Listagem em cards com indicadores visuais de estoque
- Filtros por nome, cor e faixa de preço
- Ordenação por nome, preço e estoque
- Edição e exclusão de produtos
- Validações de formulário
- Persistência em localStorage

## 🛠️ Tecnologias

- React
- TypeScript
- Redux Toolkit
- React Hook Form + Yup
- Tailwind CSS
- React Hot Toast

## ⚙️ Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

## 📱 Uso

### Cadastro de Produtos
- Acesse "Gerenciar"
- Preencha o nome do produto
- Adicione variações com cor, quantidade e preço
- Salve o produto

### Visualização e Filtros
- Lista principal exibe cards com variações
- Use filtros superiores para busca
- Ordene por diferentes critérios
- Indicadores visuais de estoque:
  - Verde: Adequado
  - Amarelo: Baixo
  - Vermelho: Crítico

## 📋 Estrutura do Projeto

```
src/
├── components/
│   ├── ProductForm/
│   ├── ProductList/
│   └── UI/
├── pages/
├── store/
├── types/
└── utils/
```

## 🔑 Features

- Responsivo
- Validações em tempo real
- Feedback visual para ações
- Paginação
- Persistência de dados

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

MIT