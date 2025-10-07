const API_BASE_URL = 'http://localhost:3001';
let currentStep = 1;
let selectedPayment = null;
let cart = [];
let orderTotal = 0;

// Inicializar página
window.addEventListener('load', async () => {
    await loadCartFromStorage();
    await checkUserLogin();
    updateOrderSummary();
});

// Carregar carrinho do localStorage
async function loadCartFromStorage() {
    const cartData = localStorage.getItem('milkmoo_cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        calculateTotal();
    } else {
        // Se não há carrinho, redirecionar para o menu
        window.location.href = '../menu.html';
    }
}

// Verificar se usuário está logado
async function checkUserLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/login/verificaSeUsuarioEstaLogado`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.status !== 'ok') {
            alert('Você precisa fazer login para finalizar a compra.');
            window.location.href = '../login/login.html';
        }
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        window.location.href = '../login/login.html';
    }
}

// Calcular total do pedido
function calculateTotal() {
    orderTotal = cart.reduce((total, item) => {
        return total + (item.preco_unitario * item.quantidade);
    }, 0);
}

// Atualizar resumo do pedido
function updateOrderSummary() {
    const container = document.getElementById('orderSummary');
    const totalElement = document.getElementById('orderTotal');
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Nenhum item no carrinho.</p>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-info">
                <div class="item-name">${item.nome_produto}</div>
                <div class="item-details">Quantidade: ${item.quantidade}</div>
            </div>
            <div class="item-price">R$ ${(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}</div>
        </div>
    `).join('');
    
    totalElement.textContent = orderTotal.toFixed(2).replace('.', ',');
}

// Próximo passo
function nextStep() {
    if (currentStep === 1) {
        showStep(2);
    } else if (currentStep === 2) {
        if (!selectedPayment) {
            alert('Por favor, selecione uma forma de pagamento.');
            return;
        }
        
        if (selectedPayment === 'dinheiro') {
            const cashAmount = parseFloat(document.getElementById('cashAmount').value);
            if (!cashAmount || cashAmount < orderTotal) {
                alert('Valor insuficiente. O valor deve ser maior ou igual ao total do pedido.');
                return;
            }
        }
        
        if (selectedPayment === 'debito' || selectedPayment === 'credito') {
            if (!validateCardForm()) {
                return;
            }
        }
        
        showStep(3);
        showPaymentConfirmation();
    }
}

// Passo anterior
function prevStep() {
    if (currentStep === 2) {
        showStep(1);
    } else if (currentStep === 3) {
        showStep(2);
    }
}

// Mostrar passo específico
function showStep(step) {
    // Esconder todos os passos
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remover classes dos steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    
    // Mostrar passo atual
    document.getElementById(`step${step}-content`).classList.add('active');
    document.getElementById(`step${step}`).classList.add('active');
    
    // Marcar passos anteriores como completos
    for (let i = 1; i < step; i++) {
        document.getElementById(`step${i}`).classList.add('completed');
    }
    
    currentStep = step;
}

// Selecionar forma de pagamento
function selectPayment(payment) {
    selectedPayment = payment;
    
    // Remover seleção anterior
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    event.currentTarget.classList.add('selected');
    
    // Mostrar formulário correspondente
    document.querySelectorAll('.payment-form').forEach(form => {
        form.style.display = 'none';
    });
    
    if (payment === 'dinheiro') {
        document.getElementById('cashForm').style.display = 'block';
        setupCashForm();
    } else if (payment === 'debito' || payment === 'credito') {
        document.getElementById('cardForm').style.display = 'block';
        setupCardForm();
    }
    
    // Habilitar botão continuar
    document.getElementById('continueBtn').disabled = false;
}

// Configurar formulário de dinheiro
function setupCashForm() {
    const cashAmountInput = document.getElementById('cashAmount');
    cashAmountInput.value = orderTotal.toFixed(2);
    
    cashAmountInput.addEventListener('input', function() {
        const received = parseFloat(this.value) || 0;
        const change = received - orderTotal;
        
        const changeDiv = document.getElementById('cashChange');
        const changeAmount = document.getElementById('changeAmount');
        
        if (change > 0) {
            changeDiv.style.display = 'block';
            changeAmount.textContent = change.toFixed(2).replace('.', ',');
        } else {
            changeDiv.style.display = 'none';
        }
    });
}

