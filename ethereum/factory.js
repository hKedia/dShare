import web3 from "./web3";
import FileFactory from "./build/FileFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FileFactory.interface),
  "0xc46Fc425dF353Fb7270053e31a9C8D1cfBDC21A9"
);

export default instance;
