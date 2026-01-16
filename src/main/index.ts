import 'reflect-metadata';
import { container } from 'tsyringe';
import { App } from './App';

const app = container.resolve(App);
app.start();
