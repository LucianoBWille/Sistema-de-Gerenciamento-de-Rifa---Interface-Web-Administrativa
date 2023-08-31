const API_URL = 'https://rifa-rafaela-adm-api.vercel.app/';
// const API_URL = 'http://localhost:3000'

function onSearchWinner() {
    const input = document.getElementById('winner').value
    const url = `${API_URL}/getName?number=${input}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.status == 200){
                if(data.name == null || data.name == undefined || data.name == ''){
                    alert("O número sorteado não foi vendido")
                }else{
                    const winner = document.getElementById('winnerName')
                    winner.innerHTML = data.name
                }
            }else{
                alert(data.message)
            }
            console.log(data)
        })
}