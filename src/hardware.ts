import { Server } from "net";
import { setupFaucet, toggleFauce } from "./faucet";
import { setupRfidReceiver } from "./rfid";
import { Scale } from "./scale";

export default function(): Hardware {
  return new Hardware();
}

class Hardware {
  private scale: Scale = new Scale();
  private rfidReceiver: Server;
  private comChannel: SocketIO.Server;

  constructor() {
    // tslint:disable-next-line:no-console
    console.log("constructor()");
    this.scale = new Scale();
    // tslint:disable-next-line:no-console
    console.log(this.scale);
  }
  public use(comChannel: SocketIO.Server) {
    this.comChannel = comChannel;
  }

  public bootstrap() {
    setupFaucet();
    this.scale.setup(this.comChannel);
    const self = this;
    this.comChannel.on("connection", (socket: SocketIO.Socket) => {
      // tslint:disable-next-line:no-console
      console.log("Client connected");
      this.comChannel.emit("STATUS", { scale: self.scale.status, rfid: "boo" });
      socket.on("FAUCET", toggleFauce);
      socket.on("RECONNECT_SCALE", () => {
        self.scale.connect();
      });
    });
    this.rfidReceiver = setupRfidReceiver(this.comChannel);
    this.rfidReceiver.on("listening", () => {
      // tslint:disable-next-line:no-console
      console.log(`RFID Server listening`);
    });
    this.rfidReceiver.listen("/tmp/example.sock");
  }
}