// Configurar formulário de cartão
function setupCardForm() {
    // Máscara para número do cartão
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        this.value = value;
    });
    
    // Máscara para validade
    const cardExpiryInput = document.getElementById('cardExpiry');
    cardExpiryInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value;
    });
    
    // Máscara para CVV
    const cardCvvInput = document.getElementById('cardCvv');
    cardCvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
}

// Validar formulário de cartão
function validateCardForm() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvv = document.getElementById('cardCvv').value;
    const cardName = document.getElementById('cardName').value;
    
    if (!cardNumber || cardNumber.length < 16) {
        alert('Número do cartão inválido.');
        return false;
    }
    
    if (!cardExpiry || cardExpiry.length !== 5) {
        alert('Data de validade inválida.');
        return false;
    }
    
    if (!cardCvv || cardCvv.length < 3) {
        alert('CVV inválido.');
        return false;
    }
    
    if (!cardName.trim()) {
        alert('Nome no cartão é obrigatório.');
        return false;
    }
    
    // Validar se é um cartão real (algoritmo de Luhn)
    if (!validateCardNumber(cardNumber)) {
        alert('Número do cartão inválido.');
        return false;
    }
    
    return true;
}

// Validar número do cartão (algoritmo de Luhn)
function validateCardNumber(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Mostrar confirmação de pagamento
function showPaymentConfirmation() {
    // Esconder todas as confirmações
    document.querySelectorAll('.payment-confirmation').forEach(confirmation => {
        confirmation.style.display = 'none';
    });
    
    if (selectedPayment === 'pix') {
        showPixPayment();
    } else if (selectedPayment === 'dinheiro') {
        showCashPayment();
    } else if (selectedPayment === 'debito' || selectedPayment === 'credito') {
        showCardPayment();
    }
}

// Mostrar pagamento PIX
function showPixPayment() {
    document.getElementById('pixPayment').style.display = 'block';
    document.getElementById('pixAmount').textContent = orderTotal.toFixed(2).replace('.', ',');
	
	// Dados PIX reais (chave e nome do recebedor)
	const recebedorNome = 'Gabriela Arruda Murback';
	const chavePix = '44997350434';
	const cidade = 'BRASILIA'; // limite 15 chars no padrão
	const valor = Number(orderTotal.toFixed(2));
	const txid = 'MILKMOO' + Date.now().toString().slice(-8);

	// Gerar payload BR Code do Pix com CRC16
	const payload = gerarPayloadPix(chavePix, valor, recebedorNome, cidade, txid, 'Pagamento MILKMOO');

	// Exibir QR Code usando serviço de geração (sem dependências)
	const qrCodeDiv = document.getElementById('qrCode');
	const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(payload)}`;
	qrCodeDiv.innerHTML = `<img alt="QR Code PIX" src="${urlQR}" style="image-rendering: pixelated;"/>`;

	// Exibir código copia-e-cola
	const copyArea = document.getElementById('pixCopyPaste');
	if (copyArea) {
		copyArea.textContent = payload;
	}

	console.log('PIX payload:', payload);
}

// ===== Utilidades para gerar BR Code do Pix =====
function emv(k, v) {
	const val = String(v);
	const len = String(val.length).padStart(2, '0');
	return `${k}${len}${val}`;
}

function crc16(str) {
	let crc = 0xFFFF;
	for (let i = 0; i < str.length; i++) {
		crc ^= str.charCodeAt(i) << 8;
		for (let j = 0; j < 8; j++) {
			if ((crc & 0x8000) !== 0) {
				crc = (crc << 1) ^ 0x1021;
			} else {
				crc = crc << 1;
			}
			crc &= 0xFFFF;
		}
	}
	return crc.toString(16).toUpperCase().padStart(4, '0');
}

function gerarPayloadPix(chave, valor, nome, cidade, txid, descricao) {
	// IDs do EMVCo/Pix
	const PF = '000201'; // Payload Format Indicator
	const POI_METHOD = '010211'; // Ponto de Iniciação (dinâmico)

	// Merchant Account Information (GUI 00, chave 01, descrição 02)
	const gui = emv('00', 'BR.GOV.BCB.PIX');
	const k = emv('01', chave);
	const descr = descricao ? emv('02', descricao.substring(0, 99)) : '';
	const mai = emv('26', `${gui}${k}${descr}`);

	// Merchant Category Code (52), Currency (53=986), Amount (54), Country (58=BR), Merchant Name (59), City (60)
	const mcc = emv('52', '0000');
	const curr = emv('53', '986');
	const amt = valor ? emv('54', valor.toFixed(2)) : '';
	const country = emv('58', 'BR');
	const mName = emv('59', nome.substring(0, 25).toUpperCase());
	const mCity = emv('60', cidade.substring(0, 15).toUpperCase());

	// Additional Data Field Template (TXID em 62-05)
	const tx = emv('05', txid.substring(0, 25));
	const addData = emv('62', tx);

	// Monta sem CRC (CRC é 63, 04, + valor)
	const semCRC = `${PF}${POI_METHOD}${mai}${mcc}${curr}${amt}${country}${mName}${mCity}${addData}`;
	const crcHeader = '6304';
	const full = `${semCRC}${crcHeader}`;
	const crc = crc16(full);
	return `${full}${crc}`;
}

// Mostrar pagamento em dinheiro
function showCashPayment() {
    document.getElementById('cashPayment').style.display = 'block';
    
    const cashAmount = parseFloat(document.getElementById('cashAmount').value);
    const change = cashAmount - orderTotal;
    
    document.getElementById('cashOrderTotal').textContent = orderTotal.toFixed(2).replace('.', ',');
    document.getElementById('cashReceived').textContent = cashAmount.toFixed(2).replace('.', ',');
    document.getElementById('cashChangeFinal').textContent = change.toFixed(2).replace('.', ',');
}

// Mostrar pagamento com cartão
function showCardPayment() {
    document.getElementById('cardPayment').style.display = 'block';
    
    // Simular validação do cartão
    const validationSteps = document.querySelectorAll('.validation-step');
    let currentStep = 0;
    
    const showNextStep = () => {
        if (currentStep < validationSteps.length) {
            validationSteps[currentStep].classList.add('active');
            currentStep++;
            setTimeout(showNextStep, 1500);
        }
    };
    
    setTimeout(showNextStep, 500);
}

// Confirmar pagamento
async function confirmPayment() {
    try {
        // Criar pedido no banco de dados
        const orderData = {
            itens: cart,
            total: orderTotal,
            forma_pagamento: selectedPayment,
            data_pedido: new Date().toISOString().split('T')[0],
            hora_pedido: new Date().toTimeString().split(' ')[0]
        };
        
        const response = await fetch(`${API_BASE_URL}/pedido`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            // Limpar carrinho
            localStorage.removeItem('milkmoo_cart');
            
            // Mostrar sucesso
            alert('Pedido realizado com sucesso! Obrigado pela preferência.');
            
            // Redirecionar para o menu
            window.location.href = '../menu.html';
        } else {
            throw new Error('Erro ao processar pedido');
        }
    } catch (error) {
        console.error('Erro ao confirmar pagamento:', error);
        alert('Erro ao processar pagamento. Tente novamente.');
    }
}

// Adicionar CSS para animações
const style = document.createElement('style');
style.textContent = `
    .payment-option.selected {
        border-color: #ff6b6b !important;
        background: rgba(255, 107, 107, 0.1) !important;
    }
    
    .payment-option.selected label {
        color: #ff6b6b !important;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .validation-step {
        animation: fadeIn 0.5s ease;
    }
`;
document.head.appendChild(style);
