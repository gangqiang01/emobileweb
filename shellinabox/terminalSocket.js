function terminalWebsocket() {
    var _WebSocket = null;
    var wsHost = wsHost;
    this.checkIfClosed = function() {
        if (!_WebSocket)
            return true;
        else if (_WebSocket.readyState === 2 || _WebSocket.readyState === 3)
            return true;
        else
            return false;
    }
    this.getCurrentState = function() {
        if (_WebSocket.readyState === 0)
            return 'CONNECTING';
        else if (_WebSocket.readyState === 1)
            return 'OPEN';
        else if (_WebSocket.readyState === 2)
            return 'CLOSING';
        else
            return 'CLOSED';
    }
    this.turnOnTerminal = function(wsHost, onOpenCallback, onMessageCallback) {
        _WebSocket = new WebSocket(wsHost);
        _WebSocket.onopen = function () {
            onOpenCallback();
        };
        _WebSocket.onmessage = function(msg) {
            onMessageCallback(msg);
        }
        _WebSocket.onerror = function() {
            swal({
                title: 'Error',
                text: 'Websocket is opened failed',
                type: 'error'
            }).catch(swal.noop);
        }
        _WebSocket.onclose = function () {
        };
    }
    this.sendTerminalMessage = function(msg) {
        _WebSocket.send(JSON.stringify(msg));
    }
    this.closeTerminal = function() {
        _WebSocket.close();
    }
}
var _terminalWebsocket = new terminalWebsocket();