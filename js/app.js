(function (d) {
    oo.define({                             // define the global application settings
        "viewportSelector": "#viewport"     // on which node the viewport will be attached (if none the default is body)
    });

    oo.createController('IndexController', {    // create a controller with a single action named indexAction
        indexAction : function indexAction(params){     // the params contains the optionnaly given url params
            var v = this.getViewport(), slide = (params.slide || 0), mainStage = v.getStage('main');

            if (!mainStage || !mainStage[slide]) {          // mainStage should contains a list of panels and mainStage[slide] should contains an identifier string that refer to the panel
                oo.createPanelClass({                       // it seems the asked panel doesn't exists, create it - note this will return a class that you shloud not implement by your self
                    id: oo.generateId(),
                    init: function init () {                // is automatically called after the constructor.
                        this.setTemplate(d.querySelector("#" + data[slide].tpl).text);
                        this.setData(data[slide].data);
                    }
                }, {stage: 'main', pos: slide});            // where should it place the panel
                mainStage = v.getStage('main');
            }
            v.switchPanel(mainStage[slide]);            // hide the currently active panel and show the one identified by the value of mainStage[slide]
        }
    });

    oo.bootstrap(function (oo) {
        var r = oo.getRouter(), baseUrl = 'index/index/slide/'; r.init(); // if no configuration is provided to the router, the default route building method is [ControllerName]/[ActionName]/param1/value1/...

        function getCurrentSlide() {
            return parseInt(d.location.hash.replace('#' + baseUrl, ''), 10) || 0;   // extract the parameter "slide nummber" from the url hash
        }
        function goNext() {
            r.load(baseUrl+ (getCurrentSlide() + 1));                               // triggers a navigation to the next slide
        }
        function goPrevious() {
            r.load(baseUrl+ (getCurrentSlide() - 1));                               // triggers a navigation to the previous slide
        }

        function onSwipe(e) {
            ('swipeRight' == e.type ? goPrevious : 'swipeLeft' == e.type ? goNext : new Function())();      // trigger a navigation depending on the direction of the swype action
        }
        d.addEventListener('swipeLeft', onSwipe);                                                           // listen for swype* events (generated by yellowjs)
        d.addEventListener('swipeRight', onSwipe);

        oo.createElement('button', { el: '#next', onrelease: goNext });                                     // create buttons attached it to the nodes #next and #prev
        oo.createElement('button', { el: '#prev', onrelease: goPrevious });                                 // also attache a callback for each one

        d.addEventListener('keyup', function (e) {                                                          // manage keyboard input
            (37 == e.keyCode ? goPrevious : 39 == e.keyCode ? goNext : new Function())();
        });
    });
})(document);