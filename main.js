const API_URL = 'http://localhost:3000'

const state = {
    raffles: [],
    selectedRaffles: [],
    selectedAll: false,
    error: false,
    errorMessage: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit dicta itaque deleniti, sunt et excepturi! Magni iste eaque dolor aliquam, dolorem, optio eos error qui commodi nam vitae quo ratione.',
    success: false,
    successMessage: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati iusto minima tempore? A neque blanditiis, ullam perferendis delectus odit! Deserunt, consequatur non. Cumque dolores nihil architecto a temporibus aut vero.',
    acumulators: {
        qtEncontrados: function () { return state.raffles.length },
        valorEncontrados: function () { return state.raffles.length * 5 },
        qtSelecionados: function () { return state.selectedRaffles.length },
        valorSelecionados: function () { return state.selectedRaffles.length * 5 },
    },
    updateFields: {
        name: '',
        contact1: '',
        contact2: '',
        contact3: '',
        sold_on: '',
        paid: null,
        has_comprovante: null,
    },
    filterFields: {
        name: '',
        includesOrExactly: 'includes',
        contact1: '',
        contact2: '',
        contact3: '',
        paid: null,
        sold: null,
        sold_on: '',
        has_comprovante: null,
    },
}

function dataToDataTimeLocal(data) {
    // data = data.setHours(data.getHours() - 3)
    let isoDate = (new Date(data)).toISOString()
    let date = isoDate.split('T')[0]
    let time = isoDate.split('T')[1].split('.')[0].slice(0, 5)
    return date + 'T' + time
}

// DOM elements
const errorElement = document.getElementById('erroGenerico')
const errorMessageElement = document.getElementById('erroGenericoTexto')
const successElement = document.getElementById('sucessoGenerico')
const successMessageElement = document.getElementById('sucessoGenericoTexto')
const acumulatorQtEncontradosElement = document.getElementById('qtFound')
const acumulatorValorEncontradosElement = document.getElementById('totalValueFound')
const acumulatorQtSelecionadosElement = document.getElementById('qtSelected')
const acumulatorValorSelecionadosElement = document.getElementById('totalValueSelected')
const raffleTableBodyElement = document.getElementById('tableBody')
const checkAllElement = document.getElementById('checkAll')
//update form elements
const updateNameElement = document.getElementById('updateName')
const updateContact1Element = document.getElementById('updateContact1')
const updateContact2Element = document.getElementById('updateContact2')
const updateContact3Element = document.getElementById('updateContact3')
const updateSoldOnElement = document.getElementById('updateSoldOn')
const updatePaidElement = document.getElementById('updatePaid')
const updateHasComprovanteElement = document.getElementById('updateHasComprovante')
// add event listeners
updateNameElement.addEventListener('change', onChangeForm)
updateContact1Element.addEventListener('change', onChangeForm)
updateContact2Element.addEventListener('change', onChangeForm)
updateContact3Element.addEventListener('change', onChangeForm)
updateSoldOnElement.addEventListener('change', onChangeForm)
updatePaidElement.addEventListener('change', onChangeForm)
updateHasComprovanteElement.addEventListener('change', onChangeForm)
//filter form elements
const filterNameElement = document.getElementById('filterName')
const filterIncludesOrExactlyElement = document.getElementById('filterIncludesOrExactly')
const filterContact1Element = document.getElementById('filterContact1')
const filterContact2Element = document.getElementById('filterContact2')
const filterContact3Element = document.getElementById('filterContact3')
const filterPaidElement = document.getElementById('filterPaid')
const filterSoldElement = document.getElementById('filterSold')
const filterSoldOnElement = document.getElementById('filterSoldOn')
const filterHasComprovanteElement = document.getElementById('filterHasComprovante')
// add event listeners
filterNameElement.addEventListener('change', onChangeFilter)
filterIncludesOrExactlyElement.addEventListener('change', onChangeFilter)
filterContact1Element.addEventListener('change', onChangeFilter)
filterContact2Element.addEventListener('change', onChangeFilter)
filterContact3Element.addEventListener('change', onChangeFilter)
filterPaidElement.addEventListener('change', onChangeFilter)
filterSoldElement.addEventListener('change', onChangeFilter)
filterSoldOnElement.addEventListener('change', onChangeFilter)
filterHasComprovanteElement.addEventListener('change', onChangeFilter)


