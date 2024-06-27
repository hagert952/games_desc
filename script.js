class GameReviewApp {
    constructor() {
     
   
        this.categories = document.querySelectorAll('.category');
        this.gameReviews = document.getElementById('game-reviews');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.lightBoxContainer = document.querySelector('.lightbox-container');
        this.lightBoxItem = this.lightBoxContainer.querySelector('.lightbox-item');
        this.content = document.getElementById('content'); 
        this.init();
    }

    init() {
        for (let i = 0; i < this.categories.length; i++) {
            this.categories[i].addEventListener('click', () => {
                this.fetchGames(this.categories[i].dataset.category);
            });
        }
        this.fetchGames('MMORPG');

        document.getElementById('close').addEventListener('click', () => { this.hideLightbox(); });

      
        this.gameReviews.addEventListener('click', (event) => {
            const Cardgame = event.target.closest('.game-card');
            if (Cardgame) {
                const gameId = Cardgame.dataset.gameId;
                this.fetchGameDetails(gameId);
            }
        });
    }

    async fetchGames(category) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'e2fb2172a9mshba57fe693895545p12f6f5jsne73edc873011',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        this.showLoadingSpinner();
        this.removeContent();
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log('API response data:', result);

            // if ( result.length > 0) {
                this.displayGames(result);
            // } 
        } catch (error) {
            console.error('Error :', error);

        } finally {
            this.hideLoadingSpinner();
            this.showContent(); 
        }
    }

    async fetchGameDetails(id) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'e2fb2172a9mshba57fe693895545p12f6f5jsne73edc873011',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        this.showLoadingSpinner();
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log('Game', result);

            if (result && result.id) {
                this.displayGameDetails(result);
            } else {
                this.displayError('No details found for this game.');
            }
        } catch (error) {
            console.error('Error fetching game details:', error);
        } finally {
            this.hideLoadingSpinner();
        }
    }

    displayGames(games) {
        this.gameReviews.innerHTML = '';
        const template = document.getElementById('game-card-template').innerHTML;

        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            const contain = document.createElement('div');
            contain.innerHTML = template;
            const Cardgame = contain.firstElementChild;

            Cardgame.dataset.gameId = game.id;

            Cardgame.querySelector('img').src = game.thumbnail;
            Cardgame.querySelector('img').alt = game.title;
            Cardgame.querySelector('.card-title').innerText = game.title;
            Cardgame.querySelector('.card-text').innerText = game.short_description.slice(0, 56);
            Cardgame.querySelector('.genre').innerText = game.genre;
            Cardgame.querySelector('.platform').innerText = game.platform;

            this.gameReviews.appendChild(Cardgame);
        }
    }

    displayGameDetails(game) {
        const imgElement = this.lightBoxItem.querySelector('img');
        if (imgElement) {
            imgElement.src = game.thumbnail;
            imgElement.alt = "Game Screenshot";
        } else {
            console.error('Image element not found in lightbox.');
        }

        const h1Element = this.lightBoxItem.querySelector('h1 span');
        if (h1Element) {
            h1Element.innerText = game.title;
        } else {
            console.error('H1 element not found in lightbox.');
        }

        const categoryElement = this.lightBoxItem.querySelector('.category');
        if (categoryElement) {
            categoryElement.innerText = `${game.genre}`;
        } else {
            console.error('Category element not found in lightbox.');
        }

        const platformElement = this.lightBoxItem.querySelector('.platform');
        if (platformElement) {
            platformElement.innerText = ` ${game.platform}`;
        } else {
            console.error('Platform element not found in lightbox.');
        }

        const statusElement = this.lightBoxItem.querySelector('.status');
        if (statusElement) {
            statusElement.innerText = `Status: ${game.status}`;
        } else {
            console.error('Status element not found in lightbox.');
        }

        const descriptionElement = this.lightBoxItem.querySelector('.game-full-description');
        if (descriptionElement) {
            descriptionElement.innerText = `${game.description}`.replace(/\n\s+/g, ' ').trim();
        } else {
            console.error('Description element not found in lightbox.');
        }

        this.lightBoxContainer.classList.replace('d-none', 'd-flex');
    }

    hideLightbox() {
        this.lightBoxContainer.classList.replace('d-flex', 'd-none');
        this.showContent(); 
    }

    showLoadingSpinner() {
        this.loadingSpinner.style.display = 'flex';
    }

    hideLoadingSpinner() {
        this.loadingSpinner.style.display = 'none';
    }

    showContent() {
        
        this.content.classList.remove('d-none');
        this.content.classList.add('d-flex');
    }

    removeContent() {
     
        this.content.classList.remove('d-flex');
        this.content.classList.add('d-none');
    }

    displayError(message) {
        this.gameReviews.innerHTML = `<div class="error">${message}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameReviewApp();
});
