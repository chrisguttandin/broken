import { createDataChannelObservable } from './factories/data-channel-observable';
import { createDataChannelObserver } from './factories/data-channel-observer';
import { createDataChannelSubjectFactory } from './factories/data-channel-subject-factory';
import { createMaskedDataChannelSubject } from './factories/masked-data-channel-subject';
import { createMaskedWebSocketSubject } from './factories/masked-web-socket-subject';
import { createWebSocketObservable } from './factories/web-socket-observable';
import { createWebSocketObserver } from './factories/web-socket-observer';
import { createWebSocketSubjectFactory } from './factories/web-socket-subject-factory';
import { IDataChannel, IMaskableSubject } from './interfaces';
import { TStringifyableJsonValue } from './types';

export * from './interfaces';
export * from './types';

const createDataChannelSubject = createDataChannelSubjectFactory(
    createDataChannelObservable,
    createDataChannelObserver,
    createMaskedDataChannelSubject
);
const createWebSocketSubject = createWebSocketSubjectFactory(
    createWebSocketObservable,
    createWebSocketObserver,
    createMaskedWebSocketSubject
);

export const connect = (url: string): IMaskableSubject<TStringifyableJsonValue> => {
    return createWebSocketSubject(new WebSocket(url));
};

/**
 * This property is true if the browser supports WebSockets.
 */
export const isSupported = (typeof window !== 'undefined' && 'WebSocket' in window);

export const wrap = (dataChannel: IDataChannel): IMaskableSubject<TStringifyableJsonValue> => {
    return createDataChannelSubject(dataChannel);
};
