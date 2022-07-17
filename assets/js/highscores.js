let score = document.getElementById('userscore');

const highscores = [{
    Rank: '1',
    Name: '',
    Score: '1,000'
},
{
    Rank: '2',
    Name: '',
    Score: ''
},
{
    Rank: '3',
    Name: '',
    Score: ''
},
{
    Rank: '4',
    Name: '',
    Score: ''
},
{
    Rank: '5',
    Name: '',
    Score: ''
},
{
    Rank: '6',
    Name: '',
    Score: ''
},
{
    Rank: '7',
    Name: '',
    Score: ''
},
{
    Rank: '8',
    Name: '',
    Score: ''
},
{
    Rank: '9',
    Name: '',
    Score: ''
},
{
    Rank: '10',
    Name: '',
    Score: ''
},
]

function displayHighscore(Score) {
    ScoreContainer.innerText = '';
    let showHighscore = document.createElement('p');
    showHighscore.innerText = Score.score;
    ScoreContainer.append(showHighscore);
}
if score > highscore {
    highscores.append(score)
    window.location.href = "highscores.html"
} else {
    window.location.href = "highscores.html"
}

