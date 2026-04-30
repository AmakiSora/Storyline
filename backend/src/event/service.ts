import { Injectable } from '@nestjs/common';
import { Event } from './model';
import { EventInput } from '../dto/input';

@Injectable()
export class EventService {
  private events: Event[] = [
    { id: '1', title: 'JAY', date: '2000-11-07', content: '首专发布', person: 'Jay', type: 'album' }
  ];
  list(person?: string, type?: string) { return this.events.filter((e) => (!person || e.person === person) && (!type || e.type === type)); }
  upsert(input: EventInput) { const i = this.events.findIndex((e) => e.id === input.id); if (i < 0) this.events.push(input); else this.events[i] = input; return input; }
  remove(id: string) { this.events = this.events.filter((e) => e.id !== id); return true; }
}
