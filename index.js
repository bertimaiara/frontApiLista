const api = axios.create({
  baseURL: "http://localhost:5555",
});

let usuarioId;

function cadastrar(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const form = {
    nome: nome,
    email: email,
    senha: senha,
  };

  api
    .post("/usuarios", form)
    .then((res) => {
      usuarioId = res.data.id;
      localStorage.setItem("usuario", usuarioId);
      alert(`Usuário cadastrado! ID: ${usuarioId}`);
      window.location.href = "login.html";
    })
    .catch((err) => {
      console.log(err.response.data);
      alert("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
    });
}

function logar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const form = {
    email: email,
    senha: senha,
  };

  return api
    .post("/usuarios/login", form)
    .then((res) => {
      usuarioId = res.data.id;
      localStorage.setItem("usuario", usuarioId);
      alert("Usuário logado!");
      window.location.href = "recados.html";
    })
    .catch((err) => console.log(err.response.data));
}

function getIdUsuario() {
  // const usuarioId = localStorage.getItem("usuario");
  // return usuarioId;
  return 1;
}

function criarRecado(event) {
  event.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const recadoForm = {
    titulo: titulo,
    descricao: descricao,
  };

  api
    .post(`/usuarios/${getIdUsuario()}/recados`, recadoForm)
    .then((res) => {
      console.log(res);
      alert("Recado criado");
    })
    .catch((err) => {
      console.log(err.response);
      alert("Erro ao criar recado");
    });
}

let page = 1;
let pages = 0;
let totalRecados = 0;

function inserirPaginas(paginas) {
  let paginasContainer = document.getElementById("pages");
  paginasContainer.innerHTML = "";
  //abaixo sera criado um array com as paginas
  Array.from(Array(paginas).keys()).forEach((pagina) => {
    paginasContainer.innerHTML += `<button onclick=mostrarRecados(\'${
      pagina + 1
    }\')>${pagina + 1}</button>`;
  });
}

function mostrarRecados(pagina) {
  api
    .get(`usuarios/${getIdUsuario()}/recados`, {
      params: { pagina },
    })
    .then((res) => {
      // res só é usado caso precise pegar a resposta
      // res.data sao os dados que retornam da requisicao
      recados = res.data.recados;
      totalRecados = res.data.total;
      paginas = res.data.paginas;
      let recados = document.getElementById("containerRecados");
      recados.innerHTML = "";

      inserirPaginas(paginas);

      recados.forEach((recado) => {
        recados.innerHTML += `<div class="card">
        <span>${recado.titulo}</span> 
        <p>${recado.descricao}</p>
        <button onclick="mostrarEdicaoRecado(\'${recado.titulo}\', \'${recado.descricao}\',  \'${recado.id}\')">
        Editar</button></div>`;
      });
    })
    .catch((err) => {
      alert(err);
    });
}

function paginaAnterior() {
  if (pagina > 1) {
    pagina--;
    mostrarRecados(pagina);
  }
}

function proximaPagina() {
  if (paginas > pagina) {
    pagina++;
    mostrarRecados(pagina);
  }
}

function mostrarEdicaoRecado(titulo, descricao, id) {
  const formularioEdicao = document.getElementById("formEdicao");
  formularioEdicao.classList.remove("hidden");
  //setando valores no html
  document.getElementById("tituloEdicaoForm").value = titulo;
  document.getElementById("descricaoEdicaoForm").value = descricao;
  document.getElementById("idRecado").value = id; // escondido
}

function atualizarRecado(event) {
  event.preventDefault();

  //pegando valores do html
  const titulo = document.getElementById("tituloEdicaoForm").value;
  const descricao = document.getElementById("descricaoEdicaoForm").value;
  const idRecado = document.getElementById("idRecado").value;
  //id do session
  const idUsuario = localStorage.getItem("usuario");

  //comunicação front com back
  //idUsuario = localStorage (back)

  api
    .put(`/usuarios/${idUsuario}/recados/${idRecado}`, { titulo, descricao })
    .then((res) => {
      alert("Recado Atualizado");
    })
    .catch((err) => {
      alert("Ocorreu um erro, verifique as informações");
    });
}
