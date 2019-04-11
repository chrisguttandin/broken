import { TDataChannelObservableFactory } from './data-channel-observable-factory';
import { TDataChannelObserverFactory } from './data-channel-observer-factory';
import { TDataChannelSubjectFactory } from './data-channel-subject-factory';

export type TDataChannelSubjectFactoryFactory = (
    createDataChannelObservable: TDataChannelObservableFactory,
    createDataChannelObserver: TDataChannelObserverFactory
) => TDataChannelSubjectFactory;
