import server from './app/server';
import connectToDb from './db/mongoose';

(async () => {
    try {
        if (!process.env.PORT) {
            throw new Error('Environment variable PORT is undefined.');
        }

        await connectToDb();

        server.listen(process.env.PORT, () => {
            console.log(`Server is up on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
