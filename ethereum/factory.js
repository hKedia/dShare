import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0x7d6D74C356E6ac4B4FEC638764d5231B6C6Ad342"
);

export default instance;
