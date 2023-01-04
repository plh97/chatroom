import { connect } from "mongoose";
import { MONGODB_ADDRESS } from "@/config";

const db = connect(MONGODB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((e) => {
    console.log("connect mongodb success!");
    return e;
  })
  .catch((error) => {
    console.log(error);
  });

export default db;
