/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mapControl = null;

$(document).ready(function () {
    initmap();
});

function initmap() {
    mapControl = new MapControl({
        div: "viewDiv"
    });
}


