const searchField = document.getElementById('search-field')
const searchForm = document.getElementById('search-form')
const searchResultsEl = document.getElementById('search-results')

searchForm.addEventListener("submit", searchFilm)

let omdbApiSearchParams = {
    plot: "short",
    apikey: "aad72dfe",
    r: "JSON",
    type: "movie",
    s: ""
}

let omdbApiDetailsParams = {
    plot: "short",
    apikey: "aad72dfe",
    r: "JSON",
}

let results = []
let watchlist = []
if (localStorage.getItem('watchlist')){
    watchlist = JSON.parse(localStorage.getItem('watchlist'))
}

function convertToQueryString(params){
    const qs = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
    return qs
}

function searchFilm(e){
    e.preventDefault()

    omdbApiSearchParams = {
        ...omdbApiSearchParams,
        s: searchField.value
    }

    const qs = convertToQueryString(omdbApiSearchParams)

    fetch(`http://www.omdbapi.com/?${qs}`)
        .then(res => res.json())
        .then(data => {
            getAllMovieDetails(data)
        })
    searchField.value = ""
}

function getAllMovieDetails(data){
    if(!data.Error){
        const urls = []
        results = data.Search
        results.forEach((result) => {
            const thisDetailsParams = {
            ...omdbApiDetailsParams,
            i: result.imdbID
            }
            const qs = convertToQueryString(thisDetailsParams)
            urls.push(`http://www.omdbapi.com/?${qs}`)
        });
        Promise.all(urls.map(url=>fetch(url))).then(responses =>
            Promise.all(responses.map(res => res.json()))
        ).then(allMovieDetails => {
            results = allMovieDetails
            renderResults()
        })
    } else {
        renderResults()
    }
    
}

function renderResults(){
    if(results.length){
        searchResultsEl.className = "search-results-found"
        const resultsElements = results.map(result => {
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
                        <p class="film-plot">${limitText(result.Plot)}</p>
                    </div>
                </div>
                `
        })
        searchResultsEl.innerHTML = resultsElements.join("")
    } else {
        searchResultsEl.className = "search-results-not-found"
        searchResultsEl.innerHTML = `
                <span>
                    Unable to find what you’re looking for.
                    Please try another search.
                </span>
            `
    }
}

function addToWatchlist(id){
    const currentMovie = results.find(movie => movie.imdbID === id)
    watchlist.push(currentMovie)
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function limitText(text){
    if (text.length <= 132){
        return text
    } else if (text.length === 133 && text.substring(132) === ".") {
        return text
    } else {
        return `
            <span class="short-plot">${text.substring(0, 132)}...</span>
            <span class="long-plot hidden">${text}</span>
            <button onclick="showFullText(this)">Read More</button>
            `
    }
}

function showFullText(button){
    button.parentElement.children[0].classList.toggle('hidden')
    button.parentElement.children[1].classList.toggle('hidden')
    button.style.display = "none"
}