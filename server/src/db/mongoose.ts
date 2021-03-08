import mongoose from 'mongoose';

export const connectToDb = async () => {
    if (!process.env.MONGODB_URI) {
        return new Error('Environment variable MONGODB_URI is undefined.');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        useCreateIndex: true,
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default connectToDb;
