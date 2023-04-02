import { Server, Socket} from 'socket.io';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let socketIoPostObject: Server;

export class SocketIoPostHandler {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        socketIoPostObject = io;
    }

    public listen(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.io.on('connection', (socket: Socket) => {
            console.log('Posts Socket IO Handler');
        });
    }
}
