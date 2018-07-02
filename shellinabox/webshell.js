// ShellInABox.js -- Use XMLHttpRequest to provide an AJAX terminal emulator.

// #define XHR_UNITIALIZED 0
// #define XHR_OPEN        1
// #define XHR_SENT        2
// #define XHR_RECEIVING   3
// #define XHR_LOADED      4

// IE does not define XMLHttpRequest by default, so we provide a suitable
// wrapper.
$(window).load(function () {
    new ShellInABox();
})

function IsString(str) {
    return (typeof str == 'string') && str.constructor == String;
}

function GetParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

function extend(subClass, baseClass) {
    function inheritance() {
    }
    inheritance.prototype = baseClass.prototype;
    subClass.prototype = new inheritance();
    subClass.prototype.constructor = subClass;
    subClass.prototype.superClass = baseClass.prototype;
}
;

function ShellInABox(url, container) {
    if (url == undefined) {
        this.rooturl = document.location.href;
        this.url = document.location.href.replace(/[?#].*/, '');
    } else {
        this.rooturl = url;
        this.url = url;
    }
    if (document.location.hash != '') {
        var hash = decodeURIComponent(document.location.hash).
                replace(/^#/, '');
        this.nextUrl = hash.replace(/,.*/, '');
        this.session = hash.replace(/[^,]*,/, '');
    } else {
        this.nextUrl = this.url;
        this.session = null;
    }

    this.agentID = GetParams("agentID");
    this.sessionID = GetParams("sessionID");
    this.user = GetParams("user");
    this.host=GetParams("host");
    this.password = GetParams("password");
    this.subServer = GetParams("subServer");
    this.type = GetParams("type");
    //console.log("AgentID:"+this.agentID+",sessionID:"+this.sessionID+",user:"+this.user+",password:"+this.password);
    this.path = window.parent.location.href;

    this.pendingKeys = '';
    this.keysInFlight = false;
    this.connected = false;
    this.superClass.constructor.call(this, container);

    // We have to initiate the first XMLHttpRequest from a timer. Otherwise,
    // Chrome never realizes that the page has loaded.
    setTimeout(function (shellInABox) {
        return function () {
            shellInABox.sendStartReq();
        };
    }(this), 1);
}
;
extend(ShellInABox, VT100);

ShellInABox.prototype.sessionClosed = function () {
    try {
        this.connected = false;
        if (this.session) {
            this.session = undefined;
            if (this.cursorX > 0) {
                this.vt100('\r\n');
            }
            this.vt100('Session closed.');
        }
        //this.showReconnect(true);
    } catch (e) {
    }
};

ShellInABox.prototype.reconnect = function () {
    this.showReconnect(false);
    if (!this.session) {
        if (document.location.hash != '') {
            // A shellinaboxd daemon launched from a CGI only allows a single
            // session. In order to reconnect, we must reload the frame definition
            // and obtain a new port number. As this is a different origin, we
            // need to get enclosing page to help us.
            parent.location = this.nextUrl;
        } else {
            if (this.url != this.nextUrl) {
                document.location.replace(this.nextUrl);
            } else {
                this.pendingKeys = '';
                this.keysInFlight = false;
                this.reset(true);
                this.sendStartReq();
            }
        }
    }
    return false;
};

ShellInABox.prototype.startReqCallback = function (curShell, repStr) {
    try {
        var response = eval('(' + repStr + ')');
        if (response != null && response.result == true)
        {
            curShell.connected = true;
            curShell.session = curShell.sessionID;
            curShell.sendGetOutputReq();
        }
        else
        {
            curShell.connected = false;
            curShell.sessionClosed();
        }
    }
    catch (e)
    {
        console.log(e.toString());
        curShell.sessionClosed();
    }
}

ShellInABox.prototype.sendStartReq = function () {
    var self = this;

    this.terminalStartCmd(function() {
        self.connected = true;
        self.session = self.sessionID;

        var msg = {
            "reqId": 1,
            "cmdstr": '',
            "tmnWidth": 100,
            "tmnHeight": 100
        };
        _terminalWebsocket.sendTerminalMessage(msg);
    });
}

ShellInABox.prototype.keyPressCallback = function (curShell, repStr) {
    try {
        var response = eval('(' + repStr + ')');

        if (response != null && response.result == true)
        {
            curShell.keysInFlight = false;
            if (curShell.pendingKeys) {
                curShell.sendKeys('');
            }
        }
    }
    catch (e) {
        console.log(e.toString());
    }
};

ShellInABox.prototype.sendKeys = function (keys) {
    if (!this.connected) {
        return;
    }
    if (this.keysInFlight || this.session == undefined) {
        this.pendingKeys += keys;
    } else {
        this.keysInFlight = true;
        keys = this.pendingKeys + keys;
        this.pendingKeys = '';
        var msg = {
            "reqId": 1,
            "cmdstr": encodeURIComponent(keys),
            "tmnWidth": 100,
            "tmnHeight": 100
        };
        _terminalWebsocket.sendTerminalMessage(msg);

        this.keysInFlight = false;
        if (this.pendingKeys) {
            this.sendKeys('');
        }
    }
};

ShellInABox.prototype.keysPressed = function (ch) {
    var hex = '0123456789ABCDEF';
    var s = '';
    for (var i = 0; i < ch.length; i++) {
        var c = ch.charCodeAt(i);
        if (c < 128) {
            s += hex.charAt(c >> 4) + hex.charAt(c & 0xF);
        } else if (c < 0x800) {
            s += hex.charAt(0xC + (c >> 10)) +
                    hex.charAt((c >> 6) & 0xF) +
                    hex.charAt(0x8 + ((c >> 4) & 0x3)) +
                    hex.charAt(c & 0xF);
        } else if (c < 0x10000) {
            s += 'E' +
                    hex.charAt((c >> 12)) +
                    hex.charAt(0x8 + ((c >> 10) & 0x3)) +
                    hex.charAt((c >> 6) & 0xF) +
                    hex.charAt(0x8 + ((c >> 4) & 0x3)) +
                    hex.charAt(c & 0xF);
        } else if (c < 0x110000) {
            s += 'F' +
                    hex.charAt((c >> 18)) +
                    hex.charAt(0x8 + ((c >> 16) & 0x3)) +
                    hex.charAt((c >> 12) & 0xF) +
                    hex.charAt(0x8 + ((c >> 10) & 0x3)) +
                    hex.charAt((c >> 6) & 0xF) +
                    hex.charAt(0x8 + ((c >> 4) & 0x3)) +
                    hex.charAt(c & 0xF);
        }
    }
    this.sendKeys(s);
};

ShellInABox.prototype.resized = function (w, h) {
    // Do not send a resize request until we are fully initialized.
    if (this.session) {
        // sendKeys() always transmits the current terminal size. So, flush all
        // pending keys.
        this.sendKeys('');
    }
};

ShellInABox.prototype.toggleSSL = function () {
    if (document.location.hash != '') {
        if (this.nextUrl.match(/\?plain$/)) {
            this.nextUrl = this.nextUrl.replace(/\?plain$/, '');
        } else {
            this.nextUrl = this.nextUrl.replace(/[?#].*/, '') + '?plain';
        }
        if (!this.session) {
            parent.location = this.nextUrl;
        }
    } else {
        this.nextUrl = this.nextUrl.match(/^https:/)
                ? this.nextUrl.replace(/^https:/, 'http:').replace(/\/*$/, '/plain')
                : this.nextUrl.replace(/^http/, 'https').replace(/\/*plain$/, '');
    }
    if (this.nextUrl.match(/^[:]*:\/\/[^/]*$/)) {
        this.nextUrl += '/';
    }
    if (this.session && this.nextUrl != this.url) {
        alert('This change will take effect the next time you login.');
    }
};

ShellInABox.prototype.extendContextMenu = function (entries, actions) {
    // Modify the entries and actions in place, adding any locally defined
    // menu entries.
    var oldActions = [];
    for (var i = 0; i < actions.length; i++) {
        oldActions[i] = actions[i];
    }
    for (var node = entries.firstChild, i = 0, j = 0; node;
            node = node.nextSibling) {
        if (node.tagName == 'LI') {
            actions[i++] = oldActions[j++];
            if (node.id == "endconfig") {
                node.id = '';
                if (typeof serverSupportsSSL != 'undefined' && serverSupportsSSL &&
                        !(typeof disableSSLMenu != 'undefined' && disableSSLMenu)) {
                    // If the server supports both SSL and plain text connections,
                    // provide a menu entry to switch between the two.
                    var newNode = document.createElement('li');
                    var isSecure;
                    if (document.location.hash != '') {
                        isSecure = !this.nextUrl.match(/\?plain$/);
                    } else {
                        isSecure = this.nextUrl.match(/^https:/);
                    }
                    newNode.innerHTML = (isSecure ? '&#10004; ' : '') + 'Secure';
                    if (node.nextSibling) {
                        entries.insertBefore(newNode, node.nextSibling);
                    } else {
                        entries.appendChild(newNode);
                    }
                    actions[i++] = this.toggleSSL;
                    node = newNode;
                }
                node.id = 'endconfig';
            }
        }
    }

};

ShellInABox.prototype.terminalStartCmd = function(callback) {
    try {
        var self = this;
        var strHost;
        if (this.type === 'SSO') {
            strHost = "ws://"+ this.host +"/terminal/-1/" + this.agentID  + "/" + this.sessionID;
            if (location.protocol === 'https:')
               strHost = "wss://"+ this.host +"/terminal/-1/" + this.agentID  + "/" + this.sessionID;
        }
        else {
            strHost = "ws://"+ this.host +"/terminal/" + $.base64.encode(this.user + ":" + this.password) + '/' + this.agentID  + "/" + this.sessionID;
            if (location.protocol === 'https:')
               strHost = "wss://"+ this.host +"/terminal/" + $.base64.encode(this.user + ":" + this.password) + '/' + this.agentID  + "/" + this.sessionID;
        }
        _terminalWebsocket.turnOnTerminal(strHost, callback, function(msg) {
            var response;
            if (msg.data.indexOf('content') !== -1) {
                response = JSON.parse(msg.data).content.terminalTiInfo.terminalContent;
                response = response.replace(/\\\\/g, '\\');
                response = response.replace(/\\b/g, '\b');
                response = response.replace(/\\r\\n|\\n|\\r/g, '\r\n');
                self.vt100(response);
            }
        });
    }
    catch(e) {
    }
}
