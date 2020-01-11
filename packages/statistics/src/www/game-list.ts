export async function getGameIds() {
    const response = await fetch('/games');
    const games: string[] = await response.json();

    const container = document.querySelector('.game-ids');
    games.forEach(game => {
        const id = game.replace(/\.json$/, '');
        container.innerHTML += `<a onclick="load('${id}')">${id}</a><br>`;
    });
}