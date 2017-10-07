/*Tamara Howell - 200316347 - COMP2112 A1
This assignment is a bit of a mess - I really could not have done it without following the tutorials for every step. Most of my comments are for my own benefit, sorry if it's cluttered!
*/


//Variable to track last clicked game - default 0 to select first game
let selectedGame = 0;
let inboxLink = document.getElementById('inbox');
let trashLink = document.getElementById('trash');
let composeLink = document.getElementById('compose');

//Compose button
composeLink.addEventListener('click', function(e) {
    e.preventDefault();
    composeForm();
});

//compose form
function composeForm() {
    let thisForm = `
    <form class="pure-form pure-form-aligned" id="newGame">
    <fieldset>
        <div class="pure-control-group">
            <label for="publisher">Publisher</label>
            <input id="publisher" type="text" placeholder="Publisher">
            <span class="pure-form-message-inline">This is a required field.</span>
        </div>

        <div class="pure-control-group">
            <label for="avatar">Avatar</label>
            <input id="avatar" type="text" placeholder="Avatar">
        </div>

        <div class="pure-control-group">
            <label for="subject">Subject</label>
            <input id="subject" type="text" placeholder="Subject">
        </div>

        <div class="pure-control-group">
            <label for="body">Message</label>
            <input id="body" type="text" placeholder="Enter something here...">
        </div>

        <div class="pure-control-group">
            <label for="date" class="pure-control-group">Date</label>
                <input id="date" type="text" placeholder="Release Year">
            
        </div>
        <div class="pure-control-group">
            <label for="ifrmSrc">Source</label>
            <input id="ifrmSrc" type="text" placeholder="Information Source">
        </div>
        <div>
            <button type="submit" class="pure-button pure-button-primary">Submit</button>
        </div>
    </fieldset>
</form>`;

let main = document.getElementById('main');
main.innerHTML = thisForm;

//Form button function
let send = document.getElementById('newGame');
send.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let newGameObj = {
        publisher : document.forms.newGame.publisher.value,
        avatar : document.forms.newGame.avatar.value,
        subject : document.forms.newGame.subject.value,
        body : document.forms.newGame.body.value,
        date : document.forms.newGame.date.value,
        ifrmSrc : document.forms.newGame.ifrmSrc.value
    }
    //Unshift puts new game at the top with index of 0
    games.unshift(newGameObj);
    //Call local storage function
    setLocalStorage();
    //Update view

    inboxLink.click();

    });
}
//Function to output game data in an HTML snippet
function render(games) {
    let gameColumnSnippet = `
        ${games.map( (game, index ) => `
            <div class="email-item pure-g" data-id="${index}">
                <div class="pure-u">
                    <img width="64" height="64" alt="Tilo Mitra&#x27;s avatar" class="email-avatar" src="${game.avatar}">
                </div>

                <div class="pure-u-3-4">
                    <h5 class="email-name">${game.publisher}</h5>
                    <h4 class="email-subject">${game.subject}</h4>
                    <p class="email-desc">
                    <!-- if game body is longer than 100 chars shorten it to 100 chars -->
                        ${game.body.length > 100 ? `${game.body.substr(0, 99)}...` : game.body }
                    </p>
                </div>
            </div>`).join('')}
    
        `;
//console.log('App started');
//Get HTML reference
let emailColumn = document.getElementById('list');
//Change the inner HTML of that reference to the games snippet
emailColumn.innerHTML = gameColumnSnippet;


initialize(games);
}
function initialize(games) {
    //Spread operator words same as Array.from
    let gamesList = [...(document.querySelectorAll('[data-id]'))];
    gamesList.map( (game, index) => game.addEventListener('click', function(e) {
    //Remove class
    gamesList[selectedGame].classList.remove('email-item-selected');
    //Here, "this" refers to the game being clicked
    //console.log(this.dataset.id);

    //Adding back the class to highlight selected game
    game.classList.add('email-item-selected');
    selectedGame = index;
    showGameBody(index, games);
}));

    //if games exist then select first by default
    if (games.length > 0) {
        gamesList[selectedGame].classList.add('email-item-selected');
        showGameBody(selectedGame, games);
    }
    //In case there are no games, output message
    else {
        let main = document.getElementById('main');
        main.innerHTML = '<h1>No games</h1>';
    }
}
//Function to output body text
function showGameBody(idx, games) {
    let displayGameBody = `
    <div class="email-content">
    <div class="email-content-header pure-g">
        <div class="pure-u-1-2">
            <h1 class="email-content-title">${games[idx].subject}</h1>
            <p class="email-content-subtitle">
                From <a>${games[idx].publisher}</a> at <span>${games[idx].date}</span>
            </p>
            
        </div>

        <div class="email-content-controls pure-u-1-2">
            <button class="secondary-button pure-button ${games[idx].deleted == true ? 'delBtn' : ''}" id="delete" data-id="${idx}">${games[idx].deleted == true ? 'Deleted' : 'Delete'}</button>
            <button class="secondary-button pure-button">Forward</button>
            <button class="secondary-button pure-button">Move to</button>
        </div>
    </div>
    <div class="email-content-body">
        <p>
        ${games[idx].body}
        </p>
        <p><a href="${games[idx].ifrmSrc}">More Information About <strong> ${games[idx].subject} </strong> Here<a></p>
    </div>
</div>
    `;
    let main = document.getElementById('main');
    main.innerHTML = displayGameBody;

    //Create delete button
    let deleteButton = document.getElementById('delete');
    deleteButton.addEventListener('click', () => deleteGame(deleteButton.dataset.id, games));
}
function deleteGame(index, games) {
        //
        if (!games[index].deleted == true) {
        //add deleted:true to selected email
        games[index].deleted = true;
        //Set local storage item
        setLocalStorage();
        //update inbox
        let inbox = games.filter( game => !game.deleted)
        selectedGame = 0;
        render(inbox);
        } else {
        //if email has been deleted, remove deleted class
        delete games[index].deleted;
        let filtered = games.filter( game => game.deleted == true);
        //reset index
        selectedGame = 0;
        //Create new render function for filtered array
        render(filtered);
        }
    }
//Local storage function
function setLocalStorage() {
    localStorage.setItem('items', JSON.stringify(games));
}
//Filter emails for deleted when clicking the trash category
trashLink.addEventListener('click', function(e) {
    e.preventDefault();
    let filtered = games.filter( game => game.deleted == true);
    //reset index
    selectedGame = 0;
    //Create new render function for filtered array
    render(filtered);
});
//Inbox
inboxLink.addEventListener('click', function(e) {
    let inbox = games.filter( game => !game.deleted);
    render(inbox);
});
//Use local storage to get stored items
if (localStorage.getItem('items')) {
    games = JSON.parse(localStorage.getItem('items'));
    let filtered = games.filter( game => !game.deleted);

    render(filtered);
} else {

render(games);
}