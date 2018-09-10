import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0xe8FD9E0A4D5278F0169Ba00Fcb9B9815D7F7d767"
);

export default instance;
