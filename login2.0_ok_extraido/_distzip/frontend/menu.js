const API_BASE_URL = 'http://localhost:3001';
let cart = [];
let userInfo = null;
let products = [];

// Verificar se usuário está logado ao carregar a página
window.addEventListener('load', async () => {
    loadCartFromStorage();
    await checkUserLogin();
    await loadProducts();
    updateCartDisplay();
});

// Verificar login do usuário
async function checkUserLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/login/verificaSeUsuarioEstaLogado`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            userInfo = result;
            document.getElementById('userName').textContent = result.nome;
            
            // Atualizar opções do menu baseado no tipo de usuário
            const userSelect = document.getElementById('oUsuario');
            userSelect.innerHTML = `
                <option value="">Menu</option>
                <option value="carrinho">Ver Carrinho</option>
                <option value="sair">Sair</option>
            `;
            
            if (result.tipo === 'funcionario') {
                userSelect.innerHTML += `<option value="gerenciamento">Gerenciamento</option>`;
            }
        } else {
            document.getElementById('userName').textContent = 'Visitante';
        }
    } catch (error) {
        console.error('Erro ao verificar login:', error);
    }
}

// Carregar produtos do banco de dados
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/produto`);
        const result = await response.json();
        
        if (Array.isArray(result)) {
            products = result;
            displayProducts(products);
        } else {
            console.error('Erro ao carregar produtos:', result);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Em caso de erro, mostrar produtos de exemplo
        products = [
            {
                id_produto: 1,
                nome_produto: 'Milkshake de Chocolate',
                descricao_produto: 'Delicioso milkshake de chocolate com chantilly',
                preco_unitario: 12.90,
                categoria_produto: 'Milkshake',
                quantidade_estoque: 50
            },
            {
                id_produto: 2,
                nome_produto: 'Milkshake de Morango',
                descricao_produto: 'Refrescante milkshake de morango natural',
                preco_unitario: 12.90,
                categoria_produto: 'Milkshake',
                quantidade_estoque: 50
            },
            {
                id_produto: 3,
                nome_produto: 'Milkshake de Baunilha',
                descricao_produto: 'Clássico milkshake de baunilha cremosa',
                preco_unitario: 11.90,
                categoria_produto: 'Milkshake',
                quantidade_estoque: 50
            },
            {
                id_produto: 4,
                nome_produto: 'Milkshake de Oreo',
                descricao_produto: 'Milkshake com pedaços de biscoito Oreo',
                preco_unitario: 14.90,
                categoria_produto: 'Milkshake',
                quantidade_estoque: 50
            },
            {
                id_produto: 5,
                nome_produto: 'Milkshake de Nutella',
                descricao_produto: 'Milkshake com Nutella e avelãs',
                preco_unitario: 15.90,
                categoria_produto: 'Milkshake',
                quantidade_estoque: 50
            },
            {
                id_produto: 6,
                nome_produto: 'Milkshake de Caramelo',
                descricao_produto: 'Milkshake com calda de caramelo',
                preco_unitario: 13.90,
                categoria_produto: 'Milkshake',
                quantidade_estoque: 50
            }
        ];
        displayProducts(products);
    }
}

