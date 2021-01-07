//execute on any browser console (tested in chrome)
var _open = XMLHttpRequest.prototype.open;

//data we want the web server to answer with
var dataInjected = '{ "name":"John", "age":30, "car":null }';

window.XMLHttpRequest.prototype.open = function (method, URL) {
    var _onreadystatechange = this.onreadystatechange,
        _this = this;

    _this.onreadystatechange = function () {
        // catch only completed 'api/search/universal' requests
        //filter by http response status and the URL
        if (_this.readyState === 4 && _this.status === 200 && ~URL.indexOf('/api/v1/curator/playlist/playlists')) {
            try {
				console.log("DEBUG: modifying response");
                //////////////////////////////////////
                // THIS IS ACTIONS FOR YOUR REQUEST //
                //             EXAMPLE:             //
                //////////////////////////////////////
                var data = JSON.parse(_this.responseText); // {"fields": ["a","b"]}

                if (data.fields) {
                    data.fields.push('c','d');
                }

                // rewrite responseText
                //Object.defineProperty(_this, 'responseText', {value: JSON.stringify(dataInjected)});
				Object.defineProperty(_this, 'responseText', {value: dataInjected});
                /////////////// END //////////////////
            } catch (e) {}

            console.log('Caught! :)', method, URL/*, _this.responseText*/);
        }
        // call original callback
        if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
    };

    // detect any onreadystatechange changing
    Object.defineProperty(this, "onreadystatechange", {
        get: function () {
            return _onreadystatechange;
        },
        set: function (value) {
            _onreadystatechange = value;
        }
    });

    return _open.apply(_this, arguments);
};
