const db = require('../database.js');

// Verificar se usuário está logado
exports.verificaSeUsuarioEstaLogado = (req, res) => {
  console.log('loginController - Acessando rota /verificaSeUsuarioEstaLogado');
  let nome = req.cookies.usuarioLogado;
  let tipo = req.cookies.tipoUsuario;
  let cargo = req.cookies.cargoUsuario;
  console.log('Cookie usuarioLogado:', nome);
  console.log('Cookie tipoUsuario:', tipo);
  console.log('Cookie cargoUsuario:', cargo);
  
  if (nome) {
    res.json({ status: 'ok', nome, tipo, cargo });
  } else {
    res.json({ status: 'nao_logado' });
  }
}

// Login de cliente
exports.loginCliente = async (req, res) => {
  const { email, senha } = req.body;

  const sql = `
    SELECT c.pessoa_cpf_pessoa, p.nome_pessoa, p.email_pessoa
    FROM public.cliente c
    JOIN public.pessoa p ON c.pessoa_cpf_pessoa = p.cpf_pessoa
    WHERE p.email_pessoa = $1 AND c.senha_cliente = $2
  `;

  console.log('Rota loginCliente:', sql, email);

  try {
    const result = await db.query(sql, [email, senha]);

    if (result.rows.length === 0) {
      return res.json({ status: 'credenciais_incorretas' });
    }

    const { pessoa_cpf_pessoa, nome_pessoa, email_pessoa } = result.rows[0];

    // Define cookies (ajustados para ambiente local)
    const cookieOpts = { sameSite: 'Lax', secure: false, httpOnly: true, path: '/', maxAge: 24 * 60 * 60 * 1000 };
    res.cookie('usuarioLogado', nome_pessoa, cookieOpts);
    res.cookie('tipoUsuario', 'cliente', cookieOpts);
    res.cookie('cpfUsuario', pessoa_cpf_pessoa, cookieOpts);

    console.log("Login de cliente realizado com sucesso");

    return res.json({
      status: 'ok',
      nome: nome_pessoa,
      email: email_pessoa,
      tipo: 'cliente'
    });

  } catch (err) {
    console.error('Erro ao fazer login do cliente:', err);
    return res.status(500).json({ status: 'erro', mensagem: err.message });
  }
}

// Login de funcionário/gerente
exports.loginFuncionario = async (req, res) => {
  const { email, senha } = req.body;

  const sql = `
    SELECT f.pessoa_cpf_pessoa, p.nome_pessoa, p.email_pessoa, c.nome_cargo, f.ativo
    FROM public.funcionario f
    JOIN public.pessoa p ON f.pessoa_cpf_pessoa = p.cpf_pessoa
    JOIN public.cargo c ON f.cargo_id_cargo = c.id_cargo
    WHERE p.email_pessoa = $1 AND f.senha_funcionario = $2 AND f.ativo = true
  `;

  console.log('Rota loginFuncionario:', sql, email);

  try {
    const result = await db.query(sql, [email, senha]);

    if (result.rows.length === 0) {
      return res.json({ status: 'credenciais_incorretas' });
    }

    const { pessoa_cpf_pessoa, nome_pessoa, email_pessoa, nome_cargo, ativo } = result.rows[0];

    // Define cookies (ajustados para ambiente local)
    const cookieOpts = { sameSite: 'Lax', secure: false, httpOnly: true, path: '/', maxAge: 24 * 60 * 60 * 1000 };
    res.cookie('usuarioLogado', nome_pessoa, cookieOpts);
    res.cookie('tipoUsuario', 'funcionario', cookieOpts);
    res.cookie('cpfUsuario', pessoa_cpf_pessoa, cookieOpts);
    res.cookie('cargoUsuario', nome_cargo, cookieOpts);

    console.log("Login de funcionário realizado com sucesso");

    return res.json({
      status: 'ok',
      nome: nome_pessoa,
      email: email_pessoa,
      tipo: 'funcionario',
      cargo: nome_cargo
    });

  } catch (err) {
    console.error('Erro ao fazer login do funcionário:', err);
    return res.status(500).json({ status: 'erro', mensagem: err.message });
  }
}

