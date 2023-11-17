import { WebSocketServer } from '@nestjs/websockets'
import { Server, WebSocket } from 'ws'

export abstract class WebsocketGateway {

  @WebSocketServer() server: Server

  afterInit() {
    this.server?.on('connection', (socket: WebSocket, request: any) => {
      const query = this.getQuery(request)
      request['args'] = query
      let c = '', m = '', cl = ''
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      for (const method of methods) {
        Reflect.getMetadata('connect', this, method) && (c = method)
        Reflect.getMetadata('message', this, method) && (m = method)
        Reflect.getMetadata('close', this, method) && (cl = method)
      }
      c && this[c](socket, request)
      socket?.on('message', (message: Buffer) => {
        m && this[m](socket, message)
      })
      socket?.on('close', (code: number) => {
        cl && this[cl](socket, code)
      })
    })

  }

  /**
   * 获取参数
   * @param request 
   */
  private getQuery(request: any): any {
    const map = {}
    const url = request?.url
    // console.log('url', url)
    const args = url?.substring(url?.indexOf('?'))?.split('&')
    for (let arg of args) {
      const a = arg.split('=')
      map[a[0]] = a[1] ?? ''
    }
    return map
  }

}
