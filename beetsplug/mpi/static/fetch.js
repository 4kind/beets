let music = document.getElementById('music');
let duration = music.duration; // Duration of audio clip, calculated here for embedding purposes
let pButton = document.getElementById('pButton'); // play button
let playhead = document.getElementById('playhead'); // playhead
let timeline = document.getElementById('timeline'); // timeline

// timeline width adjusted for playhead
let timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

// play button event listenter
pButton.addEventListener("click", play);

// timeupdate event listener
music.addEventListener("timeupdate", timeUpdate, false);

// makes timeline clickable
timeline.addEventListener("click", function (event) {
    moveplayhead(event);
    music.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
let clickPercent = function(event) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
};

// makes playhead draggable
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that audio position is updated only when the playhead is released
let onplayhead = false;

// mouseDown EventListener
function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    music.removeEventListener('timeupdate', timeUpdate, false);
}

// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(event) {
    if (onplayhead === true) {
        moveplayhead(event);
        window.removeEventListener('mousemove', moveplayhead, true);
        // change current time
        music.currentTime = duration * clickPercent(event);
        music.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
}

// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(event) {
    let newMargLeft = event.clientX - getPosition(timeline);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}

// timeUpdate
// Synchronizes playhead position with current point in audio
function timeUpdate() {
    let playPercent = timelineWidth * (music.currentTime / duration);
    playhead.style.marginLeft = playPercent + "px";
    if (music.currentTime === duration) {
        pButton.className = "";
        pButton.className = "fa fa-play";
    }
}

//Play and Pause
function play() {
    // start music
    if (music.paused) {
        music.play();
        pButton.className = "";
        pButton.className = "fa fa-pause";
    } else { // pause music
        music.pause();
        pButton.className = "";
        pButton.className = "fa fa-play";
    }
}

// Gets audio file duration
music.addEventListener("canplaythrough", function () {
    duration = music.duration;
}, false);

// getPosition
// Returns elements left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}


document.getElementById('album_query').addEventListener('click', async function () {
    let queryVal = document.getElementById('query').value,
        isQuery = queryVal.length > 0,
        queryParam = isQuery ? 'query/' + queryVal : '';

    const rawResponse = await fetch('/album/' + queryParam, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    });
    let content = await rawResponse.json(),
        albums = isQuery ? content.results : content.albums;

    addAlbums(albums);
});

