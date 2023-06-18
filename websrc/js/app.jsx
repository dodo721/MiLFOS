import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import MainDiv from './components/MainDiv';
import register from './util/registerServiceWorker';

// Import root LESS file so webpack finds & renders it out to main.css
import '../style/main.less';

// global jquery for You-Again
window.$ = $;


ReactDOM.render(
	<MainDiv />,
	document.getElementById('mainDiv')
);
//register();
