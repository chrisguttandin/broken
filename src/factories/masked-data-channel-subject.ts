import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { AnonymousSubject } from 'rxjs/Subject';
import { IMaskableSubject, IMaskedDataChannelSubjectFactoryOptions, IStringifyableJsonObject } from '../interfaces';
import { TParsedJsonValue, TStringifyableJsonValue } from '../types';

export class MaskedDataChannelSubject<TMessage extends TStringifyableJsonValue>
        extends AnonymousSubject<TMessage>
        implements IMaskableSubject<TMessage> {

    private _mask: TParsedJsonValue;

    private _maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

    constructor ({ mask, maskableSubject }: IMaskedDataChannelSubjectFactoryOptions) {
        const maskedDataChannelSubject = maskableSubject
            .asObservable()
            .filter((message: TStringifyableJsonValue) => Object
                .keys(mask)
                .every((key) => {
                    const maskValue = JSON.stringify((<IStringifyableJsonObject> mask)[key]);
                    const messageValue = JSON.stringify((<IStringifyableJsonObject> message)[key]);

                    return maskValue === messageValue;
                }))
            .map(({ message }: { message: TMessage }) => message);

        super(maskableSubject, maskedDataChannelSubject);

        this._mask = mask;
        this._maskableSubject = maskableSubject;
    }

    public close () {
        this._maskableSubject.close();
    }

    public mask<TMessage extends TStringifyableJsonValue> (mask: TParsedJsonValue): MaskedDataChannelSubject<TMessage> {
        return new MaskedDataChannelSubject<TMessage>({ mask, maskableSubject: this });
    }

    public next (value: TMessage) {
        this.send(value);
    }

    public send (value: TMessage) {
        return this._maskableSubject.send(Object.assign({}, this._mask, { message: value }));
    }

}

export class MaskedDataChannelSubjectFactory {

    public create<TMessage extends TStringifyableJsonValue>
            ({ mask, maskableSubject }: IMaskedDataChannelSubjectFactoryOptions): MaskedDataChannelSubject<TMessage> {
        return new MaskedDataChannelSubject<TMessage>({ mask, maskableSubject });
    }

}
