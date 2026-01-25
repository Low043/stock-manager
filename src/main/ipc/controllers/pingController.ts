import { TemplateController } from '../_template';

export default class PingController extends TemplateController {
    routes = {
        'ping': this.onPing.bind(this),
    }
    
    private onPing(): void {
        console.log('Pong');
    }
}