function setState(newState) {
    // update the state for each key in newState object (if it exists) and call updateDOM
    Object.keys(newState).forEach(key => {
        if (state.hasOwnProperty(key)) {
            state[key] = newState[key]
        }
    })
    updateDOM()
}

function updateDOM() {
    // update the DOM
    renderError();
    renderSuccess();
    renderRaffles();
    renderAcumulators();
    renderUpdateFields();
    renderFilterFields();
}
updateDOM();

function renderError() {
    // render the error message
    if (state.error) {
        errorElement.classList.remove('hide')
        errorMessageElement.innerText = state.errorMessage
    } else {
        errorElement.classList.add('hide')
    }
}

function renderSuccess() {
    // render the success message
    if (state.success) {
        successElement.classList.remove('hide')
        successMessageElement.innerText = state.successMessage
    } else {
        successElement.classList.add('hide')
    }
}

function renderRaffles() {
    checkAllElement.checked = state.selectedAll
    // render the raffles
    raffleTableBodyElement.innerHTML = ''
    state.raffles.forEach(raffle => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>
                <input 
                    type="checkbox" 
                    name="raffle"
                    ${state.selectedRaffles.includes(raffle) ? 'checked' : ''}  
                    onclick="selectRaffle(${raffle.number})"
                >
            </td>
            <td>${raffle.number}</td>
            <td>${raffle.name ? raffle.name : ""}</td>
            <td>${raffle.contact1 ? raffle.contact1 : ""}</td>
            <td>${raffle.contact2 ? raffle.contact2 : ""}</td>
            <td>${raffle.contact3 ? raffle.contact3 : ""}</td>
            <td>${raffle.sold_on ? (new Date(raffle.sold_on)).toLocaleString() : ""}</td>
            <td>${raffle.paid ? 'Sim' : 'Não'}</td>
            <td>${raffle.has_comprovante ? 'Sim' : 'Não'}</td>
        `
        raffleTableBodyElement.appendChild(tr)
    })
}

function renderAcumulators() {
    // render the acumulators
    acumulatorQtEncontradosElement.innerText = state.acumulators.qtEncontrados()
    acumulatorValorEncontradosElement.innerText = "R$ " + state.acumulators.valorEncontrados()
    acumulatorQtSelecionadosElement.innerText = state.acumulators.qtSelecionados()
    acumulatorValorSelecionadosElement.innerText = "R$ " + state.acumulators.valorSelecionados()
}

function renderUpdateFields() {
    // render the update form
    updateNameElement.value = state.updateFields.name
    updateContact1Element.value = state.updateFields.contact1
    updateContact2Element.value = state.updateFields.contact2
    updateContact3Element.value = state.updateFields.contact3
    updateSoldOnElement.value = state.updateFields.sold_on
    updatePaidElement.value = state.updateFields.paid
    updateHasComprovanteElement.value = state.updateFields.has_comprovante
}

function renderFilterFields() {
    // render the filter form
    filterNameElement.value = state.filterFields.name
    filterIncludesOrExactlyElement.value = state.filterFields.includesOrExactly
    filterContact1Element.value = state.filterFields.contact1
    filterContact2Element.value = state.filterFields.contact2
    filterContact3Element.value = state.filterFields.contact3
    filterPaidElement.value = state.filterFields.paid
    filterSoldElement.value = state.filterFields.sold
    filterSoldOnElement.value = state.filterFields.sold_on
    filterHasComprovanteElement.value = state.filterFields.has_comprovante
}

function selectRaffle(number) {
    // select a raffle
    const raffle = state.raffles.find(raffle => raffle.number === number)
    if (raffle) {
        if (state.selectedRaffles.includes(raffle)) {
            setState({ selectedRaffles: state.selectedRaffles.filter(r => r.number !== number), selectedAll: false }) 
        } else {
            let allSelected = state.raffles.length === state.selectedRaffles.length + 1
            setState({ selectedRaffles: [...state.selectedRaffles, raffle], selectedAll: allSelected })
        }
    }
}

function selectAllRaffles() {
    // select all raffles
    if (state.selectedAll) {
        setState({ selectedRaffles: [], selectedAll: false })
    } else {
        setState({ selectedRaffles: [...state.raffles], selectedAll: true })
    }
}

function onCloseError() {
    setState({error: false});
}

function onCloseSuccess() {
    setState({success: false});
}

function onChangeForm(event) {
    const { name, value } = event.target
    setState({ updateFields: { ...state.updateFields, [name]: value } })
}

function onChangeFilter(event) {
    const { name, value } = event.target
    setState({ filterFields: { ...state.filterFields, [name]: value } })
}

function mountQuery() {
    let query = ''
    if (state.filterFields.name) {
        query += `name=${state.filterFields.name}&`
    }
    if (state.filterFields.includesOrExactly) {
        query += `includesOrExactly=${state.filterFields.includesOrExactly}&`
    }
    if (state.filterFields.contact1) {
        query += `contact1=${state.filterFields.contact1}&`
    }
    if (state.filterFields.contact2) {
        query += `contact2=${state.filterFields.contact2}&`
    }
    if (state.filterFields.contact3) {
        query += `contact3=${state.filterFields.contact3}&`
    }
    if (state.filterFields.paid) {
        query += `paid=${state.filterFields.paid}&`
    }
    if (state.filterFields.sold) {
        query += `sold=${state.filterFields.sold}&`
    }
    if (state.filterFields.sold_on) {
        query += `sold_on=${state.filterFields.sold_on}&`
    }
    if (state.filterFields.has_comprovante) {
        query += `has_comprovante=${state.filterFields.has_comprovante}&`
    }
    return query[query.length - 1] === '&' ? '?'+query.slice(0, -1) : query
}

function onSearchRaffles() {
    // TODO - implementar o fetch para buscar os numeros usando o filtro
    console.log(mountQuery())
    fetch(`${API_URL}${mountQuery()}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == 200) {
            setState({ 
                raffles: data.raffles, 
                selectedAll: false,
                selectedRaffles: [],
                success: true, 
                successMessage: data.message 
            })
        } else {
            setState({ 
                raffles: [], 
                selectedAll: false,
                selectedRaffles: [],
                error: true, 
                errorMessage: data.message  
            })
        }
    })
    .catch(error => {
        console.log(error)
        setState({ error: true, errorMessage: error.message })
    })
    // search the raffles using the filter
    // setState({ success: true, successMessage: 'Números encontrados com sucesso!' })
}

