import React from 'react';
import { Row, Col, Card, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';

export const TorrentPreviewCard = ({torrent}) => {

    return <Card className='torrent-preview' id={torrent.title}>
        <CardHeader>
            {torrent.title}
        </CardHeader>
        <ListGroup>
            <ListGroupItem>
                {torrent.provider}
            </ListGroupItem>
            <ListGroupItem>
                {torrent.seeds}
            </ListGroupItem>
            <ListGroupItem>
                {torrent.size}
            </ListGroupItem>
            <ListGroupItem>
                {torrent.desc}
            </ListGroupItem>
        </ListGroup>
    </Card>;

}

const TorrentList = ({torrents}) => {
    if (!torrents) return null;
    return <Row className='torrent-list'>
        {torrents.map(torrent => <Col md={3} key={torrent.title+torrent.desc}>
            <TorrentPreviewCard torrent={torrent}/>
        </Col>)}
    </Row>
};

export default TorrentList;