function addAlbums(albums) {

    let elAlbums = document.getElementById('albums');

    while (elAlbums.childNodes.length > 2) {
        elAlbums.removeChild(elAlbums.lastChild);
    }

    for (let i in albums) {
        let album = albums[i];

        let divRow = document.createElement("div");
        divRow.setAttribute('class', 'row album');
        divRow.setAttribute('id', 'album_' + album.id);

        let divArtist = document.createElement("div");
        divArtist.setAttribute('class', 'col-sm-3');
        divArtist.appendChild(document.createTextNode(album.albumartist));

        let divYear = document.createElement("div");
        divYear.setAttribute('class', 'col-sm-1');
        divYear.appendChild(document.createTextNode(album.original_year));

        let divAlbum = document.createElement("div");
        divAlbum.setAttribute('class', 'col-sm-7');
        divAlbum.appendChild(document.createTextNode(album.album));

        let divPlus = document.createElement("div");
        divPlus.setAttribute('class', 'col-sm-1');
        divPlus.appendChild(document.createTextNode(''));


        divRow.addEventListener('click', async function () {
            const rawResponse = await fetch('/item/query/album_id:' + album.id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            let content = await rawResponse.json();

            addTitles(content.results, divRow);
        });

        divRow.appendChild(divArtist);
        divRow.appendChild(divYear);
        divRow.appendChild(divAlbum);
        divRow.appendChild(divPlus);

        elAlbums.appendChild(divRow);
    }
}


function addTitles(titles, elAlbum) {

    let container = document.getElementById(elAlbum.id + '_titles');

    if (container) {
        container.remove();
    } else {
        let newTitlesRowDiv = document.createElement("div");
        newTitlesRowDiv.setAttribute('class', 'row album-titles');
        newTitlesRowDiv.setAttribute('id', elAlbum.id + '_titles');

        let titlesContainerDiv = document.createElement("div");
        titlesContainerDiv.setAttribute('class', 'container-fluid titles');

        let rowDiv = document.createElement("div");
        rowDiv.setAttribute('class', 'row');

        let divDiv = document.createElement("div");
        divDiv.setAttribute('class', 'col-sm-3');

        let divTrack = document.createElement("div");
        divTrack.setAttribute('class', 'col-sm-1 font-weight-bold bg-secondary text-light');
        divTrack.appendChild(document.createTextNode('Track'));

        let divTitle = document.createElement("div");
        divTitle.setAttribute('class', 'col-sm-5 font-weight-bold bg-secondary text-light');
        divTitle.appendChild(document.createTextNode('Title'));

        let divLength = document.createElement("div");
        divLength.setAttribute('class', 'col-sm-1 font-weight-bold bg-secondary text-light');
        divLength.appendChild(document.createTextNode('Length'));

        let divFormat = document.createElement("div");
        divFormat.setAttribute('class', 'col-sm-1 font-weight-bold bg-secondary text-light');
        divFormat.appendChild(document.createTextNode('Format'));

        let divPlay = document.createElement("div");
        divPlay.setAttribute('class', 'col-sm-1 font-weight-bold bg-secondary text-light');

        rowDiv.appendChild(divDiv);
        rowDiv.appendChild(divTrack);
        rowDiv.appendChild(divTitle);
        rowDiv.appendChild(divLength);
        rowDiv.appendChild(divFormat);
        rowDiv.appendChild(divPlay);

        titlesContainerDiv.appendChild(rowDiv);
        newTitlesRowDiv.appendChild(titlesContainerDiv);

        insertAfter(newTitlesRowDiv, elAlbum);

        music.addEventListener('ended', function () {
            if (music.hasChildNodes()) {
                music.removeChild(music.firstChild);
                if (music.hasChildNodes()) {
                    let src = music.firstChild.getAttribute('src');
                    let playingDivRow = document.querySelector("[data-src='" + src + "']");
                    unmarkPlayedTrack(playingDivRow);
                    markPlayedTrack(playingDivRow);

                    // muß eventuell am ende immer gemacht werden
                    playerReload(music);
                }
            }
        });

        for (let i in titles) {
            let title = titles[i];
            let type = 'audio/' + title.format.toLowerCase();

            let divRow = document.createElement("div");
            divRow.setAttribute('class', 'row title');
            divRow.setAttribute('id', 'title_' + title.id);
            divRow.setAttribute('data-src', '/item/' + title.id + '/file');
            divRow.setAttribute('data-type', type);

            let newDiv1 = document.createElement("div");
            newDiv1.setAttribute('class', 'col-sm-3');

            let divTrack = document.createElement("div");
            divTrack.setAttribute('class', 'col-sm-1');
            divTrack.appendChild(document.createTextNode(title.track));

            let divTitle = document.createElement("div");
            divTitle.setAttribute('class', 'col-sm-5');
            divTitle.appendChild(document.createTextNode(title.title));

            let divLength = document.createElement("div");
            divLength.setAttribute('class', 'col-sm-1');
            divLength.appendChild(document.createTextNode(toMmSs(title.length)));

            let divFormat = document.createElement("div");
            divFormat.setAttribute('class', 'col-sm-1');
            divFormat.appendChild(document.createTextNode(type));

            let divPlay = document.createElement("div");
            divPlay.setAttribute('class', 'col-sm-1');
            divPlay.appendChild(document.createTextNode(''));

            divRow.addEventListener('click', function () {
                unmarkPlayedTrack(divRow);
                markPlayedTrack(divRow);
                removeTracks(music);
                addTracks(music, divRow);
                playerReload(music);
            });

            divRow.appendChild(newDiv1);
            divRow.appendChild(divTrack);
            divRow.appendChild(divTitle);
            divRow.appendChild(divLength);
            divRow.appendChild(divFormat);
            divRow.appendChild(divPlay);

            titlesContainerDiv.appendChild(divRow);
        }
    }
}

playerReload = function (music) {
    music.pause();
    music.load();
    play();
};

markPlayedTrack = function (divRow) {
    let playing = divRow.querySelectorAll(":not(:first-child)");
    for (let i in playing) {
        if (playing[i] instanceof HTMLElement) {
            playing[i].classList.add('bg-info');
        }
    }
};

unmarkPlayedTrack = function (divRow) {
    let playing = divRow.parentElement.querySelectorAll(".bg-info");
    for (let i in playing) {
        if (playing[i] instanceof HTMLElement) {
            playing[i].classList.remove('bg-info');
        }
    }
};

removeTracks = function (music) {
    while (music.hasChildNodes()) {
        music.removeChild(music.lastChild);
    }
};

addTracks = function (music, elem) {

    let sibling = elem;

    addSource(music, sibling);

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            addSource(music, sibling);
        }
        sibling = sibling.nextSibling
    }
};

addSource = function (music, sibling) {
    let source = document.createElement('source');
    source.setAttribute('src', sibling.dataset.src);
    source.setAttribute('type', sibling.dataset.type);
    music.appendChild(source);
};


insertAfter = function (newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

toMmSs = function (number) {
    let sec_num = parseInt(number, 10),
        minutes = Math.floor((sec_num) / 60),
        seconds = sec_num - (minutes * 60);

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
};

