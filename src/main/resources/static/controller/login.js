// const botao_login = document.getElementById("btn-login")

function login() {
    // event.preventDefault(); // Impede o envio do formulário padrão
    const username = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    const loginData = {
        "email": username,
        "senha": password
    };

    fetch('http://localhost:8080/apis/security/logar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.text()) // Recebe a resposta como texto
    .then(data => {
        console.log(data)
        if (data.startsWith("Usuário") || data.startsWith("Senha")) {
            throw new Error(data); // Se a resposta contiver uma mensagem de erro, lança um erro
        }
        localStorage.setItem('authToken', data); // Armazena o token no localStorage
        verificarPapelUsuario(data, username); // Redireciona para a tela inicial
    })
    .catch(error => {
        console.error('Erro:', error);
        alert(error.message); // Mostra a mensagem de erro ao usuário
    });
}

function verificarPapelUsuario(token, email) {
    console.log("entrou")
    fetch('http://localhost:8080/apis/security/verificar-papel/', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao verificar o papel do usuário.');
        }
        return response.text();
    })
    .then(nivel => {
        if (nivel == 2) {
            localStorage.setItem('user', email);
            window.location.href = 'http://localhost:8080/page-cidadao.html'; // Redireciona para a página do cidadão
        } else if (nivel == 1) {
            window.location.href = 'http://localhost:8080/page-adm.html'; // Redireciona para a página do administrador
        } else {
            alert('Nível do usuário inválido. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao verificar nível do usuário. Por favor, tente novamente.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Adicionando evento de submissão ao formulário para validação
    const form = document.getElementById('login');
    form.addEventListener('submit', function (event) {
    //   const email = document.getElementById('email');
    //   const senha = document.getElementById('senha');
      
    //   // Validação personalizada para o email
    //   if (email.value === '') {
    //     email.setCustomValidity('Campo obrigatório.');
    //     document.getElementById('emailFeedback').textContent = 'Campo obrigatório.';
    //   } else if (!email.validity.valid) {
    //     email.setCustomValidity('Formato inválido.');
    //     document.getElementById('emailFeedback').textContent = 'Formato inválido.';
    //   } else {
    //     email.setCustomValidity('');
    //   }
  
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        login(); // Chama a função de login
      }
  
      form.classList.add('was-validated');
    });
  });
  

// botao_login.addEventListener('click', login);

