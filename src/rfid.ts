import net from "net";

export const setupRfidReceiver = (comChannel: SocketIO.Server): net.Server => {
  return net.createServer((client) => {
    let chunks: Buffer[] = [];
    client.setEncoding("utf8");
    client.on("end", () => {
      comChannel.emit("RFID_STATUS", "Disconnected");
    });
    client.on("data", (chunk) => {
      if (chunk.toString().match(/\n/)) {
        const data = chunks.join("");
        chunks = [];
        comChannel.emit("LOGIN", data);
      }
      chunks.push(chunk);
    });
  });
};
