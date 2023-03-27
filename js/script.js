
const Main = {
    init: function () {
        this.cacheSelectors()
        this.bindEvents()
    },

    cacheSelectors: function () {
        this.$form_simulador = document.getElementById('simulador')
        this.$container = document.querySelector('.container')
    },

    bindEvents: function () {
        this.$form_simulador.addEventListener('submit', this.Events.validarFormulario.bind(this))
    },

    simularAPI: async function (objeto) {
        const config = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(objeto)
        }

        const response = await fetch(`https://api.mathjs.org/v4/`, config)
        const data = await response.json()
        this.output(data)
    },

    output: function (data) {
        const simulador = document.forms[0]
        const nome = simulador['nome'].value
        const nomeFormatado = nome[0].toUpperCase() + nome.substring(1).toLowerCase()
        const valorMensal = parseFloat(simulador['valorMensal'].value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        const tempo = simulador['tempo'].value
        const mesOuAno = simulador['MesOuAno'].value
        const resultado = parseFloat(data.result).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        this.$container.classList.add(`transition`)

        setTimeout(() => {
            this.$container.innerHTML = `<p>Olá ${nomeFormatado}, juntando ${valorMensal} todo mês, você terá ${resultado} em ${tempo} ${this.unidades(mesOuAno, tempo)}.</p><button class="btn reload" onclick="location.reload()">Fazer outra simulação</button>`
            this.$container.classList.remove(`transition`)
            this.$container.classList.add(`output`)
        }, 1000)
    },

    convert: function (string) {
        const replace = string.replace(',', '.')
        return parseFloat(replace).toFixed(2)
    },

    multiply: function (value, type) {
        const valorParseado = parseInt(value)
        if (type === 'meses') {
            return valorParseado
        } else if (type === 'anos') {
            return valorParseado * 12
        }
    },

    fees: function (juros) {
        const ju = juros.replace(',', '.')
        return parseFloat(ju) / 100
    },

    unidades: function (mesOuAno, tempo) {
        if (tempo == 1) {
            if (mesOuAno === 'anos') {
                return 'ano'
            } else {
                return 'mês'
            }
        } else {
            return mesOuAno
        }

    },
    
    Events: {
        validarFormulario: function (e) {
            e.preventDefault()
            let erro = false
            const simulador = document.forms[0]
            const nome = simulador['nome']
            const valorMensal = simulador['valorMensal']
            const taxaJuros = simulador['taxaJuros']
            const tempo = simulador['tempo']
            const mesOuAno = simulador['MesOuAno']
            // console.log(mesOuAno.value)

            if (!nome.value || !isNaN(nome.value)) {
                erro = true
                nome.previousElementSibling.innerHTML = 'Preencha o nome corretamente'
                nome.classList.add('erroFormulario')

                setTimeout(() => {
                    nome.previousElementSibling.innerHTML = 'Nome:'
                }, 3000)
            } else {
                nome.classList.remove('erroFormulario')
            }

            if (!valorMensal.value) {
                erro = true
                valorMensal.previousElementSibling.innerHTML = 'Preencha o valor mensal corretamente'
                valorMensal.classList.add('erroFormulario')

                setTimeout(() => {
                    valorMensal.previousElementSibling.innerHTML = 'Valor aplicado mensalmente:'
                }, 3000)
            } else {
                valorMensal.classList.remove('erroFormulario')
            }

            if (!taxaJuros.value) {
                erro = true
                taxaJuros.previousElementSibling.innerHTML = 'Preencha a taxa de juros corretamente'
                taxaJuros.classList.add('erroFormulario')

                setTimeout(() => {
                    taxaJuros.previousElementSibling.innerHTML = 'Taxa de Juros:'
                }, 3000)
            } else {
                taxaJuros.classList.remove('erroFormulario')
            }

            if (!tempo.value || tempo.value < 1) {
                erro = true
                tempo.parentElement.previousElementSibling.innerHTML = 'Preencha a duração corretamente'
                tempo.classList.add('erroFormulario')

                setTimeout(() => {
                    tempo.parentElement.previousElementSibling.innerHTML = 'Duração da aplicação:'
                }, 3000)
            } else {
                tempo.classList.remove('erroFormulario')
            }

            if (mesOuAno.value === "Selecione") {
                erro = true
                mesOuAno.style.color = 'red'
                mesOuAno.classList.add('erroFormulario')

                setTimeout(() => {
                    mesOuAno.style.color = 'black'
                }, 3000)
            } else {
                mesOuAno.classList.remove('erroFormulario')
            }

            if (!erro) {
                const investimento = this.convert(valorMensal.value)
                const totalMeses = this.multiply(tempo.value, mesOuAno.value)
                const juros = this.fees(taxaJuros.value)
                const unidade = this.unidades(mesOuAno.value, tempo.value)
                console.log(investimento, totalMeses, juros, unidade)
                const obj = {
                    "expr": `${investimento} * (((1 + ${juros}) ^ ${totalMeses} - 1) / ${juros})`
                }
                this.simularAPI(obj)
            }

        }
    }
}
Main.init()