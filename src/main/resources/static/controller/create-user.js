const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  
  $(document).ready(function () {
    $('#cpf').mask('000.000.000-00');
  });
  
  function cadastrarUsuario(event) {
    event.preventDefault();
  
    const cpf = document.getElementById('cpf').value.replace(/[.\-]/g, '');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    if (!cpf || !email || !password) {
      Toast.fire({
        icon: 'error',
        title: 'Erro, campos inválidos.'
      });
      return;
    }
  
    fetch('http://localhost:8080/apis/cidadao/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpf: cpf,
        email: email,
        senha: password
      })
    })
      .then(response => {
        if (response.status === 201) {
            Toast.fire({
                icon: 'success',
                title: 'Usuário cadastrado com sucesso!'
              });
        
              document.getElementById('formCadastroUsuario').reset();
            return response.json();
          } else {
            // throw new Error('Falha ao cadastrar usuário');
            Toast.fire({
                icon: 'error',
                title: 'Houve um problema ao cadastrar o usuário.'
              });
          }
      })
  }
  