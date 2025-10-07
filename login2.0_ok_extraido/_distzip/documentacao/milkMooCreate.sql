-- Script de criação do banco MILKMOO
-- Franquia de milkshakes

-- Tabela 'cargo'
CREATE TABLE cargo (
    id_cargo SERIAL PRIMARY KEY,
    nome_cargo VARCHAR(50) UNIQUE NOT NULL
);

-- Tabela 'pessoa'
CREATE TABLE pessoa (
    cpf_pessoa VARCHAR(11) PRIMARY KEY,
    nome_pessoa VARCHAR(100) NOT NULL,
    data_nascimento_pessoa DATE,
    endereco_pessoa VARCHAR(255),
    email_pessoa VARCHAR(100),
    telefone_pessoa VARCHAR(20)
);

-- Tabela 'cliente'
CREATE TABLE cliente (
    pessoa_cpf_pessoa VARCHAR(11) PRIMARY KEY REFERENCES pessoa(cpf_pessoa),
    renda_cliente DECIMAL(10, 2),
    data_cadastro_cliente DATE NOT NULL,
    senha_cliente VARCHAR(255) NOT NULL
);

-- Tabela 'funcionario'
CREATE TABLE funcionario (
    pessoa_cpf_pessoa VARCHAR(11) PRIMARY KEY REFERENCES pessoa(cpf_pessoa),
    salario DECIMAL(10, 2) NOT NULL,
    cargo_id_cargo INT REFERENCES cargo(id_cargo),
    porcentagem_comissao DECIMAL(5, 2),
    senha_funcionario VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT true
);

-- Tabela 'franquia'
CREATE TABLE franquia (
    id_franquia SERIAL PRIMARY KEY,
    nome_franquia VARCHAR(100) NOT NULL,
    cidade_franquia VARCHAR(100) NOT NULL,
    endereco_franquia VARCHAR(255) NOT NULL,
    telefone_franquia VARCHAR(20),
    gerente_cpf VARCHAR(11) REFERENCES funcionario(pessoa_cpf_pessoa)
);

-- Tabela 'forma_pagamento'
CREATE TABLE forma_pagamento (
    id_forma_pagamento SERIAL PRIMARY KEY,
    nome_forma_pagamento VARCHAR(50) UNIQUE NOT NULL
);

-- Tabela 'produto'
CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome_produto VARCHAR(100) UNIQUE NOT NULL,
    descricao_produto TEXT,
    quantidade_estoque INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    categoria_produto VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    franquia_id_franquia INT REFERENCES franquia(id_franquia)
);

-- Tabela 'pedido'
CREATE TABLE pedido (
    id_pedido SERIAL PRIMARY KEY,
    data_pedido DATE NOT NULL,
    hora_pedido TIME NOT NULL,
    cliente_pessoa_cpf_pessoa VARCHAR(11) REFERENCES cliente(pessoa_cpf_pessoa),
    funcionario_pessoa_cpf_pessoa VARCHAR(11) REFERENCES funcionario(pessoa_cpf_pessoa),
    franquia_id_franquia INT REFERENCES franquia(id_franquia),
    status_pedido VARCHAR(20) DEFAULT 'pendente',
    valor_total DECIMAL(10, 2) NOT NULL
);

-- Tabela de junção 'pedido_has_produto'
CREATE TABLE pedido_has_produto (
    id_pedido INT REFERENCES pedido(id_pedido),
    id_produto INT REFERENCES produto(id_produto),
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_pedido, id_produto)
);

-- Tabela 'pagamento'
CREATE TABLE pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    pedido_id_pedido INT REFERENCES pedido(id_pedido),
    data_pagamento DATE NOT NULL,
    hora_pagamento TIME NOT NULL,
    valor_total_pagamento DECIMAL(10, 2) NOT NULL,
    status_pagamento VARCHAR(20) DEFAULT 'pendente'
);

-- Tabela de junção 'pagamento_has_forma_pagamento'
CREATE TABLE pagamento_has_forma_pagamento (
    pagamento_id_pagamento INT REFERENCES pagamento(id_pagamento),
    forma_pagamento_id_forma_pagamento INT REFERENCES forma_pagamento(id_forma_pagamento),
    valor_pago DECIMAL(10, 2) NOT NULL,
    dados_pagamento TEXT, -- Para armazenar dados específicos como QR code PIX, dados do cartão, etc.
    PRIMARY KEY (pagamento_id_pagamento, forma_pagamento_id_forma_pagamento)
);

-- Inserir dados iniciais
INSERT INTO cargo (nome_cargo) VALUES 
('Gerente'),
('Atendente'),
('Barista'),
('Caixa');

INSERT INTO forma_pagamento (nome_forma_pagamento) VALUES 
('Dinheiro'),
('PIX'),
('Cartão de Débito'),
('Cartão de Crédito');

-- Inserir franquia principal
INSERT INTO franquia (nome_franquia, cidade_franquia, endereco_franquia, telefone_franquia) VALUES 
('MILKMOO Centro', 'São Paulo', 'Rua das Flores, 123', '(11) 99999-9999');

-- Inserir produtos de milkshake
INSERT INTO produto (nome_produto, descricao_produto, quantidade_estoque, preco_unitario, categoria_produto, franquia_id_franquia) VALUES 
('Milkshake de Chocolate', 'Delicioso milkshake de chocolate com chantilly', 50, 12.90, 'Milkshake', 1),
('Milkshake de Morango', 'Refrescante milkshake de morango natural', 50, 12.90, 'Milkshake', 1),
('Milkshake de Baunilha', 'Clássico milkshake de baunilha cremosa', 50, 11.90, 'Milkshake', 1),
('Milkshake de Oreo', 'Milkshake com pedaços de biscoito Oreo', 50, 14.90, 'Milkshake', 1),
('Milkshake de Nutella', 'Milkshake com Nutella e avelãs', 50, 15.90, 'Milkshake', 1),
('Milkshake de Caramelo', 'Milkshake com calda de caramelo', 50, 13.90, 'Milkshake', 1),
('Milkshake de Cookies', 'Milkshake com pedaços de cookies', 50, 14.90, 'Milkshake', 1),
('Milkshake de Pistache', 'Milkshake com sabor de pistache', 50, 16.90, 'Milkshake', 1);
