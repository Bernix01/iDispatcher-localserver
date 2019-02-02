import net from "net";

export const setupRfidReceiver = (comChannel: SocketIO.Server): net.Server => {
  return net.createServer((client) => {
    const chunks: string[] = [];
    client.setEncoding("utf8");

    client.on("end", () => {
      comChannel.emit("RFID_STATUS", "Disconnected");
    });

    client.on("data", (chunk: string) => {
      if (chunk.match(/\r\n$/)) {
        const data = chunks.join("");
        comChannel.emit("login", data);
      }
    });
  });
};
