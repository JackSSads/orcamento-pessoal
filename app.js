class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {     																// Despesa deve conter todos os campos preenchidos
                return false
            }

            else if (this.dia <= 0 || this.dia >= 32) {                           										// Dia tem que ser entre 1 e 31
                return false
            }

            else if (localStorage.despesa) {

            }
        }

        return true

    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {                                                      					// Teste para saber se o id é null
            localStorage.setItem('id', 0)                                       // Se for null, adiciona 0 como id inicial
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')                              // Recupera o id atual
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))                             // É preciso transformar o objeto em JSON

        localStorage.setItem('id', id)                                          // atualizar o id na posição atual
    }

    recuperarTodosRegistros() {
        let despesas = Array()

        let id = localStorage.getItem('id')

        for (let i = 0; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa === null) {
                continue
            }

            despesa.id = i

            despesas.push(despesa)
        }

        return despesas

    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()


        // ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        // mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        // dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        // tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        // descrição
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        // valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()                                                               // Instância da classe Bd

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa
        (
            ano.value,
            mes.value,
            dia.value,
            tipo.value,
            descricao.value,
            valor.value
        )

    if (despesa.validarDados()) {                                               							// Manipulação dos elementos HTML para caso de erro ou sucesso
        bd.gravar(despesa)

        document.getElementById('tituloModal').classList.add('text-success')
        document.getElementById('btnVoltar').classList.add('btn-success')

        document.getElementById('tituloModal').innerHTML = 'Sucesso'
        document.getElementById('bodyModal').innerHTML = 'A gravação foi bem sucedida'
        document.getElementById('btnVoltar').innerHTML = 'Voltar'

        $("#modalRegistroDespesa").modal('show');

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    }

    else {
        document.getElementById('tituloModal').classList.remove('text-success')
        document.getElementById('tituloModal').classList.add('text-danger')
        document.getElementById('btnVoltar').classList.remove('btn-success')
        document.getElementById('btnVoltar').classList.add('btn-danger')

        document.getElementById('tituloModal').innerHTML = 'Erro'
        document.getElementById('bodyModal').innerHTML = 'Existem campos obrigatórios que não foram preenchidos corretamente'
        document.getElementById('btnVoltar').innerHTML = 'Voltar e corrigir'

        $("#modalRegistroDespesa").modal('show');
    }
}

function carregaListaDespesas(despesas = Array(), filter = false) {
    if (despesas.length == 0 && filter == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    // selecioa o elemento tbody
    var listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    // percorrer o array com o forEach
    despesas.forEach(function (d) {

        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break

            case '2': d.tipo = 'Educação'
                break

            case '3': d.tipo = 'Lazer'
                break

            case '4': d.tipo = 'Saúde'
                break

            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`

        // removendo despesa
        btn.onclick = function () {

            let id = this.id.replace('id_despesa_', '')

            // bd.remover(id)

            $("#modalRemover").modal('show');

            window.location.reload()

        }

        linha.insertCell(4).append(btn)

    })
}

function pesquisarDespeas() {

    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let valor = document.getElementById('valor').value
    let descricao = document.getElementById('descricao').value
    let tipo = document.getElementById('tipo').value

    let despesa = new Despesa(ano, mes, dia, valor, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}
