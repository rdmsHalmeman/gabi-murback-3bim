const { query } = require('../database');

exports.listarFranquias = async (req, res) => {
  try {
    const r = await query('SELECT * FROM franquia ORDER BY id_franquia');
    res.json(r.rows);
  } catch (e) {
    console.error('Erro ao listar franquias:', e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.criarFranquia = async (req, res) => {
  try {
    const { nome_franquia, cidade_franquia, endereco_franquia, telefone_franquia, gerente_cpf } = req.body;
    if (!nome_franquia || !cidade_franquia || !endereco_franquia) {
      return res.status(400).json({ error: 'Campos obrigatórios não informados' });
    }
    const sql = `INSERT INTO franquia (nome_franquia, cidade_franquia, endereco_franquia, telefone_franquia, gerente_cpf)
                 VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const r = await query(sql, [nome_franquia, cidade_franquia, endereco_franquia, telefone_franquia || null, gerente_cpf || null]);
    res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error('Erro ao criar franquia:', e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.obterFranquia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const r = await query('SELECT * FROM franquia WHERE id_franquia = $1', [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Franquia não encontrada' });
    res.json(r.rows[0]);
  } catch (e) {
    console.error('Erro ao obter franquia:', e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.atualizarFranquia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nome_franquia, cidade_franquia, endereco_franquia, telefone_franquia, gerente_cpf } = req.body;
    const r0 = await query('SELECT * FROM franquia WHERE id_franquia = $1', [id]);
    if (r0.rows.length === 0) return res.status(404).json({ error: 'Franquia não encontrada' });
    const f = r0.rows[0];
    const updates = {
      nome_franquia: nome_franquia ?? f.nome_franquia,
      cidade_franquia: cidade_franquia ?? f.cidade_franquia,
      endereco_franquia: endereco_franquia ?? f.endereco_franquia,
      telefone_franquia: telefone_franquia ?? f.telefone_franquia,
      gerente_cpf: gerente_cpf ?? f.gerente_cpf
    };
    const r = await query(
      `UPDATE franquia SET nome_franquia=$1, cidade_franquia=$2, endereco_franquia=$3, telefone_franquia=$4, gerente_cpf=$5
       WHERE id_franquia=$6 RETURNING *`,
      [updates.nome_franquia, updates.cidade_franquia, updates.endereco_franquia, updates.telefone_franquia, updates.gerente_cpf, id]
    );
    res.json(r.rows[0]);
  } catch (e) {
    console.error('Erro ao atualizar franquia:', e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.deletarFranquia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await query('DELETE FROM franquia WHERE id_franquia = $1', [id]);
    res.status(204).send();
  } catch (e) {
    console.error('Erro ao deletar franquia:', e);
    if (e.code === '23503') return res.status(400).json({ error: 'Franquia possui dependências' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


