const express = require('express');
const TorrentSearchApi = require('torrent-search-api');
const createError = require('http-errors');
const axios = require("axios");

const app = express();
const port = 3000;

const initTorrentApi = async () => {
    console.log("Checking torrent providers...");
    TorrentSearchApi.enablePublicProviders();
    const providers = TorrentSearchApi._getActiveProviders();
    
    for (let i = 0; i < providers.length; i++) {
        try {
            await axios.get(providers[i].baseUrl);
        } catch (e) {
            TorrentSearchApi.disableProvider(providers[i].name);
            console.log("Disabling provider", providers[i].name, "(" + providers[i].baseUrl + ")", "from network error:", e.message);
        }
    }

    console.log("Scraping from:", TorrentSearchApi._getActiveProviders().map(p => p.name))
}

const startServer = async () => {
    await initTorrentApi();
    app.listen(port, () => {
        console.log(`Listening on ${port}`);
    });
}

startServer();

app.param("title", (req, res, next, title) => {
    if (!title) next(createError(400, 'must provide title for search query'))
    req.title = title;
    next();
});

app.param("category", (req, res, next, category) => {
    if (!category || category==="any") next();
    req.category = category;
    next();
});

app.get('/search/:category/:title', async (req, res) => {
    const torrents = await search(req, req.title, req.category);
    res.send(torrents);
});

app.get('/search/:title', async (req, res) => {
    const torrents = await search(req, req.title);
    res.send(torrents);
});

const search = async (req, title, category) => {
    const limit = req.query.limit;
    const torrents = await TorrentSearchApi.search(title, category, limit);
    //const torrents = await TorrentSearchApi.search("test");
    return torrents;
}