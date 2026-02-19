import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/samarth-dbt';
    
    // Ensure database name is in the connection string
    // If using MongoDB Atlas and database name is missing, add it
    if (mongoUri.includes('mongodb+srv://') && !mongoUri.includes('/samarth-dbt')) {
      // Remove trailing slash and query params, add database name
      const uriParts = mongoUri.split('?');
      const baseUri = uriParts[0].endsWith('/') ? uriParts[0].slice(0, -1) : uriParts[0];
      const queryParams = uriParts[1] ? `?${uriParts[1]}` : '?retryWrites=true&w=majority';
      mongoUri = `${baseUri}/samarth-dbt${queryParams}`;
    }
    
    const options = {
      // Connection pool settings
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Explicitly set database name
      dbName: 'samarth-dbt',
    };
    
    await mongoose.connect(mongoUri, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Check your MONGODB_URI in .env file');
    console.error('   2. Verify your MongoDB Atlas password is correct');
    console.error('   3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.error('   4. Check your internet connection');
    process.exit(1);
  }
};
