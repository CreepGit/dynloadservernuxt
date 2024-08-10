const clients: Record<string, any> = {}

export function updateClients(...urls: string[]) {
    for (const url of urls) { // Use 'for...of' to iterate over the values
        for (const id in clients) {
            clients[id].send({
                type: "update",
                target: url,
            });
        }
    }
}

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
        clients[peer.id] = peer;
    },

    message(peer, message) {
        console.log("[ws] message", peer, message);
        if (message.text().includes("ping")) {
            peer.send("pong");
        }
    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
        delete clients[peer.id];
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
});