import web3 from "./web3";
import FileInstance from "./build/File.json";

export default address => {
  return new web3.eth.Contract(JSON.parse(FileInstance.interface), address);
};
