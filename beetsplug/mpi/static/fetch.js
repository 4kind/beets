class Playa {
    constructor() {
        // Boolean value so that audio position is updated only when the playhead is released
        this.onplayhead = false;
        this.pButton = document.getElementById('pButton'); // play button
        this.playhead = document.getElementById('playhead'); // playhead
        this.timeline = document.getElementById('timeline'); // timeline
        this.timelineWidth = this.timeline.offsetWidth - this.playhead.offsetWidth;
        this.music = document.getElementById('music');
        this.duration = this.music.duration; // Duration of audio clip, calculated here for embedding purposes
    }

    addEvents() {
        let me = this;

        window.addEventListener('mouseup', function (event) {
            me.mouseUp(event)
        }, false);


        // makes playhead draggable
        this.playhead.addEventListener('mousedown', function () {
            me.mouseDown()
        }, false);

        // play button event listenter
        this.pButton.addEventListener("click", function () {
            me.play()
        });

        // makes timeline clickable
        this.timeline.addEventListener("click", function (event) {
            moveplayhead(event);
            me.music.currentTime = me.duration * playa.clickPercent(event);
        }, false);

        // timeupdate event listener
        this.music.addEventListener("timeupdate", function () {
            me.timeUpdate()
        }, false);

        // Gets audio file duration
        this.music.addEventListener("canplaythrough", function () {
            me.duration = me.music.duration;
        }, false);
    }

    // returns click as decimal (.77) of the total timelineWidth
    clickPercent(event) {
        return (event.clientX - this.getPosition()) / this.timelineWidth;
    };

    // mouseDown EventListener
    mouseDown() {
        this.onplayhead = true;
        window.addEventListener('mousemove', moveplayhead, true);
        let me = this;
        this.music.removeEventListener('timeupdate', function () {
            me.timeUpdate();
        }, false);
    }

    // timeUpdate
    // Synchronizes playhead position with current point in audio
    timeUpdate() {
        let playPercent = this.timelineWidth * (this.music.currentTime / this.duration);
        this.playhead.style.marginLeft = playPercent + "px";
        if (this.music.currentTime === this.duration) {
            this.pButton.className = "";
            this.pButton.className = "fa fa-play";
        }
    }

    //Play and Pause
    play() {
        // start music
        if (this.music.paused) {
            this.music.play();
            this.pButton.className = "";
            this.pButton.className = "fa fa-pause";
        } else { // pause music
            this.music.pause();
            this.pButton.className = "";
            this.pButton.className = "fa fa-play";
        }
    }

    // getPosition
    // Returns elements left position relative to top-left of viewport
    getPosition() {
        return this.timeline.getBoundingClientRect().left;
    }

    // mouseUp EventListener
    // getting input from all mouse clicks
    mouseUp(event) {
        if (playa.onplayhead === true) {
            moveplayhead(event);
            window.removeEventListener('mousemove', moveplayhead, true);
            // change current time
            playa.music.currentTime = playa.duration * playa.clickPercent(event);

            let pl = playa;
            playa.music.addEventListener('timeupdate', function () {
                pl.timeUpdate()
            }, false);
        }
        playa.onplayhead = false;
    }
}

playa = new Playa();
playa.addEvents();


// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(event) {
    let newMargLeft = event.clientX - playa.getPosition();

    if (newMargLeft >= 0 && newMargLeft <= playa.timelineWidth) {
        playa.playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playa.playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > playa.timelineWidth) {
        playa.playhead.style.marginLeft = playa.timelineWidth + "px";
    }
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

            addTitles(content.results, divRow, playa);
        });

        divRow.appendChild(divArtist);
        divRow.appendChild(divYear);
        divRow.appendChild(divAlbum);
        divRow.appendChild(divPlus);

        elAlbums.appendChild(divRow);
    }
}


function addTitles(titles, elAlbum, playa) {

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

        playa.music.addEventListener('ended', function () {
            if (playa.music.hasChildNodes()) {
                playa.music.removeChild(playa.music.firstChild);
                if (playa.music.hasChildNodes()) {
                    let src = playa.music.firstChild.getAttribute('src');
                    let playingDivRow = document.querySelector("[data-src='" + src + "']");
                    unmarkPlayedTrack(playingDivRow);
                    markPlayedTrack(playingDivRow);

                    // muß eventuell am ende immer gemacht werden
                    playerReload(playa.music);
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
                removeTracks(playa.music);
                addTracks(playa.music, divRow);
                playerReload(playa.music);
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
    playa.play();
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

