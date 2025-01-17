import { connect } from 'mongoose';
const connectMongoDB = async () => {
  
  try {
    
    await connect(process.env.MONGO_URI)
    // ,{
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    console.log('MongoDB connected.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit on failure
  }
};
export default connectMongoDB;