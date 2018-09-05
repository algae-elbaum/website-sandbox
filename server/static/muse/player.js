var playlist = [];
var curr_index = -1; // The current playlist element
var max_prev = 15; // Display up to this many songs in the queue in front of the currently playing song

function page_load()
{
    get_albums();
}

function get_albums()
{
    var req = new XMLHttpRequest();
    req.open('GET', 'api/albums', true);
    req.timeout = 1000;
    req.onload = 
        function (loadEvent) 
        {
            if (req.readyState == 4 && req.status == 200)
            {
                var resp = JSON.parse(req.responseText);                 
                for (var i = 0; i < resp.length; i++)
                    add_album(resp[i].name, resp[i].id);
            }
        }
    req.send();

}

function add_album(name, id)
{
    // cba to get jquery to get onlick right
    var albums_div = document.getElementById("albums");
    var new_li = document.createElement("li");
    var queue_btn = document.createElement("button");
    var play_btn = document.createElement("button");
    var text_a = document.createElement("a");

    // Queue button
    queue_btn.innerText = "queue";
    queue_btn.onclick = queue_album;
    queue_btn.setAttribute('data-id', id);

    // Play button
    play_btn.innerText = "play";
    play_btn.onclick = play_album;
    play_btn.setAttribute('data-id', id);

    // Album link
    text_a.innerText = name;
    text_a.onclick = show_album;
    text_a.setAttribute('data-id', id);

    new_li.appendChild(queue_btn);
    new_li.appendChild(play_btn);
    new_li.appendChild(text_a);
    albums_div.appendChild(new_li);
}

function show_album(event)
{
    var req = new XMLHttpRequest();
    req.open('GET', 'api/albums/' + event.srcElement.getAttribute('data-id'), true);
    req.timeout = 1000;
    req.onload = 
        function (loadEvent) 
        {
            if (req.readyState == 4 && req.status == 200)
            {
                var resp = JSON.parse(req.responseText);                 
                $('#curr_album_header').text(resp.name);
                $('#curr_album').empty();
                resp.songs.sort(function(o1, o2){return o1.name.localeCompare(o2.name);});
                for (var i = 0; i < resp.songs.length; i++)
                    add_song(resp.songs[i].name, resp.songs[i].id);
            }
        }
    req.send();
}

function queue_album(event)
{
    var req = new XMLHttpRequest();
    req.open('GET', 'api/albums/' + event.srcElement.getAttribute('data-id'), true);
    req.timeout = 1000;
    req.onload = 
        function (loadEvent) 
        {
            if (req.readyState == 4 && req.status == 200)
            {
                var resp = JSON.parse(req.responseText);                 
                resp.songs.sort(function(o1, o2){return o1.name.localeCompare(o2.name);});
                playlist = playlist.concat(resp.songs);
                refresh_playlist();
            }
        }
    req.send();
}

function play_album(event)
{
    var req = new XMLHttpRequest();
    req.open('GET', 'api/albums/' + event.srcElement.getAttribute('data-id'), true);
    req.timeout = 1000;
    req.onload = 
        function (loadEvent) 
        {
            if (req.readyState == 4 && req.status == 200)
            {
                var resp = JSON.parse(req.responseText);                 
                resp.songs.sort(function(o1, o2){return o1.name.localeCompare(o2.name);});
                var prev_songs = playlist.slice(0, curr_index + 1);
                var next_songs = playlist.slice(curr_index + 1);
                playlist = prev_songs.concat(resp.songs).concat(next_songs);
                refresh_playlist();
                play_next();
            }
        }
    req.send();
}

function add_song(name, id)
{
    // cba to get jquery to get onlick right
    var album_div = document.getElementById("curr_album");
    var new_li = document.createElement("li");
    var queue_btn = document.createElement("button");
    var play_btn = document.createElement("button");
    var text_a = document.createElement("a");

    // Queue button
    queue_btn.innerText = "queue";
    queue_btn.onclick = queue_song;
    queue_btn.setAttribute('data-id', id);
    queue_btn.setAttribute('data-name', name);

    // Play button
    play_btn.innerText = "play";
    play_btn.onclick = play_song;
    play_btn.setAttribute('data-id', id);
    play_btn.setAttribute('data-name', name);

    // Song link
    text_a.innerText = name;
    text_a.onclick = play_song;
    text_a.setAttribute('data-id', id);
    text_a.setAttribute('data-name', name);

    new_li.appendChild(queue_btn);
    new_li.appendChild(play_btn);
    new_li.appendChild(text_a);
    album_div.appendChild(new_li);
}

function queue_song(event)
{
    var song_json = {'name': event.srcElement.getAttribute('data-name'),
                     'id': event.srcElement.getAttribute('data-id')};
    playlist.push(song_json);
    refresh_playlist();
}

function play_song(event)
{
    var song_json = {'name': event.srcElement.getAttribute('data-name'),
                     'id': event.srcElement.getAttribute('data-id')};
    playlist.splice(curr_index+1, 0, song_json);
    refresh_playlist();
    play_next();
}

// Update what slice of the playlist is displayed on screen, and update the 
// current song pointer
function refresh_playlist()
{
    // Easy and fast enough to just remake the <li>
    $('#playlist').empty();
    var pl_div = document.getElementById('playlist');
    for (var i = Math.max(0, curr_index - max_prev); i < playlist.length; i++)
    {
        var new_li = document.createElement('li');
        var song = document.createElement('a');
        song.innerText = playlist[i].name;
        song.onclick =
            function (event)
            {
                curr_index = event.srcElement.getAttribute('data-idx') - 1;
                play_next();
            };
                
        song.setAttribute('data-idx', i);
        song.setAttribute('data-id', playlist[i].id);

        if (i === curr_index)
            song.innerText += '    <-------- Currently Playing';
        new_li.appendChild(song);
        pl_div.appendChild(new_li);
    }
}
function clear_playlist(event)
{
    playlist = [];
    curr_index = -1;
    refresh_playlist();
}


// Change current position in the playlist by i
function jump_by(i)
{
    // Allow being out of bounds by one index, in which case nothing plays
    curr_index = Math.min(playlist.length, Math.max(-1, curr_index + i));
    if (curr_index === -1 || curr_index === playlist.length)
        document.getElementById('curr_song').src = '';
    else
        load_song(playlist[curr_index].id);
    refresh_playlist();
}

function play_next()
{
    jump_by(1);
}

function play_prev()
{
    jump_by(-1);
}

function load_song(song_id)
{
    var req = new XMLHttpRequest();
    req.open('GET', 'api/songs/' + song_id, true);
    req.timeout = 1000;
    req.onload = 
        function (loadEvent) 
        {
            if (req.readyState == 4 && req.status == 200)
            {
                var resp = JSON.parse(req.responseText);                 
                var audio = document.getElementById('curr_song');
                audio.src = resp.file_url;
            }
        }
    req.send();
}
