import Readline from "@serialport/parser-readline";
import SerialPort from "serialport";

export const setupScale = (comChannel: SocketIO.Server): boolean => {
  try {
    const port = new SerialPort("/dev/ttyACM0", {
      baudRate: 9600
    });

    const parser = port.pipe((new Readline({
      delimiter: "\n"
    }) as unknown) as NodeJS.WritableStream);
    parser.on("data", (data: string) => {
      // send data
      comChannel.emit("scale", data);
    });
    return true;
  } catch (error) {
    return false;
  }
};
