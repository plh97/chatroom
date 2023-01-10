import * as fs from "fs";
import { Context } from "koa";
import * as path from "path";
import Mime, { MINE } from "@/utils/mime";

const mime = new Mime();

export const Upload = async (ctx: Context) => {
  const file = ctx.request.files?.file;
  if (!file || Array.isArray(file)) {
    return;
  }
  const ext = mime.getType(file.type as MINE);
  const name = `${Math.random().toString().replace(/0./, "")}.${ext}`;
  const newpath = path.resolve("static", name);
  const topath = fs.createWriteStream(newpath);
  const stream = fs.createReadStream(file.path).pipe(topath);
  await new Promise<void>((resolve) => {
    stream.on("finish", () => {
      resolve();
    });
  });
  ctx.body = {
    code: 0,
    data: `${ctx.request.origin}:8080/${name}`,
  };
};
