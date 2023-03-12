let requete = document.getElementById('requete');
let result = document.getElementById('resultat');

let player;
let searchPlayer='';

const fetchPlayer = async() =>{
    searchPlayer = requete.value;
    player = await fetch('https://www.balldontlie.io/api/v1/players?search='+searchPlayer).then(res => res.json())
    result.innerHTML = player.data.map(val => ('<div class = "block">'
                                                    +'<div class = "block_player">'
                                                        +'<ul>'
                                                            +'<li>Prenom: '+val.first_name+'</li>'
                                                            +'<li>Nom: '+val.last_name+'</li>'
                                                            +'<li>Position: '+val.position+'</li>'
                                                            +'<li>Team: '+val.team.full_name+'</li>'
                                                        +'</ul>'
                                                        +'<div class="image">'
                                                            +'<img src="https://fr.global.nba.com/media/img/teams/00/logos/'+val.team.abbreviation+'_logo.svg">'
                                                        +'</div>'
                                                        +'<button onclick="f_stat('+val.id+')">Statistiques du joueur</button>'
                                                    +'</div>'
                                                    +'<div class="stat stat'+val.id+'"></div>'
                                                +'</div><br/>')
                                        );
}

function f_stat(id){
    let select_div = document.querySelector(`.stat${id}`)
    select_div.innerHTML =  '<label for="saison">Saison</label>'
                            +'<select name="saison" id="saison'+id+'">'
                                +'<option value="2018" >2018-2019</option>'
                                +'<option value="2019" >2019-2020</option>'
                                +'<option value="2020" >2020-2021</option>'
                                +'<option value="2021" >2021-2022</option>'
                                +'<option value="2022" >Saison en cours</option>'
                            +'</select>'
                           
                            +'<select name="postseason" id="postseason'+id+'">'
                                +'<option value="reguliere" selected="selected">reguliere</option>'
                                +'<option value="playoff">playoff</option>'
                            +'</select>'
                            +'<button onclick="affiche_stat('+id+')">Valider</button>'
                        +'<div id="affiche_stat'+id+'" class="affiche_stat"></div>'
}

async function affiche_stat(id){
    let select_affiche_stat = document.getElementById(`affiche_stat${id}`)

    let select_saison = document.getElementById(`saison${id}`)
    let select_postseason = document.getElementById(`postseason${id}`)

    let val_saison = select_saison.value
    let val_postseason = [select_postseason.value === 'playoff' ? true : false]

    if(val_postseason == 'true'){
        let moyenne_pts = 0
        let moyenne_ast = 0
        let moyenne_reb = 0
        let total = 0

        await fetch('https://www.balldontlie.io/api/v1/stats?seasons[]='+val_saison+'&player_ids[]='+id+'&postseason='+val_postseason+'&per_page=100')
        .then(response=>response.json())
        .then(base=>{
            let somme_pts = 0
            let somme_ast = 0
            let somme_reb = 0

            for (let val of base.data){
                somme_pts = somme_pts + val.pts
                somme_ast = somme_ast + val.ast
                somme_reb = somme_reb + val.reb
            }
            moyenne_pts = Math.round((somme_pts/base.data.length)*10)/10
            moyenne_ast = Math.round((somme_ast/base.data.length)*10)/10
            moyenne_reb = Math.round((somme_reb/base.data.length)*10)/10
            total = base.data.length

            select_affiche_stat.innerHTML = "<ul>"
                                                +"<li>Matchs</li>"
                                                +"<li>"+total+"</li>"
                                            +"</ul>"
                                            +"<ul>"
                                                +"<li>Points</li>"
                                                +"<li>"+moyenne_pts+"</li>"
                                            +"</ul>"
                                            +"<ul>"
                                                +"<li>Passes</li>"
                                                +"<li>"+moyenne_ast+"</li>"
                                            +"</ul>"
                                            +"<ul>"
                                                +"<li>Rebounds</li>"
                                                +"<li>"+moyenne_reb+"</li>"
                                            +"</ul>"
        })
        .catch(err=>console.log('Error: '+err))

    }else if (val_postseason == 'false'){
            let stat = await fetch('https://www.balldontlie.io/api/v1/season_averages?season='+val_saison+'&player_ids[]='+id)
            .then(response=>response.json())
            .catch(err=>console.log('Error: '+err))
            
            stat.data.map(base=>{
                select_affiche_stat.innerHTML = "<ul>"
                                                    +"<li>Matchs</li>"
                                                    +"<li>"+base.games_played+"</li>"
                                                +"</ul>"
                                                +"<ul>"
                                                    +"<li>Points</li>"
                                                +"<li>"+Math.round(base.pts*10)/10+"</li>"
                                                +"</ul>"
                                                +"<ul>"
                                                    +"<li>Passes</li>"
                                                    +"<li>"+Math.round(base.ast*10)/10+"</li>"
                                                +"</ul>"
                                                +"<ul>"
                                                    +"<li>Rebounds</li>"
                                                    +"<li>"+Math.round(base.reb*10)/10+"</li>"
                                                +"</ul>"
            })
    }
}

requete.addEventListener('input',()=>{
    if(requete.value.length>2){
        fetchPlayer();
    }
});

