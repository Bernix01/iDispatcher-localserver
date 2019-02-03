import Readline from "@serialport/parser-readline";
import SerialPort from "serialport";

export const setupScale = (comChannel: SocketIO.Server): boolean => {
  const port = new SerialPort(
    "/dev/ttyACM0",
    {
      baudRate: 9600
    },
    () => {
      // tslint:disable-next-line:no-console
      console.log("NO_SCALE");
    }
  );
  const parser = port.pipe((new Readline({
    delimiter: "\n"
  }) as unknown) as NodeJS.WritableStream);
  parser.on("data", (data: string) => {
    // send data
    comChannel.emit("SCALE", data);
  });
  return true;
};
