// ==========================
// INÍCIO - NOME PADRONIZADO
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  if (window.FeState) {
    const user = FeState.getUser();
    if (!user) {
      window.location.href = "../FéConecta.html";
      return;
    }

    FeState.applyUserToPage();

    const greetingElement = document.querySelector("[data-user-first-name]");
    if (greetingElement) {
      greetingElement.textContent = FeState.getUserFirstName();
    }
  }

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const today = new Date().toLocaleDateString("pt-BR", options);
  const dateElement = document.querySelector(".date");
  if (dateElement) {
    dateElement.textContent = today;
  }
});

function logout() {
  if (window.FeState) {
    FeState.logout();
  } else {
    localStorage.removeItem("loggedUser");
    window.location.href = "../FéConecta.html";
  }
}
