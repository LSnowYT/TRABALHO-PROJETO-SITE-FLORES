// Usuários de teste
const users = {
    admin: {
        password: 'admin',
        type: 'admin'
    },
    func: {
        password: 'func',
        type: 'funcionario'
    }
};

// Elementos do DOM - serão inicializados quando o DOM estiver pronto
let loginSection, dashboardSection, loginForm, loginError, logoutBtn, userInfo;

// Verificar se há usuário logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando aplicação...');

    // Inicializar elementos do DOM
    loginSection = document.getElementById('loginSection');
    dashboardSection = document.getElementById('dashboardSection');
    loginForm = document.getElementById('loginForm');
    loginError = document.getElementById('loginError');
    logoutBtn = document.getElementById('logoutBtn');
    userInfo = document.getElementById('userInfo');

    // Verificar se os elementos foram encontrados
    if (!loginSection) console.error('Elemento loginSection não encontrado!');
    if (!dashboardSection) console.error('Elemento dashboardSection não encontrado!');
    if (!loginForm) console.error('Elemento loginForm não encontrado!');

    const loggedUser = localStorage.getItem('loggedUser');
    const userType = localStorage.getItem('userType');
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';

    console.log('Usuário logado:', loggedUser, 'Tipo:', userType, 'Tema:', savedTheme);

    // Aplicar tema salvo
    applyTheme(savedTheme);

    if (loggedUser && userType) {
        showDashboard(loggedUser, userType);
    } else {
        showLogin();
    }

    // Inicializar seletor de temas
    initializeThemeSelector();

    // Configurar eventos
    setupEventListeners();
});

function setupEventListeners() {
    // Evento do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulário de login submetido');

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;

            console.log('Tentativa de login:', username, userType);

            // Validar credenciais
            if (users[username] && users[username].password === password && users[username].type === userType) {
                // Login bem-sucedido
                console.log('Login bem-sucedido!');
                localStorage.setItem('loggedUser', username);
                localStorage.setItem('userType', userType);
                if (loginError) loginError.style.display = 'none';
                showDashboard(username, userType);
            } else {
                // Login falhou
                console.log('Login falhou!');
                if (loginError) {
                    loginError.style.display = 'block';
                    loginError.textContent = 'Usuário, senha ou tipo inválido!';
                }
                document.getElementById('password').value = '';
            }
        });
    }

    // Evento de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout realizado');
            localStorage.removeItem('loggedUser');
            localStorage.removeItem('userType');
            showLogin();
        });
    }
}

function showLogin() {
    console.log('Mostrando tela de login');
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('userType').value = '';
    if (loginError) loginError.style.display = 'none';
}

function showDashboard(username, userType) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';

    // Mostrar informações do usuário
    const tipoExibicao = userType === 'admin' ? 'Administrador' : 'Funcionário';
    userInfo.innerHTML = `<span>👤 ${username.toUpperCase()} (${tipoExibicao})</span>`;

    // Aplicar restrições se for funcionário
    if (userType === 'funcionario') {
        aplicarRestricoesFuncionario();
    } else {
        removerRestricoesFuncionario();
    }
}

// Aplicar restrições para funcionário
function aplicarRestricoesFuncionario() {
    // Desabilitar botões de ação para funcionário
    const botoes = document.querySelectorAll('.btn-action');
    botoes.forEach(botao => {
        botao.disabled = true;
        botao.style.opacity = '0.5';
        botao.style.cursor = 'not-allowed';
    });

    // Adicionar mensagem informativa
    const container = document.querySelector('.container');
    let aviso = document.getElementById('avisoFuncionario');
    if (!aviso) {
        aviso = document.createElement('div');
        aviso.id = 'avisoFuncionario';
        aviso.style.cssText = `
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #ffeaa7;
        `;
        aviso.innerHTML = '⚠️ <strong>Modo Consulta:</strong> Funcionários podem apenas visualizar as cobranças. Para realizar ações, solicite permissão ao administrador.';
        container.insertBefore(aviso, container.firstChild);
    }
}

// Remover restrições para admin
function removerRestricoesFuncionario() {
    const botoes = document.querySelectorAll('.btn-action');
    botoes.forEach(botao => {
        botao.disabled = false;
        botao.style.opacity = '1';
        botao.style.cursor = 'pointer';
    });

    const aviso = document.getElementById('avisoFuncionario');
    if (aviso) {
        aviso.remove();
    }
}

// Sistema de Temas
function initializeThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const currentTheme = localStorage.getItem('selectedTheme') || 'default';

    // Marcar tema atual como selecionado
    themeOptions.forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('selected');
        }

        // Adicionar evento de clique
        option.addEventListener('click', function() {
            const selectedTheme = this.dataset.theme;

            // Remover seleção anterior
            themeOptions.forEach(opt => opt.classList.remove('selected'));
            // Adicionar seleção atual
            this.classList.add('selected');

            // Aplicar tema
            applyTheme(selectedTheme);

            // Salvar tema
            localStorage.setItem('selectedTheme', selectedTheme);

            // Mostrar confirmação
            showThemeStatus();
        });
    });
}

function applyTheme(theme) {
    // Remover temas anteriores
    document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();

    // Aplicar novo tema
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
}

function showThemeStatus() {
    const status = document.getElementById('themeStatus');
    if (status) {
        status.style.display = 'block';

        // Esconder após 3 segundos
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

function showThemeStatus() {
    const status = document.getElementById('themeStatus');
    status.style.display = 'block';

    // Esconder após 3 segundos
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}
    
    // Adicionar mensagem informativa
    const container = document.querySelector('.container');
    let aviso = document.getElementById('avisoFuncionario');
    if (!aviso) {
        aviso = document.createElement('div');
        aviso.id = 'avisoFuncionario';
        aviso.style.cssText = `
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #ffeaa7;
        `;
        aviso.innerHTML = '⚠️ <strong>Modo Consulta:</strong> Funcionários podem apenas visualizar as cobranças. Para realizar ações, solicite permissão ao administrador.';
        container.insertBefore(aviso, container.firstChild);
    }


// Remover restrições para admin
function removerRestricoesFuncionario() {
    const botoes = document.querySelectorAll('.btn-action');
    botoes.forEach(botao => {
        botao.disabled = false;
        botao.style.opacity = '1';
        botao.style.cursor = 'pointer';
    });
    
    const aviso = document.getElementById('avisoFuncionario');
    if (aviso) {
        aviso.remove();
    }
}
