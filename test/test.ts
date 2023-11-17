import {IPty, IPtyForkOptions, spawn} from 'node-pty'

const args =['exec', '-it', 'redis', 'bash']
const options = {
    name: 'xterm-color',
    cols: 80,
    rows: 30
}
const pty: IPty = spawn('docker', args, options)

pty.onData((e: string) => {
    console.log(e)
})

pty.onExit((e: any) => {
    console.log(e)
})