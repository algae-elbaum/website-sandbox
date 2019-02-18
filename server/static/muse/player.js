var dflt_pl =
{
    playlist: [],
    curr_idx: -1, // The current song idx 
    max_prev: 15, // Num songs to show in the queue before the current song

    // Queue an album into the playlist
    queue_album: function (album_id)
    {
        var req = new XMLHttpRequest();
        req.open('GET', 'api/albums/' + album_id, true);
        req.timeout = 1000;
        req.onload = 
            function (loadEvent) 
            {
                if (req.readyState == 4 && req.status == 200)
                {
                    var resp = JSON.parse(req.responseText);                 
                    resp.songs.sort(function(o1, o2){return o1.name.localeCompare(o2.name);});
                    this.playlist = this.playlist.concat(resp.songs);
                    this.refresh_playlist();
                }
            }.bind(this);
        req.send();
    },

    // Add album to playlist and play. Album is inserted after the current song
    play_album: function (album_id)
    {
        var req = new XMLHttpRequest();
        req.open('GET', 'api/albums/' + album_id, true);
        req.timeout = 1000;
        req.onload = 
            function (loadEvent) 
            {
                if (req.readyState == 4 && req.status == 200)
                {
                    var resp = JSON.parse(req.responseText);                 
                    resp.songs.sort(function(o1, o2){return o1.name.localeCompare(o2.name);});
                    var prev_songs = this.playlist.slice(0, this.curr_idx + 1);
                    var next_songs = this.playlist.slice(this.curr_idx + 1);
                    this.playlist = prev_songs.concat(resp.songs).concat(next_songs);
                    this.refresh_playlist();
                    this.play_next();
                }
            }.bind(this);
        req.send();
    },

    // Queue song to end of playlist
    queue_song: function (song_id, song_name)
    {
        var song_json = {'name': song_name, 'id': song_id};
        this.playlist.push(song_json);
        this.refresh_playlist();
    },

    // Add song to playlist and play. Song is inserted after the current song
    play_song: function (song_id, song_name)
    {
        var song_json = {'name': song_name, 'id': song_id};
        this.playlist.splice(this.curr_idx+1, 0, song_json);
        this.play_next();
    },
    
    remove_song: function (idx)
    {
        this.playlist.splice(idx, 1);
        this.refresh_playlist();
        console.log(idx);
        console.log(this.curr_idx);
        if (Number(idx) === this.curr_idx)
            this.jump_by(0);
    },

    // Update what slice of the playlist is displayed on screen, and update the 
    // current song pointer
    refresh_playlist: function ()
    {
        // Easy and fast enough to just remake the <li>
        $('#playlist').empty();
        var pl_div = document.getElementById('playlist');
        var playlist_start = Math.max(0, this.curr_idx - this.max_prev);
        for (var i = playlist_start;  i < this.playlist.length; i++)
        {
            var new_li = document.createElement('li');
            var rem = document.createElement('a');
            var song = document.createElement('a');

            // Remove song button
            rem.innerText = "(x)";
            rem.onclick =
                function (event)
                {
                    this.remove_song(event.srcElement.getAttribute('data-idx'));
                }.bind(this);

            rem.setAttribute('data-idx', i);
            new_li.appendChild(rem);

            // Song link
            song.innerText = this.playlist[i].name;
            song.onclick =
                function (event)
                {
                    this.curr_idx = event.srcElement.getAttribute('data-idx') - 1;
                    this.play_next();
                }.bind(this);
                    
            song.setAttribute('data-idx', i);

            if (i === this.curr_idx)
                song.innerText += '    <-------- Currently Playing';
            new_li.appendChild(song);

            pl_div.appendChild(new_li);
        }
    },

    clear_playlist: function (event)
    {
        this.playlist = [];
        this.curr_idx = -1;
        this.refresh_playlist();
    },


    // Change current position in the playlist by i
    jump_by: function (i)
    {
        // Allow being out of bounds by one index, in which case nothing plays
        this.curr_idx = Math.min(this.playlist.length,
                                 Math.max(-1, this.curr_idx + i));
        if (this.curr_idx === -1 || this.curr_idx === this.playlist.length)
            document.getElementById('curr_song').src = '';
        else
            this.load_song(this.playlist[this.curr_idx].id);
        this.refresh_playlist();
    },

    play_next: function ()
    {
        this.jump_by(1);
    },

    play_prev: function ()
    {
        this.jump_by(-1);
    },

    // Actually play a song!
    load_song: function (song_id)
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
};


function page_load()
{
    get_albums();
}

function call_with_evt_data(fun)
{
    return function(event)
    {
        fun(event.srcElement.getAttribute('data-id'),
            event.srcElement.getAttribute('data-name'));
    }
}

// Fetch and display list of stored albums
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

// Add an album to the displayed album list
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
    queue_btn.onclick = call_with_evt_data(dflt_pl.queue_album.bind(dflt_pl));
    queue_btn.setAttribute('data-id', id);

    // Play button
    play_btn.innerText = "play";
    play_btn.onclick = call_with_evt_data(dflt_pl.play_album.bind(dflt_pl));
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

// Add a song to the displayed song list
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
    queue_btn.onclick = call_with_evt_data(dflt_pl.queue_song.bind(dflt_pl));
    queue_btn.setAttribute('data-id', id);
    queue_btn.setAttribute('data-name', name);

    // Play button
    play_btn.innerText = "play";
    play_btn.onclick = call_with_evt_data(dflt_pl.play_song.bind(dflt_pl));
    play_btn.setAttribute('data-id', id);
    play_btn.setAttribute('data-name', name);

    // Song link
    text_a.innerText = name;
    text_a.onclick = call_with_evt_data(dflt_pl.play_song.bind(dflt_pl));
    text_a.setAttribute('data-id', id);
    text_a.setAttribute('data-name', name);

    new_li.appendChild(queue_btn);
    new_li.appendChild(play_btn);
    new_li.appendChild(text_a);
    album_div.appendChild(new_li);
}

// List an album's songs in the displayed song list
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


