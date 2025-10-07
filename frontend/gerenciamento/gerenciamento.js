const API_BASE_URL = 'http://localhost:3001';
let userInfo = null;

// Verificar se usuário está logado ao carregar a página
window.addEventListener('load', async () => {
    await checkUserLogin();
});

// Verificar login do usuário
async function checkUserLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/login/verificaSeUsuarioEstaLogado`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'ok' && ((result.tipo === 'funcionario' && result.cargo === 'Gerente') || (result.tipo && result.tipo.toLowerCase() === 'admin'))) {
            userInfo = result;
            document.getElementById('userName').textContent = result.nome;
        } else {
            // Redirecionar para login se não for gerente
            alert('Acesso negado. Apenas gerentes podem acessar esta página.');
            window.location.href = '../login/login.html';
        }
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        window.location.href = '../login/login.html';
    }
}

// Ações do menu do usuário
function handleUserAction(action) {
    switch (action) {
        case 'menu':
            window.location.href = '../menu.html';
            break;
        case 'sair':
            logout();
            break;
    }
}

// Logout
async function logout() {
    try {
        await fetch(`${API_BASE_URL}/login/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        window.location.href = '../login/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Abrir modal de gerenciamento
function openManagement(type) {
    const modal = document.getElementById('managementModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('managementContent');
    
    switch (type) {
        case 'pessoas':
            title.textContent = 'Gerenciar Pessoas';
            content.innerHTML = getPessoasManagementHTML();
            break;
        case 'produtos':
            title.textContent = 'Gerenciar Produtos';
            content.innerHTML = getProdutosManagementHTML();
            break;
        case 'franquias':
            title.textContent = 'Gerenciar Franquias';
            content.innerHTML = getFranquiasManagementHTML();
            break;
        case 'cargos':
            title.textContent = 'Gerenciar Cargos';
            content.innerHTML = getCargosManagementHTML();
            break;
    }
    
    modal.style.display = 'block';
    loadManagementData(type);
}

// Fechar modal de gerenciamento
function closeManagement() {
    document.getElementById('managementModal').style.display = 'none';
}

// HTML para gerenciamento de pessoas
function getPessoasManagementHTML() {
    return `
        <div class="management-section">
            <h4>Adicionar Nova Pessoa</h4>
            <form id="pessoaForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="pessoaCpf">CPF:</label>
                        <input type="text" id="pessoaCpf" name="cpf" maxlength="11" required>
                    </div>
                    <div class="form-group">
                        <label for="pessoaNome">Nome Completo:</label>
                        <input type="text" id="pessoaNome" name="nome" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="pessoaEmail">Email:</label>
                        <input type="email" id="pessoaEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="pessoaTelefone">Telefone:</label>
                        <input type="text" id="pessoaTelefone" name="telefone">
                    </div>
                </div>
                <div class="form-group">
                    <label for="pessoaEndereco">Endereço:</label>
                    <input type="text" id="pessoaEndereco" name="endereco">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="pessoaDataNasc">Data de Nascimento:</label>
                        <input type="date" id="pessoaDataNasc" name="data_nascimento">
                    </div>
                    <div class="form-group">
                        <label for="pessoaTipo">Tipo:</label>
                        <select id="pessoaTipo" name="tipo" required>
                            <option value="">Selecione...</option>
                            <option value="cliente">Cliente</option>
                            <option value="funcionario">Funcionário</option>
                        </select>
                    </div>
                </div>
                <div id="funcionarioFields" style="display: none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="funcionarioSalario">Salário:</label>
                            <input type="number" id="funcionarioSalario" name="salario" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="funcionarioCargo">Cargo:</label>
                            <select id="funcionarioCargo" name="cargo_id">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="pessoaSenha">Senha:</label>
                    <input type="password" id="pessoaSenha" name="senha" required>
                </div>
                <button type="submit" class="btn-primary">Adicionar Pessoa</button>
            </form>
        </div>
        
        <div class="management-section">
            <h4>Lista de Pessoas</h4>
            <div id="pessoasList">
                <!-- Lista será carregada aqui -->
            </div>
        </div>
    `;
}

// HTML para gerenciamento de produtos
function getProdutosManagementHTML() {
    return `
        <div class="management-section">
            <h4>Adicionar Novo Produto</h4>
            <form id="produtoForm">
                <div class="form-group">
                    <label for="produtoNome">Nome do Produto:</label>
                    <input type="text" id="produtoNome" name="nome_produto" required>
                </div>
                <div class="form-group">
                    <label for="produtoDescricao">Descrição:</label>
                    <textarea id="produtoDescricao" name="descricao_produto" rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="produtoPreco">Preço:</label>
                        <input type="number" id="produtoPreco" name="preco_unitario" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="produtoEstoque">Quantidade em Estoque:</label>
                        <input type="number" id="produtoEstoque" name="quantidade_estoque" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="produtoCategoria">Categoria:</label>
                        <input type="text" id="produtoCategoria" name="categoria_produto" value="Milkshake">
                    </div>
                    <div class="form-group">
                        <label for="produtoFranquia">Franquia:</label>
                        <select id="produtoFranquia" name="franquia_id_franquia">
                            <option value="1">MILKMOO Centro</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Adicionar Produto</button>
            </form>
        </div>
        
        <div class="management-section">
            <h4>Lista de Produtos</h4>
            <div id="produtosList">
                <!-- Lista será carregada aqui -->
            </div>
        </div>
    `;
}

// HTML para gerenciamento de franquias
function getFranquiasManagementHTML() {
    return `
        <div class="management-section">
            <h4>Adicionar Nova Franquia</h4>
            <form id="franquiaForm">
                <div class="form-group">
                    <label for="franquiaNome">Nome da Franquia:</label>
                    <input type="text" id="franquiaNome" name="nome_franquia" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="franquiaCidade">Cidade:</label>
                        <input type="text" id="franquiaCidade" name="cidade_franquia" required>
                    </div>
                    <div class="form-group">
                        <label for="franquiaTelefone">Telefone:</label>
                        <input type="text" id="franquiaTelefone" name="telefone_franquia">
                    </div>
                </div>
                <div class="form-group">
                    <label for="franquiaEndereco">Endereço:</label>
                    <input type="text" id="franquiaEndereco" name="endereco_franquia" required>
                </div>
                <button type="submit" class="btn-primary">Adicionar Franquia</button>
            </form>
        </div>
        
        <div class="management-section">
            <h4>Lista de Franquias</h4>
            <div id="franquiasList">
                <!-- Lista será carregada aqui -->
            </div>
        </div>
    `;
}

// HTML para gerenciamento de cargos
function getCargosManagementHTML() {
    return `
        <div class="management-section">
            <h4>Adicionar Novo Cargo</h4>
            <form id="cargoForm">
                <div class="form-group">
                    <label for="cargoNome">Nome do Cargo:</label>
                    <input type="text" id="cargoNome" name="nome_cargo" required>
                </div>
                <button type="submit" class="btn-primary">Adicionar Cargo</button>
            </form>
        </div>
        
        <div class="management-section">
            <h4>Lista de Cargos</h4>
            <div id="cargosList">
                <!-- Lista será carregada aqui -->
            </div>
        </div>
    `;
}

// Carregar dados de gerenciamento
async function loadManagementData(type) {
    switch (type) {
        case 'pessoas':
            await loadPessoas();
            break;
        case 'produtos':
            await loadProdutos();
            break;
        case 'franquias':
            await loadFranquias();
            break;
        case 'cargos':
            await loadCargos();
            break;
    }
}

// Carregar pessoas
async function loadPessoas() {
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa`);
        const pessoas = await response.json();
        
        const container = document.getElementById('pessoasList');
        if (pessoas.length === 0) {
            container.innerHTML = '<p>Nenhuma pessoa cadastrada.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${pessoas.map(pessoa => `
                        <tr>
                            <td>${pessoa.nome_pessoa}</td>
                            <td>${pessoa.email_pessoa || '-'}</td>
                            <td>${pessoa.telefone_pessoa || '-'}</td>
                            <td>${pessoa.tipo || 'N/A'}</td>
                            <td class="action-buttons">
                                <button class="action-btn edit-btn" onclick="editPessoa(${pessoa.cpf_pessoa})">Editar</button>
                                <button class="action-btn delete-btn" onclick="deletePessoa(${pessoa.cpf_pessoa})">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar pessoas:', error);
        document.getElementById('pessoasList').innerHTML = '<p>Erro ao carregar dados.</p>';
    }
}

