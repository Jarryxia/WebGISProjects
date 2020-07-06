require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Editor"
], function(WebMap, MapView, Editor) {
    // Create a map from the referenced webmap item id
    let webmap = new WebMap({
        portalItem: {
            id: "6c5d657f1cb04a5eb78a450e3c699c2a"
        }
    });

    let view = new MapView({
        container: "viewDiv",
        map: webmap
    });

    view.when(function() {
        view.popup.autoOpenEnabled = false; //disable popups

        // Create the Editor
        let editor = new Editor({
            view: view
        });

        // Add widget to top-right of the view
        view.ui.add(editor, "top-right");
    });
});