$(document).ready( () => { 

let songBank;
const body = $('body');
const joinBtn = $(`#sign_up`);

joinBtn.on("click", () => {

    let newUsername = window.prompt("Please create Username"); 
    let newPassword = window.prompt("Please create password");

    let newUser = {
        username: newUsername,
        password: newPassword
    };

    // const url = 'https://eclectunes.onrender.com/api/users';
    const url = 'http://localhost:8000/api/users';
    if (newUser) {
    try{
        $.ajax( {
            url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newUser)
        })
        .done((data) => {
            console.log('User created:', data);
            window.alert("You created an account");
        });
    } catch (error) {
        console.error('Error creating account', error);
        console.error('Failed to create account');
    }
}

});

const loadSongBank = () => {
    // const url = 'https://eclectunes.onrender.com/api/songs';
    const url = 'http://localhost:8000/api/songs';
    try {
        $.ajax({
            url,
            type: 'GET',
            success: (data) => {
                songBank = data;
                console.log(songBank);
            }
        });
    } catch (error) {
        console.error('Error getting songs', error);
        console.error('Failed to get songs');
    }
};
loadSongBank();


const songsBtn = $(`#songs`);
const recommendForm = $(`<div id=recommend_form></div>`);
const songsPage = $(`<div id=songs_page></div>`);
body.append(songsPage);
songsPage.hide();

let pageLoadCount = 0

songsBtn.on("click", () => {
    editForm.hide();
    recommendForm.hide();
    deleteForm.hide();
    songsPage.show();
    if (pageLoadCount < 1) {
        songsPage.append(`<p>Check out what others liked!</p>`);
        songBank.forEach( (song, index) => {
            songsPage.append(`<li class='song'> <b>song title:</b> ${song.song_title} <b>band name:</b> ${song.band_name} <b>genre:</b> ${song.genre} <b>favorite song lyric:</b> ${song.song_quote} <b>Why it was reccomended:</b> ${song.recommend_why}</li>`)
        }); 
        pageLoadCount++
    }
});

recommendForm.html(`
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
const sendBtn = $(`<button id = "send">Share your recommendation!</button>`);
sendBtn.on("click", () => {
    sendRecommend();
});
const recommendBtn = $(`#recommend`);
recommendForm.append(sendBtn);
body.append(recommendForm);
recommendForm.hide();

recommendBtn.on("click", () => {
    editForm.hide();
    songsPage.hide();
    deleteForm.hide();
    recommendForm.show();
});



function sendRecommend() {
    
    // const url = 'https://eclectunes.onrender.com/api/songs';
    const url = 'http://localhost:8000/api/songs'; 

    const newSong = {
        song_id: songBank[songBank.length - 1].id++,
        song_title: $(`#song_title`).val(),
        band_name: $(`#band_name`).val(),
        genre: $(`#genre`).val(),
        song_qoute: $(`#song_quote`).val(),
        recommend_why: $(`#recommend_why`).val(),
        user_id: 1
    };
    console.log(newSong);
    songBank.push(newSong);
    try{
        $.ajax({
            url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newSong)
        })
            .done( (data) => {
                console.log('Song posted:', data);
                recommendForm.append(`<p>Thanks for your recommendation!</p>`);
            })
        
    } catch (error) {
        console.error('Error posting song:', error);
        console.error('Failed to post song:', newSong);
        recommendForm.append(`<p>Failed to post recommendation! Did you put in the right fields?</p>`); 
    }
};

//put request
const updateBtn = $(`#update`);
const editForm = $(`<div id=edit_form></div>`);

body.append(editForm);
const options = $(`<select name="songs" id="song_select"></select>`);
editForm.hide();

updateBtn.on("click", () => {
    songsPage.hide();
    recommendForm.hide();
    deleteForm.hide();
    editForm.empty();
    editForm.show();
    editForm.html(`
        <h2>Which song?</h2>
    `);
    
    songBank.forEach( (song, index) => {
        let newOption = $(`<option value = "${index}">${song.song_title}</option>`);
        options.append(newOption);
    });
    editForm.append(options);
});

options.on("change", (e) => {
    let targetIndex = e.target.value;
    const {id, song_title, band_name, genre, song_quote} = songBank[targetIndex];
    editForm.html(`
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

        // const url = 'https://eclectunes.onrender.com/api/songs/${song_id}';
        const url = `http://localhost:8000/api/songs/${id}`;

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
                    editForm.hide();
                })
        } catch (error) {
            console.error('Error editing song:', error);
            console.error('Failed to edit song:', newSong);
            recommendForm.append(`<p>Failed to submit edits! Did you put in the right fields?</p>`);
        }
    });
});

//Delete One
const deleteBtn = $(`#delete`);
const deleteForm = $(`<div id=delete_form></div>`);

body.append(deleteForm);
const removeOptions = $(`<select name="songs" id="song_select_delete"></select>`);
deleteForm.hide();

deleteBtn.on("click", () => {
    songsPage.hide();
    recommendForm.hide();
    editForm.hide();
    deleteForm.empty();
    deleteForm.show();
    deleteForm.html(`
        <h2>Which song?</h2>
    `);

    songBank.forEach( (song, index) => {
        let newOption = $(`<option value = "${index}">${song.song_title}</option>`);
        removeOptions.append(newOption);
    });
    deleteForm.append(removeOptions);

});

removeOptions.on("change", (e) => {
    let targetIndex = e.target.value;
    const {id, song_title, band_name} = songBank[targetIndex];
    deleteForm.html(`
    <h2>Are you sure you want to remove this song?</h2>
    <p>${song_title} by ${band_name}</p>
    <button id = "send_delete">DELETE</button>
    `);
    const removalButton = $(`#send_delete`);
    removalButton.on("click", () => {
        let finalRemove = window.confirm("This was someone's honest recommendation, removing this shouldn't be taken lightly. If you wish to delete please confirm.")
        if (finalRemove === true) {
            songBank.splice(targetIndex, 1)
            console.log(songBank);
            // const url = 'https://eclectunes.onrender.com/api/songs/${song_id}';
            const url = `http://localhost:8000/api/songs/${id}`;

            try{
                $.ajax({
                    url,
                    type: 'DELETE',
                })
                    .done( (data) => {
                        console.log('Song deleted:', data);
                        window.alert(`Song removed`);
                        deleteForm.hide();
                    })
            } catch (error) {
                console.error('Error deleting song:', error);
                console.error('Failed to delete song:', newSong);
                recommendForm.append(`<p>Failed to delete song! uh oh</p>`);
            }
        }
    });
});



});