// Carregar produtos
async function loadProdutos() {
    try {
        const response = await fetch(`${API_BASE_URL}/produto`);
        const produtos = await response.json();
        
        const container = document.getElementById('produtosList');
        if (produtos.length === 0) {
            container.innerHTML = '<p>Nenhum produto cadastrado.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${produtos.map(produto => {
                        const precoNumber = Number(
                            typeof produto.preco_unitario === 'string'
                                ? produto.preco_unitario.replace(',', '.')
                                : produto.preco_unitario
                        );
                        const precoFormatado = Number.isFinite(precoNumber)
                            ? `R$ ${precoNumber.toFixed(2).replace('.', ',')}`
                            : (produto.preco_unitario != null ? `R$ ${produto.preco_unitario}` : 'R$ 0,00');
                        return `
                        <tr>
                            <td>${produto.nome_produto}</td>
                            <td>${precoFormatado}</td>
                            <td>${produto.quantidade_estoque}</td>
                            <td>${produto.categoria_produto || 'N/A'}</td>
                            <td class="action-buttons">
                                <button class="action-btn edit-btn" onclick="editProduto(${produto.id_produto})">Editar</button>
                                <button class="action-btn delete-btn" onclick="deleteProduto(${produto.id_produto})">Excluir</button>
                            </td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        document.getElementById('produtosList').innerHTML = '<p>Erro ao carregar dados.</p>';
    }
}

// Carregar franquias
async function loadFranquias() {
    try {
        const response = await fetch(`${API_BASE_URL}/franquia`);
        const franquias = await response.json();
        const container = document.getElementById('franquiasList');
        if (!Array.isArray(franquias) || franquias.length === 0) {
            container.innerHTML = '<p>Nenhuma franquia cadastrada.</p>';
            return;
        }
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cidade</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${franquias.map(franquia => `
                        <tr>
                            <td>${franquia.nome_franquia}</td>
                            <td>${franquia.cidade_franquia}</td>
                            <td>${franquia.endereco_franquia}</td>
                            <td>${franquia.telefone_franquia || '-'}</td>
                            <td class="action-buttons">
                                <button class="action-btn edit-btn" onclick="editFranquia(${franquia.id_franquia})">Editar</button>
                                <button class="action-btn delete-btn" onclick="deleteFranquia(${franquia.id_franquia})">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar franquias:', error);
        document.getElementById('franquiasList').innerHTML = '<p>Erro ao carregar dados.</p>';
    }
}

// Carregar cargos
async function loadCargos() {
    try {
        const response = await fetch(`${API_BASE_URL}/cargo`);
        const cargos = await response.json();
        
        const container = document.getElementById('cargosList');
        if (cargos.length === 0) {
            container.innerHTML = '<p>Nenhum cargo cadastrado.</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome do Cargo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${cargos.map(cargo => `
                        <tr>
                            <td>${cargo.nome_cargo}</td>
                            <td class="action-buttons">
                                <button class="action-btn edit-btn" onclick="editCargo(${cargo.id_cargo})">Editar</button>
                                <button class="action-btn delete-btn" onclick="deleteCargo(${cargo.id_cargo})">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar cargos:', error);
        document.getElementById('cargosList').innerHTML = '<p>Erro ao carregar dados.</p>';
    }
}

// Ir para o menu
function goToMenu() {
    window.location.href = '../menu.html';
}

// Abrir relatórios
function openReports() {
    alert('Funcionalidade de relatórios em desenvolvimento...');
}

// Fechar modais ao clicar fora
window.addEventListener('click', (event) => {
    const modal = document.getElementById('managementModal');
    if (event.target === modal) {
        closeManagement();
    }
});

// Event listeners para formulários
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para mudança de tipo de pessoa
    document.addEventListener('change', function(e) {
        if (e.target.id === 'pessoaTipo') {
            const funcionarioFields = document.getElementById('funcionarioFields');
            if (e.target.value === 'funcionario') {
                funcionarioFields.style.display = 'block';
            } else {
                funcionarioFields.style.display = 'none';
            }
        }
    });
});
