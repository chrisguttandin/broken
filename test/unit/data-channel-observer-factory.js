import 'reflect-metadata';
import { DataChannelMock } from '../mock/data-channel';
import { DataChannelObserverFactory } from '../../src/data-channel-observer-factory';
import { ReflectiveInjector } from '@angular/core';

describe('DataChannelObserver', () => {

    var dataChannel,
        dataChannelObserver;

    beforeEach(() => {
        var dataChannelObserverFactory,
            injector;

        injector = ReflectiveInjector.resolveAndCreate([
            DataChannelObserverFactory
        ]);

        dataChannelObserverFactory = injector.get(DataChannelObserverFactory);

        dataChannel = new DataChannelMock();
        dataChannelObserver = dataChannelObserverFactory.create({ dataChannel });
    });

    describe('next()', () => {

        var value;

        beforeEach(() => value = 'a fake value');

        describe('with a connecting data channel', () => {

            beforeEach(() => dataChannel.readyState = 'connecting');

            it("should wait with sending a given value as message to the data channel until it's open", () => {
                dataChannelObserver.next(value);

                expect(dataChannel.send).to.have.not.been.called;

                dataChannel.readyState = 'open';
                dataChannel.dispatchEvent({ type: 'open' });

                expect(dataChannel.send).to.have.been.calledOnce;
                expect(dataChannel.send).to.have.been.calledWithExactly(`"${ value }"`);
            });

        });

        describe('with an open data channel', () => {

            beforeEach(() => dataChannel.readyState = 'open');

            it('should send a given value as message to the data channel', () => {
                dataChannelObserver.send(value);

                expect(dataChannel.send).to.have.been.calledOnce;
                expect(dataChannel.send).to.have.been.calledWithExactly(`"${ value }"`);
            });

        });

        describe('with data channel which supports "bufferedamountlow" events', () => {

            beforeEach(() => {
                dataChannel.bufferedAmount = 2049;
                dataChannel.bufferedAmountLowThreshold = 2048;
                dataChannel.readyState = 'open';
            });

            it('should wait with sending a given value as message to the data channel until its buffered amount of data is below the threshold', () => {
                dataChannelObserver.send(value);

                expect(dataChannel.send).to.have.not.been.called;

                dataChannel.bufferedAmount = 2047;
                dataChannel.dispatchEvent({ type: 'bufferedamountlow' });

                expect(dataChannel.send).to.have.been.calledOnce;
                expect(dataChannel.send).to.have.been.calledWithExactly(`"${ value }"`);
            });

        });

    });

    describe('send()', () => {

        var message;

        beforeEach(() => message = 'a fake message');

        describe('with a connecting data channel', () => {

            beforeEach(() => dataChannel.readyState = 'connecting');

            it("should wait with sending a given message to the data channel until it's open", (done) => {
                dataChannelObserver
                    .send(message)
                    .then(() => {
                        expect(dataChannel.send).to.have.been.calledOnce;
                        expect(dataChannel.send).to.have.been.calledWithExactly(`"${ message }"`);

                        done();
                    });

                expect(dataChannel.send).to.have.not.been.called;

                dataChannel.readyState = 'open';
                dataChannel.dispatchEvent({ type: 'open' });
            });

        });

        describe('with an open data channel', () => {

            beforeEach(() => dataChannel.readyState = 'open');

            it('should send a given message to the data channel', (done) => {
                dataChannelObserver
                    .send(message)
                    .then(() => {
                        expect(dataChannel.send).to.have.been.calledOnce;
                        expect(dataChannel.send).to.have.been.calledWithExactly(`"${ message }"`);

                        done();
                    });
            });

        });

        describe('with data channel which supports "bufferedamountlow" events', () => {

            beforeEach(() => {
                dataChannel.bufferedAmount = 2049;
                dataChannel.bufferedAmountLowThreshold = 2048;
                dataChannel.readyState = 'open';
            });

            it('should wait with sending a given message to the data channel until its buffered amount of data is below the threshold', (done) => {
                dataChannelObserver
                    .send(message)
                    .then(() => {
                        expect(dataChannel.send).to.have.been.calledOnce;
                        expect(dataChannel.send).to.have.been.calledWithExactly(`"${ message }"`);

                        done();
                    });

                expect(dataChannel.send).to.have.not.been.called;

                dataChannel.bufferedAmount = 2047;
                dataChannel.dispatchEvent({ type: 'bufferedamountlow' });
            });

        });

    });

});
