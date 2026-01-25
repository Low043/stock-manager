import { PrismaService } from './Prisma';
import { singleton } from 'tsyringe';

@singleton()
export class ClientService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAllClients() {
        return this.prismaService.client.findMany();
    }

    async createClient(data: { name: string }) {
        return this.prismaService.client.create({ data });
    }
}
