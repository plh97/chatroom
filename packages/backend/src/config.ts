import * as md5 from "md5";

// const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

export const privateKey =
  process.env.PRIVATE_KEY ||
  Buffer.from(md5(String(Math.random()))).toString("base64");
export const personIcon = "/naruto2.jpeg";
export const roomIcon =
  "https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_UY1200_CR93,0,630,1200_AL_.jpg";

const MONGODB_IP = process.env.MONGODB_IP ?? "127.0.0.1";

export const MONGODB_ADDRESS = `mongodb://${MONGODB_IP}:27017`;
