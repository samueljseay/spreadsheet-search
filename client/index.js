window.init = () => {
  const SHEET_URL = '/spreadsheet'
  const search = new CardSearch()
  const searchButton = document.getElementById('search-button')
  const searchInput = document.getElementById('search-term')

  const performSearch = () => {
    const searchTerm = document.getElementById('search-term').value

    document.getElementById('results').innerHTML = ''

    const result = search.search(searchTerm)

    if (result.length) {
      result.forEach((result) => {
        let div = document.createElement('div')
        div.innerHTML = result
        document.getElementById('results').appendChild(div)
      })
    } else {
      document.getElementById('results').innerHTML = 'Sorry that card is not in stock.'
    }
  }

  const finishLoadingAnimation = () => {
    document.getElementById('loader').style = 'display: none;'
    document.getElementById('loader-header').style = 'display: none;'
    document.getElementById('search').style = 'display: block;'
  }

  searchButton.onclick = performSearch
  searchInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      performSearch()
    }
  })

  window.fetch(SHEET_URL)
    .then((response) => {
      return response.text()
    }).then((body) => {
      search.saveCards(body)
      finishLoadingAnimation()
    })
}

class CardSearch {
  saveCards (cards) {
    localStorage.setItem('cards', cards)
  }

  get cards () {
    return JSON.parse(localStorage.getItem('cards')) || []
  }

  search (searchTerm) {
    return this.cards.filter((card) => {
      const safeSearchTerm = searchTerm.toLowerCase()
      const cardText = card.toLowerCase()

      return cardText.indexOf(safeSearchTerm) !== -1
    })
  }
}
