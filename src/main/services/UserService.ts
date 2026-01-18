import { DatabaseConnection, DrizzleDatabase } from '../database';
import { users, User, NewUser } from '../database';
import { singleton } from 'tsyringe';
import { eq } from 'drizzle-orm';

@singleton()
export class UserService {
    private readonly db: DrizzleDatabase;

    constructor(connection: DatabaseConnection) {
        this.db = connection.query();
    }

    public create(data: NewUser): User {
        const result = this.db.insert(users).values(data).returning().get();
        return result;
    }

    public findById(id: number): User | undefined {
        return this.db.select().from(users).where(eq(users.id, id)).get();
    }

    public findByName(name: string): User | undefined {
        return this.db.select().from(users).where(eq(users.name, name)).get();
    }

    public findAll(): User[] {
        return this.db.select().from(users).all();
    }

    public update(id: number, data: Partial<NewUser>): User | undefined {
        return this.db.update(users).set(data).where(eq(users.id, id)).returning().get();
    }

    public delete(id: number): void {
        this.db.delete(users).where(eq(users.id, id)).run();
    }
}
