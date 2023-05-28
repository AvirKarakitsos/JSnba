const requete = document.getElementById('requete');
let result = document.getElementById('resultat');

let players;
let searchPlayer='';

const fetchPlayer = async() => {
    try {
        searchPlayer = requete.value;
        players = await fetch('https://www.balldontlie.io/api/v1/players?search='+searchPlayer)
        players = await players.json()

        players.data.map(val => {
            let teamAbv;
            val.team.abbreviation === "UTA" ? teamAbv = "utah" : teamAbv = val.team.abbreviation.toLowerCase()

            result.innerHTML += `<article class="block">
                                    <div class="block-player">
                                        <ul class="no-type">
                                            <li>Prenom: ${val.first_name}</li>
                                            <li>Nom: ${val.last_name}</li>
                                            <li>Position: ${val.position}</li>
                                            <li>Team: ${val.team.full_name}</li>
                                        </ul>
                                        <img class="image" src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${teamAbv}.png&h=200&w=200">
                                        <button onclick="playerStat(${val.id})">Statistiques du joueur</button>
                                    </div>
                                    <div class="block-stat stat${val.id}"></div>
                                </article>`;
        })                 
    } catch(err) {
        console.log('Error: '+err);
    }                             
}


function playerStat(id){
    let select = document.querySelector(`.stat${id}`);

    select.innerHTML =  '<label for="season'+id+'">Saison</label>'
                            +'<select name="season" id="season'+id+'">'
                                +'<option value="2018" >2018-2019</option>'
                                +'<option value="2019" >2019-2020</option>'
                                +'<option value="2020" >2020-2021</option>'
                                +'<option value="2021" >2021-2022</option>'
                                +'<option value="2022" selected="selected" >Saison en cours</option>'
                            +'</select>'
                           
                            +'<select name="postseason" id="postseason'+id+'">'
                                +'<option value="reguliere" selected="selected">reguliere</option>'
                                +'<option value="playoff">playoff</option>'
                            +'</select>'
                            +'<button onclick="displayStat('+id+')">Valider</button>'
                        +'<div id="display-stat'+id+'" class="display-stat"></div>';
}

function displayStat(id){
    let display = document.getElementById(`display-stat${id}`);

    let season = document.getElementById(`season${id}`);
    let postseason = document.getElementById(`postseason${id}`);

    let valueSeason = season.value;
    let valuePostseaon = [postseason.value === 'playoff' ? true : false];

    if(valuePostseaon == 'true'){
        let averagePts = 0;
        let averageAst = 0;
        let averageReb = 0;
        let total = 0;

        fetch('https://www.balldontlie.io/api/v1/stats?seasons[]='+valueSeason+'&player_ids[]='+id+'&postseason='+valuePostseaon+'&per_page=100')
        .then(response => response.json())
        .then(base => {
            let somme_pts = 0;
            let somme_ast = 0;
            let somme_reb = 0;

            for (let val of base.data){
                somme_pts = somme_pts + val.pts;
                somme_ast = somme_ast + val.ast;
                somme_reb = somme_reb + val.reb;
            }
            averagePts = Math.round((somme_pts/base.data.length)*10)/10;
            averageAst = Math.round((somme_ast/base.data.length)*10)/10;
            averageReb = Math.round((somme_reb/base.data.length)*10)/10;
            total = base.data.length;

            display.innerHTML = `<ul class="no-type">
                                    <li>Matchs</li>
                                    <li>${total}</li>
                                </ul>
                                <ul class="no-type">
                                    <li>Points</li>
                                    <li>${averagePts}</li>
                                </ul>
                                <ul class="no-type">
                                    <li>Passes</li>
                                    <li>${averageAst}</li>
                                </ul>
                                <ul class="no-type">
                                    <li>Rebounds</li>
                                    <li>${averageReb}</li>
                                </ul>`;
        })
        .catch(err=>console.log('Error: '+err))

    } else if (valuePostseaon == 'false'){
        fetch('https://www.balldontlie.io/api/v1/season_averages?season='+valueSeason+'&player_ids[]='+id)
            .then(response => response.json())
            .then(base => {
                base.data.map(base => {
                    display.innerHTML = `<ul class="no-type">
                                            <li>Matchs</li>
                                            <li>${base.games_played}</li>
                                        </ul>
                                        <ul class="no-type">
                                            <li>Points</li>
                                            <li>${Math.round(base.pts*10)/10}</li>
                                        </ul>
                                        <ul class="no-type">
                                            <li>Passes</li>
                                            <li>${Math.round(base.ast*10)/10}</li>
                                        </ul>
                                        <ul class="no-type">
                                            <li>Rebounds</li>
                                            <li>${Math.round(base.reb*10)/10}</li>
                                        </ul>`;
                })
            })
            .catch(err=>console.log('Error: '+err))      
    }
}

requete.addEventListener('keyup',() => {
    if(requete.value.length>2){
        result.innerHTML = ""
        fetchPlayer();
    } else {
        result.innerHTML = ""
    }
});

