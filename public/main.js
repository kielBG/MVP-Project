$(document).ready( () => { 

let songBank;
const body = $('body');
const joinBtn = $(`#sign_up`);
const loginBtn = $(`#login`);
const navContainer = $(`#navContainer`);




joinBtn.on("click", () => {
    recommendForm.hide();
    editForm.hide();
    deleteForm.hide()
    songsPage.hide();
    const joinForm = $(`<div id = "register" class = "form"></div>`);
    joinForm.html(`
    <label for="incog">Create username:</label><br>
    <input type="text" id="incog" name="username"><br>
    <label for="secret">Create password:</label><br>
    <input type="text" id="secret" name="pasword">
    <button id="register_btn">Submit</button>
    `);
    body.append(joinForm);

    const registerBtn = $(`#register_btn`);
    registerBtn.on("click", () => {
    let newUser = {
        username: $(`#incog`).val(),
        password: $(`#secret`).val()
    };
    const url = 'https://eclectunes.onrender.com/api/users/register';
    // const url = 'http://localhost:8000/api/users/register';

    try{
        $.ajax( {
            url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newUser)
        })
        .done((data) => {
            console.log('User created:', data);
            console.log(data);
            localStorage.setItem('userId', data.id);
            console.log(localStorage.getItem('userId'));
            window.alert("Welcome to EclecTunes!");

            navContainer.append($(`<p id="welcome">Weclome ${newUser.username}!</p>`));
            
            
        });
        } catch (error) {
            console.error('Error creating account', error);
            console.error('Failed to create account');
        }
        joinForm.empty();
        joinBtn.hide();
        loginBtn.hide();
        joinForm.hide();
        logoutBtn.show();
    });
    
});

loginBtn.on("click", () => {
    recommendForm.hide();
    editForm.hide();
    deleteForm.hide()
    songsPage.hide();
    const loginForm = $(`<div id = "login" class = "form"></div>`);
    loginForm.html(`
    <label for="hello_hi">Username:</label><br>
    <input type="text" id="hello_hi" name="username"><br>
    <label for="no_sneak">Password:</label><br>
    <input type="text" id="no_sneak" name="pasword">
    <button id="signin_btn">Submit</button>
    `);
    body.append(loginForm);

    const signinBtn = $(`#signin_btn`);
    signinBtn.on("click", () => {
    let user = {
        username: $(`#hello_hi`).val(),
        password: $(`#no_sneak`).val()
    };
    const url = 'https://eclectunes.onrender.com/api/users/login';
    // const url = 'http://localhost:8000/api/users/login';

    try{
        $.ajax( {
            url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user)
        })
        .done((data) => {
            console.log('User logged in:', data);
            localStorage.setItem('userId', data.user.id);
            console.log(localStorage.getItem('userId'));
            window.alert("Welcome back to EclecTunes!");

            navContainer.append($(`<p id="welcome">Weclome back ${user.username}!</p>`));
            
            
        });
        } catch (error) {
            console.error('Error signing in', error);
            console.error('Failed to login');
        }
        loginForm.empty();
        joinBtn.hide();
        loginBtn.hide();
        loginForm.hide();
        logoutBtn.show()
    });

});

const fillLatest = (arr) => {
    const newSongs = $(`#newSongs`);
    for (let i = arr.length - 1; i > arr.length - 4; i--) {
        const listItem = $(`<li class='newSong'> ${arr[i].song_title} - ${arr[i].band_name}</li>`);
        newSongs.append(listItem);

    }
};


const loadSongBank = () => {
    const url = 'https://eclectunes.onrender.com/api/songs';
    // const url = 'http://localhost:8000/api/songs';
    try {
        $.ajax({
            url,
            type: 'GET',
            success: (data) => {
                songBank = data;
                console.log(songBank);
                fillLatest(songBank);
            }
        });
    } catch (error) {
        console.error('Error getting songs', error);
        console.error('Failed to get songs');
    }
    
};
loadSongBank();


const songsBtn = $(`#songs`);
const recommendForm = $(`<div id="recommend_form" class = "page" ></div>`);
const songsPage = $(`<div id="songs_page" class = "page" ></div>`);
body.append(songsPage);
songsPage.hide();

let pageLoadCount = 0

