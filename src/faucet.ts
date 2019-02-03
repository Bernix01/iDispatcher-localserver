import rpio from "rpio";
import config from "./config";

export const setupFaucet = () => {
  // Set faucet pin to out
  rpio.open(config.faucet, rpio.OUTPUT, rpio.LOW);
  rpio.open(config.pump, rpio.OUTPUT, rpio.LOW);
};

export const toggleFauce = (status: boolean) => {
  rpio.write(config.pump, status ? rpio.HIGH : rpio.LOW);
  rpio.write(config.faucet, status ? rpio.HIGH : rpio.LOW);
};
