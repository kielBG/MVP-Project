$(document).ready( () => { 

let songBank;

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
const body = $('body');

const songsBtn = $(`#songs`);
const recommendForm = $(`<div id=recommend_form></div>`);
const songsPage = $(`<div id=songs_page></div>`);
body.append(songsPage);
songsPage.hide();

let pageLoadCount = 0

songsBtn.on("click", () => {
    recommendForm.hide();
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
songsPage.hide();
recommendForm.show();
});



function sendRecommend() {
    
    // const url = 'https://eclectunes.onrender.com/api/songs';
    const url = 'http://localhost:8000/api/songs'; 

    const newSong = {
        song_title: $(`#song_title`).val(),
        band_name: $(`#band_name`).val(),
        genre: $(`#genre`).val(),
        song_lyric: $(`#song_quote`).val(),
        recommend_why: $(`#recommend_why`).val(),
        user_id: 1
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
                recommendForm.append(`<p>Thanks for your recommendation!</p>`);
            })
        
    } catch (error) {
        console.error('Error posting song:', error);
        console.error('Failed to post song:', newSong);
        recommendForm.append(`<p>Failed to post recommendation! Did you put in the right fields?</p>`); 
    }
};

//put request



});