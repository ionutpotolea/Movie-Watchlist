console.log("working")
const watchlistMovies = document.getElementById('watchlist-movies')


let watchlist = JSON.parse(localStorage.getItem("watchlist"))
console.log(watchlist)

renderResults()


function renderResults(){
    if(watchlist.length){
        console.log(watchlistMovies)
        watchlistMovies.className = "watchlist-movies-found"
        const watchlistElements = watchlist.map(result => {
            const rating = result.Ratings.length ?
            result.Ratings[0].Value.split("/")[0] : "N/A"
            return `
                <div class="search-result">
                    <img
                        src="${result.Poster}"
                        class="film-poster"
                        onerror="this.onerror=null;this.src='/images/noPoster.jpg';"
                    />
                    <div>
                        <div class="film-title">
                            <h3>${result.Title}</h3>
                            <span class="film-rating">
                                <img src="/icons/star-icon.svg">
                                ${rating}
                            </span>
                        </div>
                        <div class="film-info">
                            <span class="film-duration">${result.Runtime}</span>
                            <span class="film-genre">${result.Genre}</span>
                            <button class="addToWatchlist" onclick="addToWatchlist('${result.imdbID}')">
                                <img src="/icons/plus-icon.svg">Watchlist
                            </button>
                        </div>
                        <p class="film-plot">${result.Plot}</p>
                    </div>
                </div>
                `
        })
        watchlistMovies.innerHTML = watchlistElements.join("")
    } else {
        watchlistMovies.className = "empty-watchlist"
        watchlistMovies.innerHTML = `
                <span>Your watchlist is looking a little empty...</span>
                <button class="addToWatchlist" onclick="window.location.href='/index.html'">
                    <img src="/icons/plus-icon.svg">Let’s add some movies!
                </button>
            `
    }
}