import { BaseController, IPCRoute } from './_template';
import { Controller } from '../decorators';

@Controller()
export class SystemController extends BaseController {
    public routes(): IPCRoute[] {
        return [{ channel: 'ping', handler: this.ping.bind(this) }];
    }

    private ping(): string {
        console.log('pong');
        return 'pong';
    }
}
