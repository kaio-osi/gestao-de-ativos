const camposIds = ['estacao', 'serie', 'fabricante', 'modelo', 'usuario', 'empresa', 'setor'];
const empresasFixas = ["Agile Assistência", "Agile Connect", "Antena Centro Automotivo", "Antena Tecnologia", "Coonecta", "Global Group"];


async function adicionarItem() {
    const dados = {};
    let erro = false;

    camposIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value || !el.value.trim()) {
            el.style.borderLeft = "4px solid var(--danger)";
            erro = true;
        } else {
            el.style.borderLeft = "1px solid var(--border)";
            dados[id] = el.value.trim();
        }
    });

    dados.status = document.getElementById('status').value;
    const linkInput = document.getElementById('termo-link');
    dados.termo = linkInput.value.trim() || "---";

    if (erro) return alert("Preencha todos os campos!");

    try {
        const response = await fetch('/api/estacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Cadastrado com sucesso!");
            limparCampos();
            
            const tabela = document.getElementById('listaEstoque');
            tabela.innerHTML = ""; 
            await carregarDadosIniciais(); 
        } else {
            const resErro = await response.json();
            alert("Erro no servidor: " + (resErro.erro || "Erro inesperado"));
        }
    } catch (err) {
        console.error("Erro na requisição:", err);
        await carregarDadosIniciais();
    }
}

function renderizarLinha(linha, dados) {
    const id = dados.EstacaoID || dados.id;
    linha.setAttribute('data-id', id);

    const linkTermo = dados.Termo || dados.termo || "---";
    
    // Criar o HTML do link se ele existir
    const celulaTermo = (linkTermo !== "---") 
        ? `<a href="${linkTermo}" target="_blank" class="btn-link">Visualizar</a>` 
        : "---";

    linha.innerHTML = `
        <td>${dados.Estacao || dados.estacao || ''}</td>
        <td>${dados.Serie || dados.serie || ''}</td>
        <td>${dados.Fabricante || dados.fabricante || ''}</td>
        <td>${dados.Modelo || dados.modelo || ''}</td>
        <td>${dados.Usuario || dados.usuario || ''}</td>
        <td>${dados.Empresa || dados.empresa || ''}</td>
        <td>${dados.Setor || dados.setor || ''}</td>
        <td class="status-cell">${dados.Status || dados.status || ''}</td>
        <td title="${linkTermo}">${celulaTermo}</td>
        <td>
            <button class="btn-edit" onclick="editarLinha(this)">Editar</button>
            <button class="btn-delete" onclick="excluirLinha(this)">Excluir</button>
        </td>
    `;
    aplicarCoresStatus(linha);
}

function editarLinha(botao) {
    const linha = botao.closest('tr');
    const celulas = linha.cells;
    
    const dadosAtuais = {
        estacao: celulas[0].innerText,
        serie: celulas[1].innerText,
        fabricante: celulas[2].innerText,
        modelo: celulas[3].innerText,
        usuario: celulas[4].innerText,
        empresa: celulas[5].innerText,
        setor: celulas[6].innerText,
        status: celulas[7].innerText.trim(),
        termo: celulas[8].getAttribute('title') || "---" 
    };

    const optionsEmpresa = empresasFixas.map(emp => 
        `<option value="${emp}" ${dadosAtuais.empresa === emp ? 'selected' : ''}>${emp}</option>`
    ).join('');

    linha.innerHTML = `
        <td><input type="text" value="${dadosAtuais.estacao}" class="input-edit-tabela" required></td>
        <td><input type="text" value="${dadosAtuais.serie}" class="input-edit-tabela" required></td>
        <td><input type="text" value="${dadosAtuais.fabricante}" class="input-edit-tabela" required></td>
        <td><input type="text" value="${dadosAtuais.modelo}" class="input-edit-tabela" required></td>
        <td><input type="text" value="${dadosAtuais.usuario}" class="input-edit-tabela" required></td>
        <td><select class="input-edit-tabela" required>${optionsEmpresa}</select></td>
        <td><input type="text" value="${dadosAtuais.setor}" class="input-edit-tabela" required></td>
        <td>
            <select class="input-edit-tabela">
                <option value="Em Uso" ${dadosAtuais.status === 'Em Uso' ? 'selected' : ''}>Em Uso</option>
                <option value="Estoque" ${dadosAtuais.status === 'Estoque' ? 'selected' : ''}>Estoque</option>
            </select>
        </td>
        <td><input type="text" value="${dadosAtuais.termo}" class="input-edit-tabela"></td>
        <td>
            <button class="btn-save" onclick="salvarEdicao(this)">Salvar</button>
            <button class="btn-delete" onclick="cancelarEdicao(this, ${JSON.stringify(dadosAtuais).replace(/"/g, '&quot;')})">Sair</button>
        </td>
    `;
}

