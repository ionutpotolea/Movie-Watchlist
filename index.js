const noSearch = document.querySelector('.no-search')
const searchField = document.getElementById('search-field')
const searchForm = document.getElementById('search-form')

noSearch.addEventListener("click", () => searchField.focus())
searchForm.addEventListener("submit", searchFilm)

let omdbApiParams = {
    plot: "full",
    apikey: "aad72dfe",
    r: "JSON",
    type: "movie",
    s: ""
}

function convertToQueryString(params){
    const qs = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
    return qs
}

function searchFilm(e){
    e.preventDefault()
    omdbApiParams = {
        ...omdbApiParams,
        s: searchField.value
    }
    let qs = convertToQueryString(omdbApiParams)
    fetch(`http://www.omdbapi.com/?${qs}`)
        .then(res => res.json())
        .then(data => console.log(data))
    searchField.value = ""
}
