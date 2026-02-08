let cep = document.getElementById('cep');
let button = document.querySelector('#btn');

async function buscaEndereco(cep) {
    const fetchCep = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
    const endereco = await fetchCep.json();
    return endereco;
}

async function buscarClima(lat, lng) {
    const fetchClima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`);
    const clima = await fetchClima.json();
    return clima;
}

button.addEventListener('click', async (e) => {
    e.preventDefault();
    const endereco = await buscaEndereco(cep.value);
    console.log(endereco);
    var lat = endereco.lat;
    var lng = endereco.lng;

    const clima = await buscarClima(lat, lng);
    console.log(clima);
})

