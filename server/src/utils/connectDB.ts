import mongoose from "mongoose";

function connectDB() {
  let MONGO_URL =
    process.env.MONGO_URL || "mongodb://localhost:27017/quickheal";
  return new Promise<void>(async (resolve, reject) => {
    await mongoose
      .connect(MONGO_URL)
      .then(() => {
        console.log("MongoDB connected!");
        resolve();
      })
      .catch((e) => {
        console.log(e);
        reject();
      });
  });
}

export default connectDB;
