import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0xA6f9531E4152e8858bB4fBbC7B06a9A05d4Acc3b"
);

export default instance;
