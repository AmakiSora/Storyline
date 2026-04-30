import { Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';

const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Jay同名专辑',
    date: '2000-11-07',
    content: '首张专辑《Jay》，开创华语乐坛新风格，包含《可爱女人》《星晴》等经典曲目。',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '范特西专辑',
    date: '2001-09-14',
    content: '第二张专辑《范特西》，包含《双截棍》《简单爱》《爱在西元前》等划时代作品。',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '八度空间专辑',
    date: '2002-07-19',
    content: '第三张专辑《八度空间》，延续前两张专辑的成功。',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '无与伦比演唱会',
    date: '2004-05-01',
    content: '无与伦比世界巡回演唱会台北站，开启首个大型巡演。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '七里香专辑',
    date: '2004-08-03',
    content: '第五张专辑《七里香》，包含《七里香》《借口》《园游会》等热门歌曲。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '十一月的萧邦',
    date: '2005-10-17',
    content: '第六张专辑《十一月的萧邦》，被称为华语乐坛最成功的专辑之一。',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: '依然范特西',
    date: '2006-09-05',
    content: '第七张专辑《依然范特西》，包含《夜的第七章》《千里之外》等。',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: '我很忙专辑',
    date: '2007-11-02',
    content: '第八张专辑《我很忙》，包含《青花瓷》《彩虹》等代表作品。',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    title: '2008年央视春晚',
    date: '2008-02-06',
    content: '在央视春晚表演《青花瓷》，展现中国风音乐魅力。',
    image: 'https://images.unsplash.com/photo-1544531696-b94d9c11b5f8?w=400',
    person: '周杰伦',
    type: '奖项',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    title: '魔杰座专辑',
    date: '2008-10-15',
    content: '第九张专辑《魔杰座》，包含《稻香》《说好的幸福呢》等。',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    title: '超时代演唱会',
    date: '2010-05-28',
    content: '超时代世界巡回演唱会台北站，票房火爆。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    title: '跨时代专辑',
    date: '2010-05-18',
    content: '第十张专辑《跨时代》，包含《烟花易冷》《好久不见》等。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    title: '惊叧叻演唱会',
    date: '2013-05-17',
    content: '魔天伦世界巡回演唱会台北站，现场座无虚席。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '14',
    title: '哎呦，不错哦',
    date: '2014-12-10',
    content: '第十三张专辑《哎呦，不错哦》，数字专辑销量创下纪录。',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '15',
    title: '地表最强演唱会',
    date: '2016-05-28',
    content: '地表最强世界巡回演唱会，跨越多个国家和地区。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '16',
    title: '周杰伦的床边故事',
    date: '2016-06-24',
    content: '第十四张专辑《周杰伦的床边故事》，包含《告白气球》等热门曲目。',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '17',
    title: '嘉年华演唱会',
    date: '2019-12-15',
    content: '嘉年华世界巡回演唱会台北站，开启新一轮巡演。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '18',
    title: '最伟大的作品',
    date: '2022-07-15',
    content: '第十五张专辑《最伟大的作品》，同名歌曲MV创下单日播放纪录。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    person: '周杰伦',
    type: '专辑',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '19',
    title: '2023年演唱会重启',
    date: '2023-05-10',
    content: '嘉年华世界巡回演唱会重新启动，场场爆满。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '20',
    title: '期待新作品',
    date: '2025-01-01',
    content: '新专辑筹备中，敬请期待...',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '生活',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export interface CreateEventInput {
  title: string;
  date: string;
  content?: string;
  image?: string;
  person: string;
  type: string;
}

export interface UpdateEventInput {
  title?: string;
  date?: string;
  content?: string;
  image?: string;
  person?: string;
  type?: string;
}

export interface EventFilter {
  person?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class EventsService {
  private events: Event[] = [...SAMPLE_EVENTS];
  private nextId = 21;

  findAll(filter?: EventFilter): Event[] {
    let result = [...this.events];

    if (filter) {
      if (filter.person) {
        result = result.filter((e) => e.person === filter.person);
      }
      if (filter.type) {
        result = result.filter((e) => e.type === filter.type);
      }
      if (filter.startDate) {
        const startDate = new Date(filter.startDate);
        result = result.filter((e) => new Date(e.date) >= startDate);
      }
      if (filter.endDate) {
        const endDate = new Date(filter.endDate);
        result = result.filter((e) => new Date(e.date) <= endDate);
      }
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  findOne(id: string): Event | undefined {
    return this.events.find((e) => e.id === id);
  }

  create(input: CreateEventInput): Event {
    const now = new Date().toISOString();
    const newEvent: Event = {
      id: (this.nextId++).toString(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.events.push(newEvent);
    return newEvent;
  }

  update(id: string, input: UpdateEventInput): Event | undefined {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return undefined;

    const updated: Event = {
      ...this.events[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.events[index] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    return true;
  }
}
