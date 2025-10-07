const API_BASE_URL = 'http://localhost:3001';

// Removido: abas e registro. Login unificado.

// Função para mostrar alertas
function showAlert(message, type = 'error') {
    // Remover alertas existentes
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Inserir no início do formulário ativo
    const activeTab = document.querySelector('.tab-content.active');
    activeTab.insertBefore(alert, activeTab.firstChild);
    
    // Remover alerta após 5 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Função para mostrar loading
function showLoading(show = true) {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

// Login unificado
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        senha: formData.get('senha')
    };
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/login/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            showAlert('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                if (result.tipo === 'funcionario' && result.cargo === 'Gerente') {
                    window.location.href = '../gerenciamento/gerenciamento.html';
                } else {
                    window.location.href = '../menu.html';
                }
            }, 1500);
        } else {
            showAlert('Email ou senha incorretos!', 'error');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showAlert('Erro ao fazer login. Tente novamente.', 'error');
    } finally {
        showLoading(false);
    }
});

// Removidos: cadastro e máscaras (não usados agora)

// Verificar se já está logado
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/verificaSeUsuarioEstaLogado`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            // Usuário já está logado, redirecionar
            if (result.tipo === 'funcionario') {
                window.location.href = '../gerenciamento/gerenciamento.html';
            } else {
                window.location.href = '../menu.html';
            }
        }
    } catch (error) {
        console.error('Erro ao verificar login:', error);
    }
});
