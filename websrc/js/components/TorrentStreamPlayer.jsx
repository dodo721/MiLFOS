import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'reactstrap';
import WebTorrent from 'webtorrent/dist/webtorrent.min.js';
import $ from 'jquery';

const TorrentStreamPlayer = () => {

    const [torrent, setTorrent] = useState(null);
    const [torrentProgress, setTorrentProgress] = useState("0%");
    const [updateInterval, setUpdateInterval] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    const [videoStatus, setVideoStatus] = useState("Unloaded");
    const videoRef = useRef();

    useEffect(() => {
        let client = new WebTorrent();

        client.on('error', err => {
            console.log('[+] Webtorrent error: ' + err.message);
        });
        const magnetURI = "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent";
        window.torrentClient = client;

        const download = () => {
            client.add(magnetURI, (torrent) => {
                const interval = setInterval(() => {
                    // console.log('[+] Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
                    setTorrentProgress((torrent.progress * 100).toFixed(1) + '%');
                    $.get(streamUrl).done((res, status, xhr) => {
                        setVideoStatus(xhr.status);
                        //console.log(xhr.status);
                    }).fail((res, status, xhr) => {
                        setVideoStatus(xhr.status);
                    });
                }, 500);
                torrent.on('done', () => {
                    console.log('Progress: 100%');
                    clearInterval(interval);
                });
                
                setUpdateInterval(interval);
                setTorrent(torrent);
                // TODO Figure out a better way to render these files 
                torrent.files.map((file, i) => {
                    console.log("FILE " + i, file);
                    if (file.name.endsWith(".mp4")) {
                        file.streamTo(videoRef.current);
                        const stream = videoRef.current.src;
                        //console.log("WOW I HAVE A STREAM URL???", streamUrl)
                        setStreamUrl(stream);
                    }
                })
            });
        }

        navigator.serviceWorker.register('/sw.min.js').then(reg => {
            const worker = reg.active || reg.waiting || reg.installing
            function checkState (worker) {
                return worker.state === 'activated' && client.createServer({ controller: reg }) && download();
            }
            if (!checkState(worker)) {
                worker.addEventListener('statechange', ({ target }) => checkState(target))
            }
        });
    }, []);

    const cancelTorrent = () => {
        torrent.destroy({destroyStore:true});
        setTorrent(null);
        setTorrentProgress("0%");
        clearInterval(updateInterval);
        setUpdateInterval(null);
        //unregister();
    }

    return <div className='torrent-stream-player'>
        <h1>{torrent?.name}</h1>
        <p><b>Torrent Info Hash: </b>{torrent?.infoHash}</p>
        <p><b>Torrent Progress: </b>{torrentProgress}</p>
        <p>{videoStatus}</p>
        <video id="loader" ref={videoRef}/>
        <video id="player" src={videoStatus===200 ? streamUrl : null}/>
        {torrent && <Button color="danger" onClick={cancelTorrent}>Clear torrent</Button>}
    </div>;

};

export default TorrentStreamPlayer;
