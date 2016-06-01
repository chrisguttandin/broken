class WebSocketObserver {

    constructor ({ webSocket }) {
        this._webSocket = webSocket;
    }

    next (value) {
        this.send(value);
    }

    async send (message) {
        message = JSON.stringify(message);

        if (this._webSocket.readyState === WebSocket.OPEN) { // eslint-disable-line no-undef
            return this._webSocket.send(message);
        }

        return new Promise((resolve, reject) => {
            /* eslint-disable indent */
            const handleErrorEvent = ({ error }) => {
                      this._webSocket.removeEventListener('error', handleErrorEvent);
                      this._webSocket.removeEventListener('open', handleOpenEvent);

                      reject(error);
                  };
            const handleOpenEvent = () => {
                      this._webSocket.removeEventListener('error', handleErrorEvent);
                      this._webSocket.removeEventListener('open', handleOpenEvent);

                      resolve(this._webSocket.send(message));
                  };
            /* eslint-enable indent */

            this._webSocket.addEventListener('error', handleErrorEvent);
            this._webSocket.addEventListener('open', handleOpenEvent);
        });
    }

}

export class WebSocketObserverFactory {

    create ({ webSocket }) {
        return new WebSocketObserver({ webSocket });
    }

}
