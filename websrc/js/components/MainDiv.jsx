import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'reactstrap';
import { useFetch } from '../util/ajax';
import TorrentList from './TorrentList';
import $ from 'jquery';

const MainDiv = () => {

    const [input, setInput] = useState("");
    const [search, setSearch] = useState(null);
    const url = search ? "https://local.milfos.com/search/" + search: null;
    const fetch = useFetch(url);

    return <div id="main-page">
        Search: <input value={input} onChange={e => setInput(e.target.value)} type="text"/>
        <br/>
        <Button color="primary" onClick={() => setSearch(input)} disabled={!fetch.resolved}>{fetch.resolved ? "Go" : "Searhing..."}</Button>
        <br/>
        <br/>
        {search && fetch.resolved && <TorrentList torrents={fetch.value}/>}
    </div>

};

export default MainDiv;
