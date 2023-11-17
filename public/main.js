$(document).ready( () => { 

const body = $('body');

const recommendBtn = $(`#recommend`);
const songsBtn = $(`#songs`);
const recommendForm = $(`<div id=recommend_form></div>`);
const songsPage = $(`<div id=songs_page></div>`);
body.append(songsPage);
songsPage.hide();

recommendForm.html(`
<h2>Recommend a song!</h2>
<input type = "text" id = "song_title" placeholder = "Song title?">
<input type = "text" id = "band_name" placeholder = "Band name?">
<input type = "text" id = "genre" placeholder = "What genre?">
<input type = "text" id = "song_lyric" placeholder = "Favorite song lyric?">
<input type = "text" id = "recommend_why" placeholder = "Why do you like this song?">
`);
const sendBtn = $(`<button id = "send">Share you recommendation!</button>`);
sendBtn.on("click", () => {
    sendRecommend();
});
recommendForm.append(sendBtn);
body.append(recommendForm);
recommendForm.hide();

recommendBtn.on("click", () => {
songsPage.hide();
recommendForm.show();
})



const sendRecommend = () => {
    
    const url = 'https://eclectunes.onrender.com/api/songs';

    const newSong = {
        song_title: $(`#song_title`).val(),
        band_name: $(`#band_name`).val(),
        genre: $(`#genre`).val(),
        song_lyric: $(`#song_lyric`).val(),
        recommend_why: $(`#recommend_why`).val(),
        user_id: 1
    };
    try{
        $.ajax({
            url,
            type: 'POST',
            contentType: 'applicatioin/json',
            data: JSON.stringify(newSong),
            success: (data) => {
                console.log('Song posted:', data);
                recommendForm.append(`<p>Thanks for your recommendation!</p>`);
            }, 
        });
    } catch (error) {
        console.error('Error posting song:', error);
        console.error('Failed to post song:', newSong);
        recommendForm.append(`<p>Failed to post recommendation! Did you put in the right fields?</p>`); 
    }
};

let getCount = 0

songsBtn.on("click", () => {
    recommendForm.hide();
    songsPage.show();
    if (getCount < 1) {
        const url = 'https://eclectunes.onrender.com/api/songs';
        try {
            $.ajax({
                url,
                type: 'GET',
                success: (data) => {
                    songsPage.append(`<p>Check out what others liked!</p>`);
                    data.forEach((song, index) => {
                        console.log(song);
                        songsPage.append(`<li class='song'> <b>song title:</b> ${song.song_title} <b>band name:</b> ${song.band_name} <b>genre:</b> ${song.genre} <b>favorite song lyric:</b> ${song.song_lyric} <b>Why it was reccomended:</b> ${song.recommend_why}</li>`)
                    });
                    getCount++;
                }, 
            });
        } catch (error) {
            console.error('Error getting songs', error);
            console.error('Failed to get songs');
            recommendForm.append(`<p>Failed to get songs! Oh no!</p>`); 
        }
    }
});

});