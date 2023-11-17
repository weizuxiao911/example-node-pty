import { WebSocketGateway } from "@nestjs/websockets"
import { WebsocketGateway } from "./websocket.gateway"

export const WsController = (path?: string): ClassDecorator => {
  return (target) => {
    console.log('Decorating class:', target)
    // extends websocketgateway
    Object.setPrototypeOf(target.prototype, WebsocketGateway.prototype)
    return WebSocketGateway({ path: path ?? '' })(target)
  };
};

export const Subscribe = (event: 'connect' | 'message' | 'close'): MethodDecorator => {
  return (target: any, property: string) => {
    console.log('Decorating method:', property);
    Reflect.defineMetadata(event, true, target, property);
  }
}