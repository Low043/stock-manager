import { ClientService } from '../../services/ClientService';
import { TemplateController } from './_template';
import { singleton } from 'tsyringe';

@singleton()
export default class PingController extends TemplateController {
    routes = {
        'ping': this.onPing.bind(this)
    };

    constructor(private readonly clientService: ClientService) {
        super();
    }

    private async onPing(): Promise<void> {
        await this.clientService.createClient({ name: 'ping-client' });
        const allClients = await this.clientService.getAllClients();
        console.log('All Clients:', allClients);
    }
}
