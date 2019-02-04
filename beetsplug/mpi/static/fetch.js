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
        newDiv.addEventListener('click', async function () {

            const rawResponse = await fetch('/item/query/album_id:' + album.id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            let content = await rawResponse.json();

            addTitles(content.results, newDiv);
        });

        let newDiv1 = document.createElement("div");
        newDiv1.setAttribute('class', 'col-sm-2');
        newDiv1.appendChild(document.createTextNode(album.genre));

        let newDiv2 = document.createElement("div");
        newDiv2.setAttribute('class', 'col-sm-4');
        newDiv2.appendChild(document.createTextNode(album.albumartist));

        let newDiv3 = document.createElement("div");
        newDiv3.setAttribute('class', 'col-sm-1');
        newDiv3.appendChild(document.createTextNode(album.original_year));

        let newDiv4 = document.createElement("div");
        newDiv4.setAttribute('class', 'col-sm-4');
        newDiv4.appendChild(document.createTextNode(album.album));

        let newDiv5 = document.createElement("div");
        newDiv5.setAttribute('class', 'col-sm-1');
        newDiv5.setAttribute("style", "cursor: pointer;");

        let newDiv5i = document.createElement("i");
        newDiv5i.setAttribute('class', 'fas fa-plus-circle');
        newDiv5.appendChild(newDiv5i);

        newDiv.appendChild(newDiv1);
        newDiv.appendChild(newDiv2);
        newDiv.appendChild(newDiv3);
        newDiv.appendChild(newDiv4);
        newDiv.appendChild(newDiv5);

        elAlbums.appendChild(newDiv);
    }
}


function addTitles(titles, elAlbum) {

    let container = elAlbum.querySelector("#" + elAlbum.id + '_titles');
    let plus = elAlbum.querySelector('.fa-plus-circle');

    if (container) {
        container.remove();
    }

    if (plus) {
        plus.classList.remove('fa-plus-circle');
        plus.classList.add('fa-minus-circle');


        let titlesContainerDiv = document.createElement("div");
        titlesContainerDiv.setAttribute('class', 'container-fluid titles');
        titlesContainerDiv.setAttribute('id', elAlbum.id + '_titles');

        let rowDiv = document.createElement("div");
        rowDiv.setAttribute('class', 'row');

        let newDiv1 = document.createElement("div");
        newDiv1.setAttribute('class', 'col-sm-2 font-weight-bold album-artist bg-secondary text-light');
        newDiv1.appendChild(document.createTextNode('Track'));

        let newDiv2 = document.createElement("div");
        newDiv2.setAttribute('class', 'col-sm-4 font-weight-bold album-artist bg-secondary text-light');
        newDiv2.appendChild(document.createTextNode('Title'));

        let newDiv3 = document.createElement("div");
        newDiv3.setAttribute('class', 'col-sm-1 font-weight-bold album-artist bg-secondary text-light');
        newDiv3.appendChild(document.createTextNode('Length'));

        let newDiv4 = document.createElement("div");
        newDiv4.setAttribute('class', 'col-sm-4 font-weight-bold album-artist bg-secondary text-light');
        newDiv4.appendChild(document.createTextNode('Format'));

        let newDiv5 = document.createElement("div");
        newDiv5.setAttribute('class', 'col-sm-1 font-weight-bold album-artist bg-secondary text-light');

        let newDiv5i = document.createElement("i");
        newDiv5.appendChild(newDiv5i);

        rowDiv.appendChild(newDiv1);
        rowDiv.appendChild(newDiv2);
        rowDiv.appendChild(newDiv3);
        rowDiv.appendChild(newDiv4);
        rowDiv.appendChild(newDiv5);

        titlesContainerDiv.appendChild(rowDiv);

        elAlbum.appendChild(titlesContainerDiv);


        for (i in titles) {
            let title = titles[i];

            let newDiv = document.createElement("div");
            newDiv.setAttribute('class', 'row title');
            newDiv.setAttribute('id', 'title_' + title.id);

            let newDiv1 = document.createElement("div");
            newDiv1.setAttribute('class', 'col-sm-2');
            newDiv1.appendChild(document.createTextNode(title.track));

            let newDiv2 = document.createElement("div");
            newDiv2.setAttribute('class', 'col-sm-4');
            newDiv2.appendChild(document.createTextNode(title.title));

            let newDiv3 = document.createElement("div");
            newDiv3.setAttribute('class', 'col-sm-1');
            newDiv3.appendChild(document.createTextNode(toMmSs(title.length)));

            let newDiv4 = document.createElement("div");
            newDiv4.setAttribute('class', 'col-sm-4');
            newDiv4.appendChild(document.createTextNode(title.format));

            let newDiv5 = document.createElement("div");
            newDiv5.setAttribute("style", "cursor: pointer;");

            let newDiv5i = document.createElement("i");
            newDiv5i.setAttribute('class', 'fas fa-play');
            newDiv5.appendChild(newDiv5i);

            newDiv.appendChild(newDiv1);
            newDiv.appendChild(newDiv2);
            newDiv.appendChild(newDiv3);
            newDiv.appendChild(newDiv4);
            newDiv.appendChild(newDiv5);

            titlesContainerDiv.appendChild(newDiv);
        }

    } else {
        let minus = elAlbum.querySelector('.fa-minus-circle');
        minus.classList.remove('fa-minus-circle');
        minus.classList.add('fa-plus-circle');
    }

}

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