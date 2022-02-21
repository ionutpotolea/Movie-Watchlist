// const noSearch = document.querySelector('.no-search')
const searchField = document.getElementById('search-field')
const searchForm = document.getElementById('search-form')
const searchResultsEl = document.getElementById('search-results')

// noSearch.addEventListener("click", () => searchField.focus())
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
            getFullResults(data)
        })
    searchField.value = ""
}

function getFullResults(data){
    getAllMovieDetails(data)
    // .then(() => renderResults())
    // console.log("hello22")
    
}

function getAllMovieDetails(data){
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
}

function renderResults(){
    console.log("hello22")
    if(results.length){
        console.log(results[0])
        searchResultsEl.className = "search-results-found"
        const resultsElements = results.map(result => {
            return `
                <img src="${result.Poster}" class="film-poster" />
                <div>
                    <h3 class="film-title">${result.Title}</h3>
                    <span class="film-rating">
                        <img src="/icons/star-icon.svg">
                        ${result.Ratings[0].Value.split("/")[0]}
                    </span>
                    <span class="film-duration">${result.Runtime}</span>
                    <span class="film-genre">${result.Genre}</span>
                    <button class="addToWatchlist" onclick="addToWatchlist()">
                        <img src="/icons/plus-icon.svg">Watchlist
                    </button>
                    <p>${result.Plot}</p>
                </div>
                `
        })
        searchResultsEl.innerHTML = resultsElements.join("")
    }
}

function addToWatchlist(){
    console.log("clicked!")
}