import * as mongoose from "mongoose";

mongoose.connect("mongodb://root:ewqewq@127.0.0.1:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default mongoose;
