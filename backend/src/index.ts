import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);

    if (message.type === 'sender') {
        //@ts-ignore
        senderSocket = ws;
    } else if(message.type === 'receiver'){
        //@ts-ignore
        receiverSocket = ws;
    }else if(message.type === 'createoffer') {
        //@ts-ignore
        if(ws!==senderSocket){
            return
        }
        receiverSocket?.send(JSON.stringify({type: 'createOffer', sdp: message.sdp}))
    } else if(message.type === 'createAnswer'){
        //@ts-ignore
        if(ws!==receiverSocket){
            return
        }

        senderSocket?.send(JSON.stringify({type: 'createAnswer', sdp: message.sdp}))
    } else if(message.type === "iceCandidate"){
        //@ts-ignore
        if(ws === senderSocket){
            receiverSocket?.send(JSON.stringify({type: "iceCandidate", candidate: message.candidate}))
        }
        //@ts-ignore
        else if(ws === receiverSocket){
            senderSocket?.send(JSON.stringify({type: "iceCandidate", candidate: message.candidate}))
        }
    }
    
  });

  ws.send('something');
});