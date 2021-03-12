import mongoose, { Document, Model, Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';
import IUrl from './../../../../types/url';

// Define document methods
export interface IUrlDocument extends Document, IUrl {
}

// Define model statics
export interface IUrlModel extends Model<IUrlDocument> {
}

// TODO test validators
// https://mongoosejs.com/docs/validation.html#validation
// https://mongoosejs.com/docs/api.html#schematype_SchemaType-validate
// https://stackoverflow.com/questions/23760253/mongoose-custom-validation-using-2-fields

const urlSchema = new Schema({
    slug: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        validate(value: string): any {
            const regex = /[\w\-]/i;
            return (value == null || value.trim().length < 1 || regex.test(value));
        }
    },
    url: {
        type: String,
        require: true,
        trim: true,
        validate(value: string): any {
            if (!validator.isURL(value, {
                protocols: ['http', 'https'], // FTP is allowed by default
                require_protocol: true,
                require_valid_protocol: true,
            })) {
                throw new Error('Invalid url format');
            }
        }
    }
});

urlSchema.plugin(mongooseUniqueValidator);

export const Url = mongoose.model<IUrlDocument, IUrlModel>('Url', urlSchema);
export default Url;
