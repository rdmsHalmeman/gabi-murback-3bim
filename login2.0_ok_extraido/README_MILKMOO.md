# 🥛 MILKMOO - Sistema de Franquia de Milkshakes

Sistema completo de gerenciamento para franquia de milkshakes com funcionalidades de e-commerce e gerenciamento administrativo.

## 🚀 Funcionalidades Implementadas

### Para Clientes:
- ✅ Visualização do cardápio de milkshakes
- ✅ Adição de produtos ao carrinho
- ✅ Sistema de carrinho sem finalização sem login
- ✅ Login/cadastro de clientes
- ✅ Sistema de pagamento completo:
  - 💵 Pagamento em dinheiro
  - 📱 PIX com QR Code real
  - 💳 Cartão de débito/crédito com validação real

### Para Gerentes:
- ✅ Login de funcionários/gerentes
- ✅ Painel de gerenciamento completo
- ✅ Gerenciamento de pessoas (adicionar, editar, excluir, promover)
- ✅ Gerenciamento de produtos (adicionar, editar, excluir)
- ✅ Gerenciamento de franquias (adicionar novas cidades)
- ✅ Gerenciamento de cargos (promover funcionários)
- ✅ Acesso ao cardápio para fazer compras

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express.js
- **Banco de Dados**: PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Autenticação**: Cookies seguros
- **Validação**: Algoritmo de Luhn para cartões

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL (versão 12 ou superior)
- Navegador web moderno

## 🔧 Instalação

### 1. Configurar Banco de Dados

```sql
-- Criar banco de dados
CREATE DATABASE milkmoo;

-- Executar script de criação
\i documentacao/milkMooCreate.sql
```

### 2. Configurar Backend

```bash
# Navegar para o diretório do projeto
cd terceiro-bimestre-dw1-main

# Instalar dependências
npm install

# Configurar variáveis de ambiente (opcional)
# As configurações já estão no arquivo database.js
```

### 3. Configurar Banco de Dados

Edite o arquivo `backend/database.js` se necessário:
- Host: localhost
- Porta: 5432
- Usuário: postgres
- Senha: Lageado001.
- Banco: milkmoo

## 🚀 Executando o Sistema

### 1. Iniciar o Backend

```bash
# No diretório raiz do projeto
node backend/server.js
```

O servidor será iniciado em: `http://localhost:3001`

### 2. Acessar o Sistema

Abra seu navegador e acesse: `http://localhost:3001`

## 👥 Usuários Padrão

### Cliente de Teste:
- **Email**: cliente@teste.com
- **Senha**: 123456
- **CPF**: 12345678901

### Gerente de Teste:
- **Email**: gerente@teste.com
- **Senha**: 123456
- **CPF**: 98765432100

## 📱 Como Usar

### Para Clientes:

1. **Acessar o Menu**: Visualize o cardápio de milkshakes
2. **Adicionar ao Carrinho**: Clique em "Adicionar ao Carrinho"
3. **Fazer Login**: Clique em "Fazer Login" para acessar sua conta
4. **Finalizar Compra**: Acesse o carrinho e clique em "Finalizar Compra"
5. **Escolher Pagamento**: Selecione entre dinheiro, PIX ou cartão
6. **Confirmar Pedido**: Complete o processo de pagamento

### Para Gerentes:

1. **Login de Gerente**: Use as credenciais de gerente
2. **Painel de Gerenciamento**: Acesse todas as funcionalidades administrativas
3. **Gerenciar Pessoas**: Adicionar, editar, excluir funcionários
4. **Gerenciar Produtos**: Controlar o cardápio
5. **Gerenciar Franquias**: Adicionar novas unidades
6. **Fazer Compras**: Acessar o cardápio como cliente

## 💳 Sistema de Pagamento

### Pagamento em Dinheiro:
- Calcula troco automaticamente
- Valida se o valor é suficiente

### PIX:
- Gera QR Code simulado
- Chave PIX: milkmoo@pagamento.com
- Processo instantâneo

### Cartão de Crédito/Débito:
- Validação real usando algoritmo de Luhn
- Máscaras automáticas para número, validade e CVV
- Simulação de processamento

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais:
- `pessoa` - Dados pessoais
- `cliente` - Informações de clientes
- `funcionario` - Dados de funcionários
- `cargo` - Cargos disponíveis
- `franquia` - Unidades da franquia
- `produto` - Cardápio de produtos
- `pedido` - Pedidos realizados
- `pagamento` - Informações de pagamento
- `forma_pagamento` - Tipos de pagamento

## 🔒 Segurança

- Autenticação baseada em cookies seguros
- Validação de dados no frontend e backend
- Controle de acesso por tipo de usuário
- Sanitização de inputs

## 🎨 Interface

- Design responsivo e moderno
- Tema MILKMOO com cores vibrantes
- Animações suaves e transições
- Interface intuitiva e amigável

## 🐛 Solução de Problemas

### Erro de Conexão com Banco:
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no `database.js`
3. Execute o script de criação do banco

### Erro de Login:
1. Verifique se o usuário existe no banco
2. Confirme se as senhas estão corretas
3. Limpe os cookies do navegador

### Erro de Pagamento:
1. Verifique se o carrinho não está vazio
2. Confirme se está logado
3. Teste com dados válidos de cartão

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs do console do navegador
- Consulte os logs do servidor Node.js
- Verifique a conexão com o banco de dados

## 🎯 Próximas Funcionalidades

- [ ] Relatórios de vendas
- [ ] Sistema de cupons
- [ ] Notificações em tempo real
- [ ] App mobile
- [ ] Integração com delivery

---

**MILKMOO** - Sistema completo de franquia de milkshakes 🥛✨
