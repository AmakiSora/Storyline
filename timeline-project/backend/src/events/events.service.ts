import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Event, EventType } from './entities/event.entity'
import { Person } from './entities/person.entity'
import { CreateEventInput } from './dto/create-event.input'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  // ==================== Event CRUD ====================

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['person'],
      order: { date: 'ASC' },
    })
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['person'],
    })
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`)
    }
    return event
  }

  async create(input: CreateEventInput): Promise<Event> {
    // 验证人物存在
    const person = await this.personRepository.findOne({
      where: { id: input.personId },
    })
    if (!person) {
      throw new NotFoundException(`Person with ID ${input.personId} not found`)
    }

    // 检查是否已存在相同日期和标题的事件
    const existing = await this.eventRepository.findOne({
      where: {
        title: input.title,
        date: input.date,
        personId: input.personId,
      },
    })
    if (existing) {
      throw new ConflictException('An event with this title already exists on this date')
    }

    const event = this.eventRepository.create({
      ...input,
      person,
    })

    return this.eventRepository.save(event)
  }

  async update(id: string, input: Partial<CreateEventInput>): Promise<Event> {
    const event = await this.findOne(id)

    // 验证人物存在（如果提供了 personId）
    if (input.personId) {
      const person = await this.personRepository.findOne({
        where: { id: input.personId },
      })
      if (!person) {
        throw new NotFoundException(`Person with ID ${input.personId} not found`)
      }
      event.person = person
      event.personId = input.personId
    }

    // 更新其他字段
    if (input.title !== undefined) event.title = input.title
    if (input.date !== undefined) event.date = input.date
    if (input.content !== undefined) event.content = input.content
    if (input.image !== undefined) event.image = input.image
    if (input.type !== undefined) event.type = input.type

    return this.eventRepository.save(event)
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id)
    await this.eventRepository.remove(event)
  }

  // ==================== Person CRUD ====================

  async findAllPersons(): Promise<Person[]> {
    return this.personRepository.find({
      relations: ['events'],
      order: { name: 'ASC' },
    })
  }

  async findOnePerson(id: string): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['events'],
    })
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`)
    }
    return person
  }

  async createPerson(name: string, color?: string): Promise<Person> {
    // 检查是否已存在
    const existing = await this.personRepository.findOne({
      where: { name },
    })
    if (existing) {
      throw new ConflictException(`Person "${name}" already exists`)
    }

    const person = this.personRepository.create({
      name,
      color: color || this.getRandomColor(),
    })

    return this.personRepository.save(person)
  }

  // 生成随机颜色
  private getRandomColor(): string {
    const colors = [
      '#0ea5e9', // sky
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // emerald
      '#ef4444', // red
      '#6366f1', // indigo
      '#14b8a6', // teal
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
}
