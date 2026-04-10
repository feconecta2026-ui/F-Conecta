// ==============================
//  LOGIN ENHANCED — SISTEMA INTEGRADO
// ==============================

// Configuração das rotas
const AppConfig = {
  ROUTES: {
    LOGIN: "FéConecta.html",      // ← Seu login está numa subpasta
    REGISTER: "register.html",      // ← Register está na pasta principal
    HOME: "inicio/inicio.html",
    PRAYERS: "oracao/oracao.html",
    SAINTS: "vida/vida.html",
    ROSARY: "terco/terco.html", 
    MUSIC: "musica/musica.html",
    DEVOTIONAL: "devocional/devocional.html",
    FAVORITES: "Minhas Orações Favoritas/favoritas.html",
    CONFIG: "configuracoes/configuracoes.html"
  },
  STORAGE_KEYS: {
    USERS: "users",
    LOGGED_USER: "loggedUser"
  }
};

// Função para gerar hash simples da senha
function hashSenha(senha) {
  return btoa(senha); // segurança básica para projeto sem backend
}

// Função para buscar usuário no localStorage
function getUser(email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find((u) => u.email === email);
}

// Verificar se usuário já está logado
function checkExistingAuth() {
  const user = localStorage.getItem("loggedUser");
  const currentPage = window.location.pathname.split("/").pop();

  // Se já está logado e na página de login, redirecionar
  if (user && currentPage === "FéConecta.html") {
    window.location.href = AppConfig.ROUTES.HOME;
    return true;
  }

  return false;
}

// Mostrar loading no botão
function showLoading(button) {
  const originalText = button.innerHTML;
  button.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 8px;">
          <div style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          Entrando...
      </span>
  `;
  button.disabled = true;
  return originalText;
}

// Restaurar botão normal
function hideLoading(button, originalText) {
  button.innerHTML = originalText;
  button.disabled = false;
}

// Estilo para a animação de loading
const loadingStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Adicionar estilos de loading
const styleSheet = document.createElement("style");
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// EVENTO DO FORM DE LOGIN
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se já está autenticado
  if (checkExistingAuth()) {
    return;
  }

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const submitBtn = document.querySelector(".btn");

      // Validações
      if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
      }

      const user = getUser(email);

      if (!user) {
        alert("Usuário não encontrado!");
        return;
      }

      if (user.senha !== hashSenha(senha)) {
        alert("Senha incorreta!");
        return;
      }

      // Mostrar loading
      const originalBtnContent = showLoading(submitBtn);

      // Simular delay de rede
      setTimeout(() => {
        // Login ok -> salva sessão com dados completos
        localStorage.setItem(
          "loggedUser",
          JSON.stringify({
            ...user,
            lastLogin: new Date().toISOString(),
            loginCount: (user.loginCount || 0) + 1,
          })
        );

        // Feedback visual de sucesso
        submitBtn.style.backgroundColor = "#2ecc71";
        submitBtn.innerHTML = `
                  <span style="display: inline-flex; align-items: center; gap: 8px;">
                      <span class="material-symbols-outlined" style="font-size: 18px;">check</span>
                      Login realizado!
                  </span>
              `;

        // Redirecionar após breve delay
        setTimeout(() => {
          window.location.href = AppConfig.ROUTES.HOME;
        }, 1000);
      }, 1500);
    });
  }

  // Melhorias de UX
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");

  if (emailInput) {
    emailInput.addEventListener("focus", function () {
      this.parentElement.style.borderColor = "#c8a265";
      this.parentElement.style.boxShadow = "0 0 0 2px rgba(200, 162, 101, 0.1)";
    });

    emailInput.addEventListener("blur", function () {
      this.parentElement.style.borderColor = "#d9c7b3";
      this.parentElement.style.boxShadow = "none";
    });
  }

  if (senhaInput) {
    senhaInput.addEventListener("focus", function () {
      this.parentElement.style.borderColor = "#c8a265";
      this.parentElement.style.boxShadow = "0 0 0 2px rgba(200, 162, 101, 0.1)";
    });

    senhaInput.addEventListener("blur", function () {
      this.parentElement.style.borderColor = "#d9c7b3";
      this.parentElement.style.boxShadow = "none";
    });
  }

  // Enter para submeter formulário
  document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const loginForm = document.getElementById("loginForm");
      if (loginForm) {
        loginForm.dispatchEvent(new Event("submit"));
      }
    }
  });

  // Preencher automaticamente se tiver dados de teste
  function fillTestData() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length > 0 && !emailInput.value) {
      // Preencher com o primeiro usuário cadastrado (para testes)
      emailInput.value = users[0].email;
      senhaInput.value = "senha123"; // Senha padrão para teste
    }
  }

  // Apenas em ambiente de desenvolvimento
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    fillTestData();
  }
});

// Função de navegação para outras páginas
function navigateTo(page) {
  const user = localStorage.getItem("loggedUser");

  if (!user && !["LOGIN", "REGISTER"].includes(page)) {
    window.location.href = AppConfig.ROUTES.LOGIN;
    return;
  }

  window.location.href = AppConfig.ROUTES[page];
}

// Logout function para consistência
function logout() {
  localStorage.removeItem("loggedUser");
  navigateTo("LOGIN");
}
