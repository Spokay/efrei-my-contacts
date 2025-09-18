import mongoose from 'mongoose';

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('Already connected');
            return;
        }

        try {
            const mongoUri = MONGODB_URI;

            if (!mongoUri) {
                throw new Error('MONGODB_URI environment variable is not set');
            }

            await mongoose.connect(mongoUri);

            this.isConnected = true;
            console.log('Successfully connected to MongoDB');

            // Handle connection events
            mongoose.connection.on('error', (error) => {
                console.error('MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
                this.isConnected = false;
            });

            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });

        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    public getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

export const databaseConnection = DatabaseConnection.getInstance();