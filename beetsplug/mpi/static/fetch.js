document.getElementById('search').addEventListener('click', async function () {
    const rawResponse = await fetch('/album/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    let content = await rawResponse.json();
    console.log(content);
});

document.getElementById('post_query').addEventListener('click', async function () {
    const rawResponse = await fetch('/query/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({a: 1, b: 'Textual content'})
    });
    let content = await rawResponse.json();
    console.log(content);
});