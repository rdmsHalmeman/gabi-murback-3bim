-- Script de inserção de dados de teste para MILKMOO
-- Baseado na estrutura de tabelas existente

-- Inserir cargos
INSERT INTO cargo (nome_cargo, descricao) VALUES 
('Gerente', 'Responsável pelo gerenciamento da franquia'),
('Atendente', 'Atendimento ao cliente'),
('Barista', 'Preparação de milkshakes'),
('Caixa', 'Operação do caixa');

-- Inserir franquias
INSERT INTO franquia (nome_franquia, endereco_franquia, telefone_franquia, email_franquia, responsavel_franquia, ativo, criado_em) VALUES 
('MILKMOO Centro', 'Rua das Flores, 123', '(11) 99999-9999', 'centro@milkmoo.com', 'Maria Santos', true, CURRENT_TIMESTAMP),
('MILKMOO Rio', 'Av. Copacabana, 1000', '(21) 88888-8888', 'rio@milkmoo.com', 'João Silva', true, CURRENT_TIMESTAMP),
('MILKMOO BH', 'Rua da Liberdade, 500', '(31) 77777-7777', 'bh@milkmoo.com', 'Ana Costa', true, CURRENT_TIMESTAMP);

-- Inserir pessoas
INSERT INTO pessoa (nome_pessoa, email_pessoa, telefone_pessoa, cpf_pessoa, endereco_pessoa, data_nascimento, criado_em) VALUES 
('João Silva Cliente', 'cliente@teste.com', '(11) 99999-9999', '12345678901', 'Rua das Flores, 123', '1990-05-15', CURRENT_TIMESTAMP),
('Maria Santos Gerente', 'gerente@teste.com', '(11) 88888-8888', '98765432100', 'Av. Principal, 456', '1985-03-20', CURRENT_TIMESTAMP),
('Pedro Funcionario', 'funcionario@teste.com', '(11) 77777-7777', '11122233344', 'Rua Secundária, 789', '1992-08-10', CURRENT_TIMESTAMP),
('Ana Atendente', 'ana@teste.com', '(11) 66666-6666', '55566677788', 'Rua Nova, 321', '1995-12-03', CURRENT_TIMESTAMP);

-- Inserir usuários
INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario, tipo_usuario, is_master, ativo, criado_em, id_cargo) VALUES 
('João Silva Cliente', 'cliente@teste.com', '123456', 'cliente', false, true, CURRENT_TIMESTAMP, NULL),
('Maria Santos Gerente', 'gerente@teste.com', '123456', 'funcionario', true, true, CURRENT_TIMESTAMP, 1),
('Pedro Funcionario', 'funcionario@teste.com', '123456', 'funcionario', false, true, CURRENT_TIMESTAMP, 2),
('Ana Atendente', 'ana@teste.com', '123456', 'funcionario', false, true, CURRENT_TIMESTAMP, 2);

-- Inserir funcionários da franquia
INSERT INTO funcionario_franquia (nome_funcionario, email_funcionario, telefone_funcionario, cargo_funcionario, salario_funcionario, id_franquia, ativo, criado_em) VALUES 
('Maria Santos Gerente', 'gerente@teste.com', '(11) 88888-8888', 'Gerente', 8000.00, 1, true, CURRENT_TIMESTAMP),
('Pedro Funcionario', 'funcionario@teste.com', '(11) 77777-7777', 'Atendente', 3000.00, 1, true, CURRENT_TIMESTAMP),
('Ana Atendente', 'ana@teste.com', '(11) 66666-6666', 'Atendente', 3000.00, 1, true, CURRENT_TIMESTAMP);

-- Inserir produtos (milkshakes)
INSERT INTO produto (nome_produto, preco, categoria, descricao, imagem_url, estoque, ativo, criado_em) VALUES 
('Milkshake de Chocolate', 12.90, 'Milkshake', 'Delicioso milkshake de chocolate com chantilly', 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Chocolate', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Morango', 12.90, 'Milkshake', 'Refrescante milkshake de morango natural', 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Morango', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Baunilha', 11.90, 'Milkshake', 'Clássico milkshake de baunilha cremosa', 'https://via.placeholder.com/300x300/F5F5DC/000000?text=Baunilha', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Oreo', 14.90, 'Milkshake', 'Milkshake com pedaços de biscoito Oreo', 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Oreo', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Nutella', 15.90, 'Milkshake', 'Milkshake com Nutella e avelãs', 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Nutella', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Caramelo', 13.90, 'Milkshake', 'Milkshake com calda de caramelo', 'https://via.placeholder.com/300x300/D2691E/FFFFFF?text=Caramelo', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Cookies', 14.90, 'Milkshake', 'Milkshake com pedaços de cookies', 'https://via.placeholder.com/300x300/D2691E/FFFFFF?text=Cookies', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Pistache', 16.90, 'Milkshake', 'Milkshake com sabor de pistache', 'https://via.placeholder.com/300x300/90EE90/000000?text=Pistache', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Açaí', 13.90, 'Milkshake', 'Milkshake refrescante de açaí', 'https://via.placeholder.com/300x300/4B0082/FFFFFF?text=Açaí', 50, true, CURRENT_TIMESTAMP),
('Milkshake de Coco', 12.90, 'Milkshake', 'Milkshake tropical de coco', 'https://via.placeholder.com/300x300/FFFFFF/000000?text=Coco', 50, true, CURRENT_TIMESTAMP);

-- Inserir vendas de exemplo
INSERT INTO venda (id_usuario, id_franquia, valor_total, status, data_venda, observacoes) VALUES 
(1, 1, 25.80, 'concluida', CURRENT_DATE, 'Pedido entregue'),
(1, 1, 28.70, 'pendente', CURRENT_DATE, 'Aguardando pagamento');

-- Inserir itens das vendas
INSERT INTO item_venda (id_venda, id_produto, quantidade, preco_unitario, subtotal) VALUES 
(1, 1, 2, 12.90, 25.80),  -- 2x Milkshake de Chocolate
(2, 2, 1, 12.90, 12.90),  -- 1x Milkshake de Morango
(2, 4, 1, 14.90, 14.90);  -- 1x Milkshake de Oreo

-- Inserir pagamentos
INSERT INTO pagamento (id_venda, metodo, valor, status, criado_em) VALUES 
(1, 'dinheiro', 25.80, 'aprovado', CURRENT_TIMESTAMP),
(2, 'pix', 28.70, 'pendente', CURRENT_TIMESTAMP);

-- Inserir itens no carrinho de exemplo
INSERT INTO carrinho (id_usuario, id_produto, quantidade, preco_unitario, criado_em) VALUES 
(1, 1, 1, 12.90, CURRENT_TIMESTAMP),
(1, 3, 2, 11.90, CURRENT_TIMESTAMP);
