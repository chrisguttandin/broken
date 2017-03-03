import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IWebSocketObservableFactoryOptions } from '../interfaces';

export class WebSocketObservable<T> extends Observable<T> {

    constructor ({ webSocket }: IWebSocketObservableFactoryOptions) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = ({ error }: ErrorEvent) => observer.error(error);
            const handleMessageEvent = ({ data }: MessageEvent) => {
                try {
                    observer.next(JSON.parse(data));
                } catch (err) {
                    observer.next(data);
                }
            };

            webSocket.addEventListener('close', handleCloseEvent);
            webSocket.addEventListener('error', handleErrorEvent);
            webSocket.addEventListener('message', handleMessageEvent);

            return () => {
                webSocket.removeEventListener('close', handleCloseEvent);
                webSocket.removeEventListener('error', handleErrorEvent);
                webSocket.removeEventListener('message', handleMessageEvent);
            };
        });
    }

}

@Injectable()
export class WebSocketObservableFactory {

    public create ({ webSocket }: IWebSocketObservableFactoryOptions) {
        return new WebSocketObservable({ webSocket });
    }

}
