import rpio from "rpio";
import config from "./config";

export const setupFaucet = () =>
  // Set faucet pin to out
  rpio.open(config.faucet, rpio.OUTPUT, rpio.LOW);

export const toggleFauce = (status: boolean) =>
  rpio.write(config.faucet, status ? rpio.HIGH : rpio.LOW);
