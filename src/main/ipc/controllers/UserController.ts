import { UserService } from '../../services/UserService';
import { User } from '../../database';
import { BaseController, IPCRoute } from './_template';
import { Controller } from '../decorators';

@Controller()
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
    }

    public routes(): IPCRoute[] {
        return [
            { channel: 'user:create', handler: this.create.bind(this) },
            { channel: 'user:list', handler: this.list.bind(this) },
            { channel: 'user:delete', handler: this.delete.bind(this) }
        ];
    }

    private create(): User[] {
        this.userService.create({
            name: `User_${Date.now()}`,
            password: 'senha123'
        });

        return this.list();
    }

    private list(): User[] {
        return this.userService.findAll();
    }

    private delete(_event: unknown, ...args: unknown[]): void {
        const id = args[0] as number;
        this.userService.delete(id);
    }
}