songsBtn.on("click", () => {
    recommendForm.hide();
    editForm.hide();
    deleteForm.hide()
    songsPage.show();
    const card = $('<div class = "pageCard"></div>');
    if (pageLoadCount < 1) {
        card.append(`<p>Check out what others liked!</p>`);
        songBank.forEach( (song, index) => {
            card.append(`<li class='song'> <b>song title:</b> ${song.song_title} <b>band name:</b> ${song.band_name} <b>genre:</b> ${song.genre} <b>favorite song lyric:</b> ${song.song_quote} <b>Why it was reccomended:</b> ${song.recommend_why}</li>`)
        }); 
        pageLoadCount++
        songsPage.append(card);
    }
});

const reccCard = $('<div class = "pageCard"></div>');
reccCard.html(`
<h2>Recommend a song!</h2>
<label for="song_title">What's the song title?</label><br><br>
<input type = "text" id = "song_title" placeholder = "Song title" size="50"><br><br>
<label for="band_name">What band is it by?</label><br><br>
<input type = "text" id = "band_name" placeholder = "Band name" size="50"><br><br>
<label for="genre">What genre is the song?</label><br><br>
<input type = "text" id = "genre" placeholder = "Genre" size="50"><br><br>
<label for="song_quote">What lyric is your favorite?</label><br><br>
<input type = "text" id = "song_quote" placeholder = "We love that one as well" size="100"><br><br>
<label for="recommend_why">Why do you like this song?</label><br><br>
<input type = "text" id = "recommend_why" placeholder = "Tell us about it!" size="100"><br><br>
`);
recommendForm.append(reccCard)
const sendBtn = $(`<button id = "send">Share your recommendation!</button>`);
sendBtn.on("click", () => {
    sendRecommend();
});
const recommendBtn = $(`#recommend`);
reccCard.append(sendBtn);
body.append(recommendForm);
recommendForm.hide();

recommendBtn.on("click", () => {
    editForm.hide();
    deleteForm.hide()
    songsPage.hide();
    recommendForm.show();
});



function sendRecommend() {
    
    const url = 'https://eclectunes.onrender.com/api/songs';
    // const url = 'http://localhost:8000/api/songs'; 

    const newSong = {
        song_id: songBank[songBank.length - 1].id++,
        song_title: $(`#song_title`).val(),
        band_name: $(`#band_name`).val(),
        genre: $(`#genre`).val(),
        song_qoute: $(`#song_quote`).val(),
        recommend_why: $(`#recommend_why`).val(),
        user_id: localStorage.getItem('userId')
    };
    console.log(newSong);
    
    try{
        $.ajax({
            url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newSong)
        })
            .done( (data) => {
                console.log('Song posted:', data);
                reccCard.append(`<p>Thanks for your recommendation!</p>`);
                songBank.push(data);
            })
        
    } catch (error) {
        console.error('Error posting song:', error);
        console.error('Failed to post song:', newSong);
        reccCard.append(`<p>Failed to post recommendation! Did you put in the right fields?</p>`); 
    }
};

//put request
const updateBtn = $(`#update`);

const editForm = $(`<div id= "edit_form" class = "page"></div>`);

body.append(editForm);

editForm.hide();

