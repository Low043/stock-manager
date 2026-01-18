import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import SQLiteDatabase from 'better-sqlite3';
import { singleton } from 'tsyringe';
import * as schema from './_schema';

export type DrizzleDatabase = BetterSQLite3Database<typeof schema>;
export * from './_schema';

@singleton()
export class DatabaseConnection {
    private sqlite: SQLiteDatabase.Database | null = null;
    private drizzle: DrizzleDatabase | null = null;

    public connect(dbPath: string): void {
        this.sqlite = new SQLiteDatabase(dbPath);
        this.sqlite.pragma('journal_mode = WAL');
        this.drizzle = drizzle(this.sqlite, { schema });
        this.runMigrations();
    }

    public query(): DrizzleDatabase {
        return this.drizzle!;
    }

    public disconnect(): void {
        this.sqlite?.close();
    }

    private runMigrations(): void {
        this.sqlite?.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                password TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
}
