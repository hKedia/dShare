import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0x4FE94117446B3A4203Df678C5d9E4df6d9aF2fD9"
);

export default instance;
