// ===============================
//  REGISTER.JS — CADASTRO COMPLETO
// ===============================

function hashSenha(senha) {
  return btoa(senha);
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirma = document.getElementById("confirmar").value.trim();

  if (!nome || !email || !senha || !confirma) {
    alert("Preencha todos os campos!");
    return;
  }

  if (senha !== confirma) {
    alert("As senhas não coincidem!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    alert("Já existe uma conta com esse email!");
    return;
  }

  users.push({
    nome,
    email,
    senha: hashSenha(senha)
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Conta criada com sucesso!");

  window.location.href = "FéConecta.html"; // volta para o login
});
