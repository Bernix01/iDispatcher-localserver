import { setupFaucet, toggleFauce } from "./faucet";
import { setupRfidReceiver } from "./rfid";
import { setupScale } from "./scale";

export class Hardware {
  private comChannel: SocketIO.Server;
  private scale: boolean;
  private rfidReceiver: net.Server;

  public use(comChannel: SocketIO.Server) {
    this.comChannel = comChannel;
  }

  public bootstrap() {
    setupFaucet();
    this.scale = setupScale(this.comChannel);
    this.comChannel.on("faucet", this.toggleFaucet);
    this.rfidReceiver = setupRfidReceiver(this.comChannel);
  }

  private toggleFaucet(event: any) {
    // tslint:disable-next-line:no-console
    console.log(event);
  }
}
