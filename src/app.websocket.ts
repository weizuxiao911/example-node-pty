import { WebSocket } from "ws"
import { IPty, spawn } from "node-pty"
import { Subscribe, WsController } from "./websocket/webscoket.decorator"

@WsController('/exec')
export class AppWebsocket {

    constructor(

    ) { }

    @Subscribe('connect')
    async handleConnect(socket: WebSocket, request: any) {
        // const args = ['exec', '-it', 'redis', 'bash']
        const args = []
        const options = {
            name: 'xterm-color',
            cols: 80,
            rows: 30
        }
        // const pty: IPty = spawn('docker', args, options)
        const pty: IPty = spawn('sh', [], options)
        pty.onData((e: string) => {
            socket?.send(e)
        })
        pty.onExit((e: any) => {
            socket?.close(3001)
        })
        socket['term'] = pty
    }

    @Subscribe('message')
    async handleMessage(socket: WebSocket, message: Buffer) {
        const pty: IPty = socket['term']
        const data = `${message}`
        const matches = data.match(/^#resize (\d+) (\d+)#$/)
        if (matches) {
            const cols = Number(matches[1] ?? '80')
            const rows = Number(matches[2] ?? '30')
            pty?.resize(cols, rows)
            return
        }
        pty?.write(`${message}`)
    }

    @Subscribe('close')
    async handleClose(socket: WebSocket, code: number) {
        const pty: IPty = socket['term']
        pty?.kill()
    }
}
