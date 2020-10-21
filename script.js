const api_key = `rrfuJvLqg5dRzG0Avc001rouEylFxykPQ8f3Xbwy`;

const searchURL = `https://developer.nps.gov/api/v1/parks?api_key=${api_key}`;

let searchTerm = "";
let stateCode = "";
let states_list = "";
let maxResults = 0;

function formatResults(responseJson){
    console.log(responseJson);
    let html_to_display = '';
    $('#results-list').empty();
    if (responseJson.data.length != 0){
        for (let i = 0;i <responseJson.data.length;i++){
            let addresses = responseJson.data[i].addresses
            let physicalAddress ="";
            let mailingAddress = "";
            for (j = 0; j < addresses.length; j++){
                let address = `${addresses[j].line1}\n${addresses[j].line2}\n${addresses[j].line3}<br><br>${addresses[j].city} ${addresses[j].stateCode} ${addresses[j].postalCode}`;
                if (addresses[j].type == "Physical"){
                    physicalAddress = address;
                }else{
                    mailingAddress = address;
                }
            }
    
            html_to_display += `<li><h3>${responseJson.data[i].fullName}</h3><p>${responseJson.data[i].description}</p><a href = "${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a><br></br><h4>See it in person</h4><p>${physicalAddress}</p><h4>Send them a letter</h4><p>${mailingAddress}</p></li>`
        }
    }else{
        html_to_display += `<li>There are no parks named <strong>${searchTerm}</strong> in <strong>${stateCode}</strong></li>`
    } 
    $('#results-list').append(html_to_display);
    $('#results').removeClass('hidden');
  }

function getPark(stateCode,limit){
    const url = `${searchURL}&stateCode=${stateCode}&limit=${limit}&start=0`;
    console.log(url);
    fetch(url)
    .then(response => {
        if (response.ok) {
        return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => formatResults(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}   


// function getParks(states_list){
//     $('#results-list').empty();
//     for (let i = 0; i <states_list.length; i++){
//         stateCode = states_list[i];
//         console.log(stateCode)
//         getPark(stateCode, maxResults);
//     }
//     $('#results').removeClass('hidden');
// }

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const states = $('#list-of-states').val();
      states_list = (states.trim().split(','))
      maxResults = $('#number-of-results').val();
      getPark(states_list,maxResults);
    });
}


  $(watchForm);