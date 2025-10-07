const db = require('../database.js');

// Criar novo pedido
exports.criarPedido = async (req, res) => {
  try {
    const { itens, total, forma_pagamento, data_pedido, hora_pedido } = req.body;
    
    // Verificar se usuário está logado
    const cpfUsuario = req.cookies.cpfUsuario;
    if (!cpfUsuario) {
      return res.status(401).json({ error: 'Usuário não logado' });
    }

    await db.transaction(async (client) => {
      // Criar pedido
      const pedidoResult = await client.query(
        `INSERT INTO pedido (data_pedido, hora_pedido, cliente_pessoa_cpf_pessoa, franquia_id_franquia, status_pedido, valor_total) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_pedido`,
        [data_pedido, hora_pedido, cpfUsuario, 1, 'pendente', total]
      );

      const pedidoId = pedidoResult.rows[0].id_pedido;

      // Adicionar produtos ao pedido
      for (const item of itens) {
        await client.query(
          `INSERT INTO pedido_has_produto (id_pedido, id_produto, quantidade, preco_unitario) 
           VALUES ($1, $2, $3, $4)`,
          [pedidoId, item.id_produto, item.quantidade, item.preco_unitario]
        );

        // Atualizar estoque
        await client.query(
          `UPDATE produto SET quantidade_estoque = quantidade_estoque - $1 
           WHERE id_produto = $2`,
          [item.quantidade, item.id_produto]
        );
      }

      // Criar pagamento
      const pagamentoResult = await client.query(
        `INSERT INTO pagamento (pedido_id_pedido, data_pagamento, hora_pagamento, valor_total_pagamento, status_pagamento) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id_pagamento`,
        [pedidoId, data_pagamento, hora_pagamento, total, 'pendente']
      );

      const pagamentoId = pagamentoResult.rows[0].id_pagamento;

      // Obter ID da forma de pagamento
      const formaPagamentoResult = await client.query(
        'SELECT id_forma_pagamento FROM forma_pagamento WHERE nome_forma_pagamento = $1',
        [forma_pagamento]
      );

      if (formaPagamentoResult.rows.length > 0) {
        const formaPagamentoId = formaPagamentoResult.rows[0].id_forma_pagamento;
        
        // Adicionar forma de pagamento ao pagamento
        await client.query(
          `INSERT INTO pagamento_has_forma_pagamento (pagamento_id_pagamento, forma_pagamento_id_forma_pagamento, valor_pago, dados_pagamento) 
           VALUES ($1, $2, $3, $4)`,
          [pagamentoId, formaPagamentoId, total, JSON.stringify({ forma: forma_pagamento })]
        );
      }
    });

    res.status(201).json({ 
      status: 'ok', 
      message: 'Pedido criado com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Listar pedidos
exports.listarPedidos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.nome_pessoa as cliente_nome, f.nome_franquia
      FROM pedido p
      LEFT JOIN cliente cl ON p.cliente_pessoa_cpf_pessoa = cl.pessoa_cpf_pessoa
      LEFT JOIN pessoa c ON cl.pessoa_cpf_pessoa = c.cpf_pessoa
      LEFT JOIN franquia f ON p.franquia_id_franquia = f.id_franquia
      ORDER BY p.data_pedido DESC, p.hora_pedido DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter pedido por ID
exports.obterPedido = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pedidoResult = await db.query(`
      SELECT p.*, c.nome_pessoa as cliente_nome, f.nome_franquia
      FROM pedido p
      LEFT JOIN cliente cl ON p.cliente_pessoa_cpf_pessoa = cl.pessoa_cpf_pessoa
      LEFT JOIN pessoa c ON cl.pessoa_cpf_pessoa = c.cpf_pessoa
      LEFT JOIN franquia f ON p.franquia_id_franquia = f.id_franquia
      WHERE p.id_pedido = $1
    `, [id]);

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const pedido = pedidoResult.rows[0];

    // Buscar produtos do pedido
    const produtosResult = await db.query(`
      SELECT php.*, pr.nome_produto, pr.descricao_produto
      FROM pedido_has_produto php
      JOIN produto pr ON php.id_produto = pr.id_produto
      WHERE php.id_pedido = $1
    `, [id]);

    pedido.produtos = produtosResult.rows;

    res.json(pedido);
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar status do pedido
exports.atualizarStatusPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE pedido SET status_pedido = $1 WHERE id_pedido = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};