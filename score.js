let btnAddScore = document.getElementById('trigger');
let storedName = document.getElementById('storedName');
let storedScore = document.getElementById('storedScore');
let symbole = document.getElementById('symbole');




//add score to loczal storage
function addScores() {
    // Parse old stored data in localStrage
    var existingScores = JSON.parse(localStorage.getItem("Allscores"));
    if(existingScores == null) existingScores = [];
    var name = document.getElementById("name").value;
    var score = sessionStorage.getItem("Percentage");
    var scoreData = {
        "name": name,
        "score": score
    };
    localStorage.setItem("scoreData", JSON.stringify(scoreData));
    // Save data back to local storage
    existingScores.push(scoreData);
    //sort data before adding it to local storage
    existingScores.sort(function (a, b) {
        return b.score - a.score;
      });
    localStorage.setItem("Allscores", JSON.stringify(existingScores));

   //retreaving the data frpm the local storage
    console.log(localStorage.getItem("Allscores"));
    existingScores = JSON.parse(localStorage.getItem("Allscores"));
    
    for (let index = 0; index < 3; index++) {
        let medal="";
        if (index == 0) {
            medal = `<i style="color:gold" class="fas fa-medal">`;
        }else if(index == 1) {
            medal = `<i style="color:silver" class="fas fa-medal">`;
        }else {
            medal = `<i style="color:orange" class="fas fa-medal">`;
        }

        document.getElementById('topScores').innerHTML += `
        
        <div class="data">
                <span id="storedName">${existingScores[index].name}</span>
                <span id="storedScore">${existingScores[index].score}%</span>
                <span id="symbole">${medal}</i></span>
            </div>
        
        `; 
        
    }
    setTimeout(function(){
        btnAddScore.disabled = true;
         },1000);
};

btnAddScore.addEventListener('click',addScores);