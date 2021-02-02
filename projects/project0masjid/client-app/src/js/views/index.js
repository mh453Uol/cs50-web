import 'whatwg-fetch'

import '../../css/stylev2.css';

import {initialize} from '../app-config';
import homeview from './home/home-view'

window.addEventListener('load', function () {

    initialize();

    homeview.initialize();
});