onSearchRaffles();

function onCleanFields() {
    setState({
        updateFields: {
            name: '',
            contact1: '',
            contact2: '',
            contact3: '',
            sold_on: '',
            paid: null,
            has_comprovante: null,
        },
        filterFields: {
            name: '',
            includesOrExactly: 'includes',
            contact1: '',
            contact2: '',
            contact3: '',
            paid: null,
            sold: null,
            sold_on: '',
            has_comprovante: null,
        },
        success: true,
        successMessage: 'Campos limpos com sucesso!'
    });
}

function onGerarComprovante() {
    let response = window.confirm("Deseja realmente gerar o comprovante dos números selecionados?")
    if (response) {
        generateReceiptUsingSelected()
    }
}

const baseImage = new Image()
baseImage.src = 'comprovante.jpeg'
baseImage.onload = () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = baseImage.width
    canvas.height = baseImage.height
    ctx.drawImage(baseImage, 0, 0)
}

function generateReceiptUsingSelected() {
    if (state.selectedRaffles.length === 0) {
        setState({ error: true, errorMessage: 'Selecione ao menos um número para gerar o comprovante!' })
        return
    }

    const scale = 1

    const xNameContact1and2 = Math.round(1240 * scale)
    const xNumbersTitle = Math.round(790 * scale)
    const xNumbers = Math.round(xNumbersTitle + 190 * scale)
    const yName = Math.round(253 * scale)
    const yContact1 = Math.round(353 * scale)
    let yNumbers = Math.round(431 * scale)
    const fontSize = Math.round(25 * scale)
    const qtOnLine = 4    
    
        // base image
    const baseImage = new Image()
    baseImage.src = 'comprovante.jpeg'
    const canvas = document.getElementById('canvas')
    const link = document.createElement('a')


    try{
        // TODO - implementar a geração dos comprovantes usando os numeros selecionados
        // create a canvas with the receipt
        const ctx = canvas.getContext('2d')
        canvas.width = baseImage.width
        canvas.height = baseImage.height

        baseImage.onload = () => {
            // group the raffles for create objects with a array of numbers and a value for each of the other fields
            const rafflesGrouped = state.selectedRaffles.reduce((acc, raffle) => {
                const index = acc.findIndex(r => r.name === raffle.name && r.contact1 === raffle.contact1 && r.contact2 === raffle.contact2 && r.contact3 === raffle.contact3 && r.paid === raffle.paid)
                if (index === -1) {
                    acc.push({ name: raffle.name, numbers: [raffle.number], contact1: raffle.contact1, contact2: raffle.contact2, contact3: raffle.contact3, sold_on: raffle.sold_on, paid: raffle.paid })
                } else {
                    acc[index].numbers.push(raffle.number)
                }
                return acc
            }, [])

            // for each rafflesGrouped create a image with the receipt
            rafflesGrouped.forEach((raffle, index) => {
                // draw the base image
                ctx.drawImage(baseImage, 0, 0)
                ctx.fillStyle = 'black';
                ctx.font = `bold ${fontSize}px Times`;
                ctx.fillText(raffle.name, xNameContact1and2, yName);
                ctx.fillText(raffle.contact1, xNameContact1and2, yContact1);

                let numbersText = "Nº comprados:"
                ctx.fillText(numbersText, xNumbersTitle, yNumbers);

                let deslocamento = 0
                if(raffle.numbers.length > qtOnLine){
                    // diminuir o yNumbers para centralizar os numeros
                    const qtLines = Math.ceil(raffle.numbers.length/qtOnLine)
                    deslocamento = (qtLines-1)*Math.round(fontSize*1.2)/2
                    yNumbers -= deslocamento
                }

                numbersText = raffle.numbers.slice(0, qtOnLine).join(', ')
                if(raffle.numbers.length > qtOnLine)
                    numbersText += ","
                ctx.fillText(numbersText, xNumbers, yNumbers);
                
                let cont = 1
                for (let i = qtOnLine; i < raffle.numbers.length; i+=qtOnLine) {
                    numbersText = raffle.numbers.slice(i, i+qtOnLine).join(', ')
                    if(raffle.numbers.length > i+qtOnLine)
                        numbersText += ","
                    ctx.fillText(numbersText, xNumbers, yNumbers + Math.round(fontSize*1.2)*(cont));
                    cont++
                }

                yNumbers += deslocamento

                // save the canvas as a image
                // download the image
                link.download = `comprovante_${raffle.name}.png`
                link.href = canvas.toDataURL('image/png')
                link.click()
            })

            setState({ success: true, successMessage: 'Comprovantes gerados com sucesso!' })

            const confirm = window.confirm("Deseja também marcar os números como com comprovante?")
            if (confirm) {
                // TODO - implementar o fetch para marcar como has_comprovante os numeros selecionados
                // mark as has_comprovante the raffles using the selected raffles
                fetch(`${API_URL}/update`, {
                    method: 'PUT',
                    body: JSON.stringify({ filters: {numbers: state.selectedRaffles.map(r => r.number)}, fieldsToUpdate: {has_comprovante: true} }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.status == 200) {
                        setState({ 
                            success: true, 
                            successMessage: "Comprovantes gerados com sucesso e números marcados como com comprovante!", 
                            selectedRaffles: [], 
                            selectedAll: false,
                            raffles: data.raffles
                        })
                    }else {
                        setState({ 
                            error: true, 
                            errorMessage: data.message,
                            success: true,
                            successMessage: "Comprovantes gerados com sucesso, mas não foi possível marcar os números como com comprovante!",
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    setState({ error: true, errorMessage: error.message })
                })
            }else {
                setState({ 
                    success: true, 
                    successMessage: "Comprovantes gerados com sucesso!", 
                    selectedRaffles: [], 
                    selectedAll: false,
                })
            }
        }
    } catch (error) {
        console.log(error)
        setState({ error: true, errorMessage: error.message })
    }
}

function onMarkAsPaid() {
    // open confirmation modal and if confirmed mark as paid the raffles
    let response = window.confirm("Deseja realmente marcar como pago os números selecionados?")
    if (response) {
        markAsPaidUsingSelected()
    }
}

function markAsPaidUsingSelected() {
    // TODO - implementar o fetch para marcar como pago os numeros selecionados 
    fetch(`${API_URL}/markAsPaid`, {
        method: 'PUT',
        body: JSON.stringify({ filters: {numbers: state.selectedRaffles.map(r => r.number)} }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == 200) {
            const confirm = window.confirm("Deseja também gerar os comprovante dos pagamentos dos números?")
            if (confirm) {
                generateReceiptUsingSelected()
            }else {
                setState({ 
                    success: true, 
                    successMessage: "Números marcados como pago com sucesso!", 
                    selectedRaffles: [], 
                    selectedAll: false,
                    raffles: data.raffles
                })
            }
        }else {
            setState({ 
                error: true, 
                errorMessage: data.message,
            })
        }
    })
    .catch(error => {
        console.log(error)
        setState({ error: true, errorMessage: error.message })
    })
}

function onMarkAsUnpaid() {
    // open confirmation modal and if confirmed mark as unpaid the raffles
    let response = window.confirm("Deseja realmente marcar como não pago os números selecionados?")
    if (response) {
        markAsUnpaidUsingSelected()
    }
}

function markAsUnpaidUsingSelected() {
    // TODO - implementar o fetch para marcar como não pago os numeros selecionados 
    fetch(`${API_URL}/markAsUnpaid`, {
        method: 'PUT',
        body: JSON.stringify({ filters: {numbers: state.selectedRaffles.map(r => r.number)} }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == 200) {
            setState({ 
                success: true, 
                successMessage: "Números marcados como não pago com sucesso!", 
                selectedRaffles: [], 
                selectedAll: false,
                raffles: data.raffles
            })
        }else {
            setState({ 
                error: true, 
                errorMessage: data.message,
            })
        }
    })
    .catch(error => {
        console.log(error)
        setState({ error: true, errorMessage: error.message })
    })
}

function onReleaseReservedForMoreThan48Hours() {
    // open confirmation modal and if confirmed release the raffles
    let response = window.confirm("Deseja realmente liberar os números selecionados?")
    if (response) {
        releaseUsingSelected()
    }
}

function releaseUsingSelected() {
    // TODO - implementar o fetch para liberar os numeros selecionados 
    fetch(`${API_URL}/releaseNotPaidNumbers`, {
        method: 'PUT',
        body: JSON.stringify({ filters: {numbers: state.selectedRaffles.map(r => r.number)} }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == 200) {
            setState({ 
                success: true, 
                successMessage: "Números liberados com sucesso!", 
                selectedRaffles: [], 
                selectedAll: false,
                raffles: data.raffles
            })
        }else {
            setState({ 
                error: true, 
                errorMessage: data.message,
            })
        }
    })
}

function onUpdateRaffles() {
    // open confirmation modal and if confirmed update the raffles
    let response = window.confirm("Deseja realmente atualizar os números selecionados?")
    if (response) {
        updateUsingSelected()
    }
}

function updateUsingSelected() {
    // TODO - implementar o fetch para atualizar os numeros selecionados 
    fetch(`${API_URL}/update`, {
        method: 'PUT',
        body: JSON.stringify({ filters: {numbers: state.selectedRaffles.map(r => r.number)}, fieldsToUpdate: state.updateFields }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == 200) {
            setState({ 
                success: true, 
                successMessage: "Números atualizados com sucesso!", 
                selectedRaffles: [], 
                selectedAll: false,
                raffles: data.raffles
            })
        }else {
            setState({ 
                error: true, 
                errorMessage: data.message,
            })
        }
    })
    .catch(error => {
        setState({ 
            error: true, 
            errorMessage: error.message 
        })
    })
}
