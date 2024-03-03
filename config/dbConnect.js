import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected ...');
        // console.log('MongoDB connected ', (await connected).connection.host);
    } catch (error) {
        console.log('Error connecting to database: ', error.message);
        process.exit(1);
    }
}

export default dbConnect; 