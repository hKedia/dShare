import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0xaA94369647c82DCD1e8Bc52ac5BD05A8F80d5989"
);

export default instance;