async function salvarEdicao(botao) {
    const linha = botao.closest('tr');
    const id = linha.getAttribute('data-id');
    const inputs = linha.querySelectorAll('.input-edit-tabela');
    
    let temErro = false;
    const novosDados = {};
    const chaves = ['estacao', 'serie', 'fabricante', 'modelo', 'usuario', 'empresa', 'setor', 'status', 'termo'];

    inputs.forEach((input, index) => {
        const valor = input.value.trim();
        
        if (valor === "" && index < 8) {
            input.style.border = "2px solid red";
            temErro = true;
        } else {
            input.style.border = "1px solid #ccc";
            if (chaves[index]) {

                novosDados[chaves[index]] = (index === 8 && valor === "") ? "---" : valor;
            }
        }
    });

    if (temErro) {
        alert("Preencha todos os campos obrigatórios!");
        return; 
    }

    try {
        const response = await fetch(`/api/estacoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novosDados)
        });

        if (response.ok) {
            alert("Registro atualizado com sucesso!");
            await carregarDadosIniciais(); 
        } else {
            const resErro = await response.json();
            alert("Erro ao salvar: " + (resErro.erro || "Erro no servidor"));
        }
    } catch (err) {
        console.error("Erro na requisição:", err);
        alert("Erro de conexão com o servidor.");
    }
}

function cancelarEdicao(botao, dadosOriginais) {
    renderizarLinha(botao.closest('tr'), dadosOriginais);
}

async function excluirLinha(botao) {
    const linha = botao.closest('tr');
    const id = linha.getAttribute('data-id');

    if (!id) return alert("ID não encontrado para exclusão.");

    if (confirm(`Tem certeza que deseja excluir o item #${id}?`)) {
        try {
            const response = await fetch(`/api/estacoes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                linha.remove();
                atualizarContador();
            } else {
                alert("Erro ao excluir do banco de dados.");
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
        }
    }
}

function exportarExcel() {
    const tabela = document.getElementById("tabelaDados");
    const wb = XLSX.utils.table_to_book(tabela, { sheet: "Estações" });
    XLSX.writeFile(wb, "Relatorio_Estacoes_AgileConnect.xlsx");
}

function limparCampos() {
    camposIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.value = '';
            el.style.borderLeft = "1px solid var(--border)";
        }
    });
    const linkInput = document.getElementById('termo-link');
    if(linkInput) linkInput.value = '';
}

function atualizarContador() {
    document.getElementById('totalCount').innerText = document.querySelectorAll('#listaEstoque tr').length;
}

function filtrarTabela() {
    const busca = document.getElementById("filtroGeral").value.toUpperCase();
    document.querySelectorAll("#listaEstoque tr").forEach(row => {
        row.style.display = row.innerText.toUpperCase().includes(busca) ? "" : "none";
    });
}

function aplicarCoresStatus(linha) {
    const celStatus = linha.querySelector('.status-cell');
    if(!celStatus) return;
    const status = celStatus.innerText.trim();
    celStatus.style.color = (status === 'Em Uso') ? "#10b981" : "#f59e0b";
    celStatus.style.fontWeight = "bold";
}

async function carregarDadosIniciais() {
    const response = await fetch('/api/estacoes');
    const dados = await response.json();
    
    const tabela = document.getElementById('listaEstoque');
    tabela.innerHTML = ""; // Limpa a tabela antes de carregar
    
    dados.forEach(item => {
        renderizarLinha(tabela.insertRow(), item);
    });
    atualizarContador();
}

window.onload = carregarDadosIniciais;