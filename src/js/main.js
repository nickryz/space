window.addEventListener('DOMContentLoaded', init);
 
import {Pageslide} from './pageslide/pageslide.js'
 
function init () {

    let slide = new Pageslide({
        pagesGroupId: '.mainpage-group', // sellector with pages group
        scroll: {                        // scroll options
            step: 100,
            unit: '%'
        },                
        transition: {                    // transition options
            transitionStatus: true,
            transitionDelay: 1,
            transitionType: 'ease-in'
        }
    });
}









