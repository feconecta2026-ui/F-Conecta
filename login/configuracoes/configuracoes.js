// ==========================
// CONFIGURAÇÕES - NOME PADRONIZADO
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  if (window.FeState) {
    FeState.applyUserToPage();
  } else {
    const user = localStorage.getItem("loggedUser");
    if (user) {
      try {
        const userData = JSON.parse(user);
        const userNameElement = document.getElementById("userName");
        const userEmailElement = document.getElementById("userEmail");

        if (userNameElement && userData.nome) {
          userNameElement.textContent = userData.nome;
        }
        if (userEmailElement && userData.email) {
          userEmailElement.textContent = userData.email;
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
  }
});