// Cadastro de cliente
exports.cadastrarCliente = async (req, res) => {
  try {
    const { cpf, nome, email, telefone, data_nascimento, endereco, senha } = req.body;

    // Validação básica
    if (!cpf || !nome || !email || !senha) {
      return res.status(400).json({
        error: 'CPF, nome, email e senha são obrigatórios'
      });
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    // Validação de CPF básica
    if (cpf.length !== 11) {
      return res.status(400).json({
        error: 'CPF deve ter 11 dígitos'
      });
    }

    await db.transaction(async (client) => {
      // Inserir pessoa
      await client.query(
        'INSERT INTO public.pessoa (cpf_pessoa, nome_pessoa, email_pessoa, telefone_pessoa, data_nascimento_pessoa, endereco_pessoa) VALUES ($1, $2, $3, $4, $5, $6)',
        [cpf, nome, email, telefone, data_nascimento, endereco]
      );

      // Inserir cliente
      await client.query(
        'INSERT INTO public.cliente (pessoa_cpf_pessoa, senha_cliente, data_cadastro_cliente) VALUES ($1, $2, CURRENT_DATE)',
        [cpf, senha]
      );
    });

    res.status(201).json({ 
      status: 'ok', 
      message: 'Cliente cadastrado com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);

    // Verifica se é erro de CPF duplicado
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'CPF já está em uso'
      });
    }

    // Verifica se é erro de email duplicado
    if (error.code === '23505' && error.constraint.includes('email')) {
      return res.status(400).json({
        error: 'Email já está em uso'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Logout
exports.logout = (req, res) => {
  const opts = { sameSite: 'Lax', secure: false, httpOnly: true, path: '/' };
  res.clearCookie('usuarioLogado', opts);
  res.clearCookie('tipoUsuario', opts);
  res.clearCookie('cpfUsuario', opts);
  res.clearCookie('cargoUsuario', opts);
  
  console.log("Cookies removidos com sucesso");
  res.json({ status: 'deslogado' });
}

// Login unificado usando a tabela public.usuarios
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const sql = `
      SELECT u.nome_usuario, u.email_usuario, u.senha_usuario, u.tipo_usuario, u.ativo, u.id_cargo,
             u.is_master, c.nome_cargo
      FROM public.usuarios u
      LEFT JOIN public.cargo c ON u.id_cargo = c.id_cargo
      WHERE u.email_usuario = $1 AND u.senha_usuario = $2 AND u.ativo = true
    `;
    const r = await db.query(sql, [email, senha]);
    if (r.rows.length === 0) {
      return res.json({ status: 'credenciais_incorretas' });
    }

    const { nome_usuario, email_usuario, tipo_usuario, nome_cargo, is_master } = r.rows[0];
    const cookieOpts = { sameSite: 'Lax', secure: false, httpOnly: true, path: '/', maxAge: 24 * 60 * 60 * 1000 };

    // Determina se é gerente: cargo Gerente OU is_master true OU tipo admin
    const ehGerente = (nome_cargo && nome_cargo.toLowerCase() === 'gerente') || is_master === true || (tipo_usuario && tipo_usuario.toLowerCase() === 'admin');

    res.cookie('usuarioLogado', nome_usuario, cookieOpts);
    // Para manter compatibilidade, marcamos tipo funcionario quando gerente/admin para o frontend
    const tipoParaCookie = ehGerente ? 'funcionario' : (tipo_usuario || 'cliente');
    res.cookie('tipoUsuario', tipoParaCookie, cookieOpts);
    if (ehGerente) {
      res.cookie('cargoUsuario', 'Gerente', cookieOpts);
    } else if (nome_cargo) {
      res.cookie('cargoUsuario', nome_cargo, cookieOpts);
    }

    const payload = { status: 'ok', tipo: tipoParaCookie, nome: nome_usuario, email: email_usuario };
    if (ehGerente) {
      payload.cargo = 'Gerente';
    } else if (nome_cargo) {
      payload.cargo = nome_cargo;
    }
    return res.json(payload);
  } catch (err) {
    console.error('Erro no login unificado (usuarios):', err);
    return res.status(500).json({ status: 'erro', mensagem: err.message });
  }
};