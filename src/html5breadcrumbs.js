/*
 HTML5Breadcrumbs
 Copyright 2010 - 2011 D. Rimron <darran@xalior.com>
*/
var html5breadcrumbs = function(){
    var dbName = 'html5breadcrumbs';
    var version = '1.0';
    var dbTable = 'html5crumbs';
    var displayName = 'HTML5CRUMBS';
    var maxSize = 1024*1024*5; //Upto 5MB for logfiles....
    var db = null;

    var defaultErrorHandle = function(tx,error){ console.log(error.message); }
    var defaultDataHandle = function(result){ console.log(result); }

    var now = function() { return new Date().getTime(); }

    return {
        go: function() {
            var setupTable = function(tx,error) {
                tx.executeSql("CREATE TABLE "+ dbTable + " (url TEXT, timestamp REAL)", [], function(result) {}, defaultErrorHandle);
            }

            if (window.openDatabase) {
                db = openDatabase(dbName, version, displayName, maxSize);
                db.transaction(function(tx) {
                    var url = document.URL;
                    tx.executeSql("INSERT INTO " + dbTable + " (url,timestamp) VALUES (?,?)",[url,now()],defaultDataHandle,defaultErrorHandle);
                }); // okay! log that URL!
                var head = document.getElementsByTagName('head')[0],
                    style = document.createElement('style'),
                    rules = document.createTextNode('#html5breadcrumb_toggle{background:rgba(0,0,0,0.75);border-bottom:1px solid rgba(255,255,255,0.75);border-left:1px solid rgba(255,255,255,0.75);border-radius:0 0 10px 10px;border-right:1px solid rgba(255,255,255,0.75);border-top:none;color:rgba(255,255,255,0.75);font-size:30px;height:30px;position:absolute;right:60px;text-align:center;top:0;vertical-align:middle;width:30px;padding-top: 5px}');

                style.type = 'text/css';
                if(style.styleSheet)
                    style.styleSheet.cssText = rules.nodeValue;
                else
                    style.appendChild(rules);
                head.appendChild(style);
                var body = document.getElementsByTagName('body')[0],
                    button = document.createElement('div');
                if( button.attachEvent ){
                    button.attachEvent('onclick', 'html5breadcrumbs.show()');
                } else {
                    button.setAttribute('onclick', 'html5breadcrumbs.show()'); 
                }
                button.id = "html5breadcrumb_toggle";
                button.innerHTML = "<span>+</span>";
                body.appendChild(button);
            } else {
                console.log("Error Could not create DB either the DB has exceeded its size limit or you are using the wrong browser.");
            }

            return this;
        },

        show: function() {
            console.log("show");
        },

        hide: function() {
            console.log("hide");
        },

        wipe: function() {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM " + dbTable ,[],defaultDataHandle,defaultErrorHandle);
            });
        },

    }

}().go();
/*
 No, seriously, that's it. You don't need to do anything.
 You have included this file (right?!) and that's it. 

 Everything else is automagic.

 Of course, you can style this for shits and giggles if
 you are overriden with desire. Or a designer. *grin*

 The global object, 'html5breadcrumbs', can also be toyed
 with and generally manipulated in however your want to,
 personally, via the same routines that the UI uses. But
 to see those hooks you best either re-read this file, and
 pay close attention to the returned object (the public API)
 or, for an overall easier time, check the documentation....
*/
