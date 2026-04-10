window.FeState = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("loggedUser")) || null;
    } catch (error) {
      return null;
    }
  },

  getUserName() {
    const user = this.getUser();
    if (!user) return "Usuário";
    return user.nome || user.name || "Usuário";
  },

  getUserFirstName() {
    return this.getUserName().trim().split(" ")[0] || "Usuário";
  },

  getUserEmail() {
    const user = this.getUser();
    if (!user) return "usuario@email.com";
    return user.email || "usuario@email.com";
  },

  applyUserToPage() {
    document.querySelectorAll("[data-user-name]").forEach(el => {
      el.textContent = this.getUserName();
    });
    document.querySelectorAll("[data-user-first-name]").forEach(el => {
      el.textContent = this.getUserFirstName();
    });
    document.querySelectorAll("[data-user-email]").forEach(el => {
      el.textContent = this.getUserEmail();
    });
  },

  logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "../FéConecta.html";
  }
};
