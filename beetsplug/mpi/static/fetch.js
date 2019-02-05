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

    for (i in albums) {
        let album = albums[i];

        let newDiv = document.createElement("div");
        newDiv.setAttribute('class', 'row album');
        newDiv.setAttribute('id', 'album_' + album.id);

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
        divPlus.setAttribute("style", "cursor: pointer;");
        divPlus.addEventListener('click', async function () {

            const rawResponse = await fetch('/item/query/album_id:' + album.id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            let content = await rawResponse.json();

            addTitles(content.results, newDiv);
        });


        let divPlusIcon = document.createElement("i");
        divPlusIcon.setAttribute('class', 'fas fa-plus-circle');
        divPlus.appendChild(divPlusIcon);

        newDiv.appendChild(divArtist);
        newDiv.appendChild(divYear);
        newDiv.appendChild(divAlbum);
        newDiv.appendChild(divPlus);

        elAlbums.appendChild(newDiv);
    }
}


function addTitles(titles, elAlbum) {

    let container = document.getElementById(elAlbum.id + '_titles');
    let plus = elAlbum.querySelector('.fa-plus-circle');

    if (container) {
        container.remove();
    }

    if (plus) {
        plus.classList.remove('fa-plus-circle');
        plus.classList.add('fa-minus-circle');

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


        for (i in titles) {
            let title = titles[i];

            let newDiv = document.createElement("div");
            newDiv.setAttribute('class', 'row title');
            newDiv.setAttribute('id', 'title_' + title.id);

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
            divFormat.appendChild(document.createTextNode(title.format));

            let divPlay = document.createElement("div");
            divPlay.setAttribute('class', 'col-sm-1');
            let divPlayi = document.createElement("i");
            divPlayi.setAttribute('class', 'fa fa-play');
            divPlay.appendChild(divPlayi);

            newDiv.appendChild(newDiv1);
            newDiv.appendChild(divTrack);
            newDiv.appendChild(divTitle);
            newDiv.appendChild(divLength);
            newDiv.appendChild(divFormat);
            newDiv.appendChild(divPlay);

            titlesContainerDiv.appendChild(newDiv);
        }

    } else {
        let minus = elAlbum.querySelector('.fa-minus-circle');
        minus.classList.remove('fa-minus-circle');
        minus.classList.add('fa-plus-circle');
    }

}

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