updateBtn.on("click", () => {
    recommendForm.hide();
    deleteForm.hide()
    songsPage.hide();
    editForm.empty();
    editForm.show();
    const card = $('<div class = "pageCard"></div>');
    editForm.append(card);
    card.html(`
        <h2>Which song?</h2>
    `);
    card.append(`<select name="songs" id="song_select"></select>`);
    const song_select = $(`#song_select`);
    songBank.forEach( (song, index) => {
        let newOption = $(`<option value = "${index}">${song.song_title}</option>`);
        song_select.append(newOption);
    });

    song_select.on("change", (e) => {
        let targetIndex = e.target.value;
        console.log(e.target.value);
        const {id, song_title, band_name, genre, song_quote} = songBank[targetIndex];
        card.html(`
        <h2>Where do you see a mistake?</h2>
        <label for="song_title">The song title?</label><br><br>
        <input type = "text" id = "song_title_edit" placeholder = "${song_title}" size="50"><br><br>
        <label for="band_name">The band name?</label><br><br>
        <input type = "text" id = "band_name_edit" placeholder = "${band_name}" size="50"><br><br>
        <label for="genre">The genre not right?</label><br><br>
        <input type = "text" id = "genre_edit" placeholder = "${genre}" size="50"><br><br>
        <label for="song_quote">Was the lyric misquoted?</label><br><br>
        <input type = "text" id = "song_quote_edit" placeholder = "${song_quote}" size="100"><br><br>
        <button id = "send_edits">Update</button>
        `);
        const editsButton = $(`#send_edits`);
        const putSong = songBank[targetIndex]
        editsButton.on("click", () => {
            putSong.song_title = $(`#song_title_edit`).val();
            putSong.band_name = $(`#band_name_edit`).val();
            putSong.genre = $(`#genre_edit`).val();
            putSong.song_quote = $(`#song_quote_edit`).val();
    
            console.log(putSong);
    
            const url = `https://eclectunes.onrender.com/api/songs/${id}`;
            // const url = `http://localhost:8000/api/songs/${id}`;
    
            try{
                $.ajax({
                    url,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(putSong)
                })
                    .done( (data) => {
                        console.log('Song editted:', data);
                        window.alert(`Thanks for your Edits`);
                        editForm.empty();
                        editForm.hide();
                    })
            } catch (error) {
                console.error('Error editing song:', error);
                console.error('Failed to edit song:', newSong);
                card.append(`<p>Failed to submit edits! Did you put in the right fields?</p>`);
            }
        });
    });
});



//Delete One
const deleteBtn = $(`#delete`);
const deleteForm = $(`<div id= "delete_form" class = "page"></div>`);

body.append(deleteForm);
deleteForm.hide();

deleteBtn.on("click", () => {
    recommendForm.hide();
    editForm.hide();
    songsPage.hide();
    deleteForm.empty();
    deleteForm.show();
    const card = $('<div class = "pageCard"></div>');
    deleteForm.append(card);
    card.html(`
        <h2>Which song?</h2>
    `);
    const removeOptions = $(`<select name="songs" id="song_select_delete"></select>`);
    songBank.forEach( (song, index) => {
        let newOption = $(`<option value = "${index}">${song.song_title}</option>`);
        removeOptions.append(newOption);
    });
    card.append(removeOptions);
    removeOptions.on("change", (e) => {
        let targetIndex = e.target.value;
        const {id, song_title, band_name} = songBank[targetIndex];
        const removalSong = songBank[targetIndex]
        card.html(`
        <h2>Are you sure you want to remove this song?</h2>
        <p>${song_title} by ${band_name}</p>
        <button id = "send_delete">DELETE</button>
        `);
        const removalButton = $(`#send_delete`);
        removalButton.on("click", () => {
            if (localStorage.getItem('userId') == removalSong.user_id || localStorage.getItem('userId') == 1) {
            let finalRemove = window.confirm("If you wish to delete please confirm.")
            if (finalRemove === true) {
                songBank.splice(targetIndex, 1)
                console.log(songBank);
                const url = `https://eclectunes.onrender.com/api/songs/${id}`;
                // const url = `http://localhost:8000/api/songs/${id}`;
    
                try{
                    $.ajax({
                        url,
                        type: 'DELETE',
                    })
                        .done( (data) => {
                            console.log('Song deleted:', data);
                            window.alert(`Song removed`);
                            deleteForm.empty();
                            deleteForm.hide();
                        })
                } catch (error) {
                    console.error('Error deleting song:', error);
                    console.error('Failed to delete song:', newSong);
                    recommendForm.append(`<p>Failed to delete song! uh oh</p>`);
                }
            }
        }else {
            console.error("You can't delete songs you didn't submit!");
            window.alert("You can't delete songs you didn't submit!");
        }
        });
    });
});

const logo = $(`#logo`)
logo.on("click", () => {
    recommendForm.hide();
    editForm.hide();
    songsPage.hide();
    deleteForm.hide();
});

const logoutBtn = $(`#logout`);
logoutBtn.hide();

logoutBtn.on("click", () => {
    console.log('working')
    $(`#welcome`).remove();
    localStorage.removeItem('userId');
    logoutBtn.hide();
    loginBtn.show();
    joinBtn.show();
    
});

});