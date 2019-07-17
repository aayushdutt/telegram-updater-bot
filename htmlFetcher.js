const rp = require('request-promise');
const cheerio = require('cheerio')

class htmlFetcher {
    constructor(S, URL) {
        this.selector = S;
        this.url = URL
    }

    fetchData() {
        return  rp(this.url)
                .then(html => cheerio.load(html))
                .then($ => $(this.selector).text().trim())
    }
}


module.exports = htmlFetcher