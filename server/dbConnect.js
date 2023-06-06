const mongoose = require("mongoose");

module.exports = async () => {
    const mongoUri =
        "mongodb+srv://mohitkhairnar9486:tVrzTaHWu6u8rPjS@cluster0.0d7uivj.mongodb.net/?retryWrites=true&w=majority";

    try {
        const connect = await mongoose.connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
