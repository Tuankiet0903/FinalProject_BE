import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.MONGOOSE_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
mongoose.set('strictQuery', true);

export default connectDB;
