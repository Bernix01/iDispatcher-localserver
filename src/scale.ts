import Readline from "@serialport/parser-readline";
import SerialPort from "serialport";

export class Scale {
  private online = true;
  private port: SerialPort;
  private parser: NodeJS.WritableStream;
  private comChannel: SocketIO.Server;

  public setup(comChannel: SocketIO.Server): boolean {
    this.comChannel = comChannel;
    this.connect();
    return true;
  }

  public connect() {
    this.port = new SerialPort(
      "/dev/ttyACM0",
      {
        baudRate: 9600
      },
      (error) => {
        // tslint:disable-next-line:no-console
        console.log("NO_SCALE", error);
        this.online = false;
        this.emitStatus();
      }
    );
    this.parser = this.port.pipe((new Readline({
      delimiter: "\n"
    }) as unknown) as NodeJS.WritableStream);
    this.parser.on("data", (data) => {
      if (!this.comChannel) {
        return;
      }
      this.online = true;
      this.comChannel.emit("SCALE", data);
    });
    this.emitStatus();
  }

  private emitStatus() {
    if (!this.comChannel) {
      return;
    }
    this.comChannel.emit("STATUS", { scale: this.online });
  }
  get status() {
    return this.online;
  }
}