// Exibir produtos na tela
function displayProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        // Sanitiza números para evitar erro quando vier como string
        if (product && typeof product.preco_unitario === 'string') {
            const n = Number(String(product.preco_unitario).replace(',', '.'));
            if (Number.isFinite(n)) product.preco_unitario = n; else product.preco_unitario = 0;
        }
        if (product && typeof product.quantidade_estoque === 'string') {
            const q = Number(String(product.quantidade_estoque).replace(',', '.'));
            product.quantidade_estoque = Number.isFinite(q) ? q : 0;
        }
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Criar card do produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.categoria_produto;
    
    const emoji = getProductEmoji(product.nome_produto || '');
    
    card.innerHTML = `
        <div class="product-image">
            ${emoji}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.nome_produto}</h3>
            <p class="product-description">${product.descricao_produto || 'Descrição não disponível'}</p>
            <div class="product-price">R$ ${(Number(product.preco_unitario)||0).toFixed(2).replace('.', ',')}</div>
            <div class="product-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${product.id_produto})">-</button>
                    <input type="number" class="quantity-input" id="qty-${product.id_produto}" value="1" min="1" max="${product.quantidade_estoque}">
                    <button class="quantity-btn" onclick="increaseQuantity(${product.id_produto})">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id_produto})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Obter emoji baseado no nome do produto
function getProductEmoji(productName) {
    const name = productName.toLowerCase();
    if (name.includes('chocolate')) return '🍫';
    if (name.includes('morango')) return '🍓';
    if (name.includes('baunilha')) return '🍦';
    if (name.includes('oreo')) return '🍪';
    if (name.includes('nutella')) return '🥜';
    if (name.includes('caramelo')) return '🍯';
    if (name.includes('cookies')) return '🍪';
    if (name.includes('pistache')) return '🥜';
    return '🥛';
}

// Filtrar produtos por categoria
function filterProducts(category) {
    // Atualizar botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filtrar produtos
    let filteredProducts = products;
    if (category !== 'todos') {
        filteredProducts = products.filter(product => product.categoria_produto === category);
    }
    
    displayProducts(filteredProducts);
}

// Aumentar quantidade
function increaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    const product = products.find(p => p.id_produto === productId);
    if (input.value < product.quantidade_estoque) {
        input.value = parseInt(input.value) + 1;
    }
}

// Diminuir quantidade
function decreaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id_produto === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    
    if (!product) return;
    
    // Verificar se produto já está no carrinho
    const existingItem = cart.find(item => item.id_produto === productId);
    
    if (existingItem) {
        existingItem.quantidade += quantity;
    } else {
        cart.push({
            id_produto: productId,
            nome_produto: product.nome_produto,
            preco_unitario: product.preco_unitario,
            quantidade: quantity
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showCartNotification();
}

// Mostrar notificação de item adicionado
function showCartNotification() {
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #feca57);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = 'Item adicionado ao carrinho!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Atualizar exibição do carrinho
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
        cartTotal.textContent = '0,00';
        checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.preco_unitario * item.quantidade;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nome_produto}</div>
                <div class="cart-item-price">R$ ${item.preco_unitario.toFixed(2).replace('.', ',')} x ${item.quantidade}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id_produto}, ${item.quantidade - 1})">-</button>
                <span>${item.quantidade}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id_produto}, ${item.quantidade + 1})">+</button>
                <button class="quantity-btn" onclick="removeFromCart(${item.id_produto})" style="background: #dc3545;">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
    checkoutBtn.disabled = false;

    // Atualiza badge do carrinho
    const badge = document.getElementById('cartBadge');
    const count = cart.reduce((acc, it) => acc + it.quantidade, 0);
    if (badge) {
        if (count > 0) {
            badge.textContent = String(count);
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Atualizar quantidade no carrinho
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id_produto === productId);
    if (item) {
        item.quantidade = newQuantity;
        updateCartDisplay();
        saveCartToStorage();
    }
}

// Remover item do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id_produto !== productId);
    updateCartDisplay();
    saveCartToStorage();
}

// Abrir carrinho
function openCart() {
    document.getElementById('cartModal').style.display = 'block';
}

// Fechar carrinho
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Abrir modal de login
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

// Fechar modal de login
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Ir para página de login
function goToLogin() {
    window.location.href = './login/login.html';
}

// Proceder para checkout
function proceedToCheckout() {
    if (!userInfo) {
        closeCart();
        openLoginModal();
        return;
    }
    
    // Salvar carrinho no localStorage
    localStorage.setItem('milkmoo_cart', JSON.stringify(cart));
    
    // Redirecionar para página de pagamento
    window.location.href = './pagamento/pagamento.html';
}

// Persistência do carrinho
function saveCartToStorage() {
    try {
        localStorage.setItem('milkmoo_cart', JSON.stringify(cart));
    } catch (e) {}
}

function loadCartFromStorage() {
    try {
        const data = localStorage.getItem('milkmoo_cart');
        if (data) cart = JSON.parse(data);
    } catch (e) {}
}
// Ações do menu do usuário
function handleUserAction(action) {
    switch (action) {
        case 'login':
            goToLogin();
            break;
        case 'carrinho':
            openCart();
            break;
        case 'gerenciamento':
            window.location.href = './gerenciamento/gerenciamento.html';
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
        
        // Limpar dados locais
        userInfo = null;
        cart = [];
        
        // Recarregar página
        window.location.reload();
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Fechar modais ao clicar fora
window.addEventListener('click', (event) => {
    const cartModal = document.getElementById('cartModal');
    const loginModal = document.getElementById('loginModal');
    
    if (event.target === cartModal) {
        closeCart();
    }
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
});

// Adicionar CSS para animação da notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);