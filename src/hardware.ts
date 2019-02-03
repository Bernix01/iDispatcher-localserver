import { Server } from "net";
import { setupFaucet, toggleFauce } from "./faucet";
import { setupRfidReceiver } from "./rfid";
import { setupScale } from "./scale";

export class Hardware {
  private comChannel: SocketIO.Server;
  private scale: boolean;
  private rfidReceiver: Server;

  public use(comChannel: SocketIO.Server) {
    this.comChannel = comChannel;
  }

  public bootstrap() {
    setupFaucet();
    this.scale = setupScale(this.comChannel);
    this.comChannel.on("faucet", this.toggleFaucet);
    this.rfidReceiver = setupRfidReceiver(this.comChannel);
    this.rfidReceiver.on("listening", () => {
      // tslint:disable-next-line:no-console
      console.log(`RFID Server listening`);
    });
    this.rfidReceiver.listen("/tmp/example.sock");
  }

  private toggleFaucet(event: any) {
    toggleFauce(event.data);
    // tslint:disable-next-line:no-console
    console.log(event);
  }
}
