import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TimelineEvent, TimelineEventInput, ViewMode, FilterOptions, ZoomLevel } from '../types/timeline';

const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    title: 'Jay同名专辑',
    date: new Date('2000-11-07'),
    content: '首张专辑《Jay》，开创华语乐坛新风格，包含《可爱女人》《星晴》等经典曲目。',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '2',
    title: '范特西专辑',
    date: new Date('2001-09-14'),
    content: '第二张专辑《范特西》，包含《双截棍》《简单爱》《爱在西元前》等划时代作品。',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '3',
    title: '八度空间专辑',
    date: new Date('2002-07-19'),
    content: '第三张专辑《八度空间》，延续前两张专辑的成功。',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '4',
    title: '无与伦比演唱会',
    date: new Date('2004-05-01'),
    content: '无与伦比世界巡回演唱会台北站，开启首个大型巡演。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
  },
  {
    id: '5',
    title: '七里香专辑',
    date: new Date('2004-08-03'),
    content: '第五张专辑《七里香》，包含《七里香》《借口》《园游会》等热门歌曲。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '6',
    title: '十一月的萧邦',
    date: new Date('2005-10-17'),
    content: '第六张专辑《十一月的萧邦》，被称为华语乐坛最成功的专辑之一。',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '7',
    title: '依然范特西',
    date: new Date('2006-09-05'),
    content: '第七张专辑《依然范特西》，包含《夜的第七章》《千里之外》等。',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '8',
    title: '我很忙专辑',
    date: new Date('2007-11-02'),
    content: '第八张专辑《我很忙》，包含《青花瓷》《彩虹》等代表作品。',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '9',
    title: '2008年央视春晚',
    date: new Date('2008-02-06'),
    content: '在央视春晚表演《青花瓷》，展现中国风音乐魅力。',
    image: 'https://images.unsplash.com/photo-1544531696-b94d9c11b5f8?w=400',
    person: '周杰伦',
    type: '奖项',
  },
  {
    id: '10',
    title: '魔杰座专辑',
    date: new Date('2008-10-15'),
    content: '第九张专辑《魔杰座》，包含《稻香》《说好的幸福呢》等。',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '11',
    title: '超时代演唱会',
    date: new Date('2010-05-28'),
    content: '超时代世界巡回演唱会台北站，票房火爆。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
  },
  {
    id: '12',
    title: '跨时代专辑',
    date: new Date('2010-05-18'),
    content: '第十张专辑《跨时代》，包含《烟花易冷》《好久不见》等。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '13',
    title: '惊叧叻演唱会',
    date: new Date('2013-05-17'),
    content: '魔天伦世界巡回演唱会台北站，现场座无虚席。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
  },
  {
    id: '14',
    title: '哎呦，不错哦',
    date: new Date('2014-12-10'),
    content: '第十三张专辑《哎呦，不错哦》，数字专辑销量创下纪录。',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '15',
    title: '地表最强演唱会',
    date: new Date('2016-05-28'),
    content: '地表最强世界巡回演唱会，跨越多个国家和地区。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
  },
  {
    id: '16',
    title: '周杰伦的床边故事',
    date: new Date('2016-06-24'),
    content: '第十四张专辑《周杰伦的床边故事》，包含《告白气球》等热门曲目。',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '17',
    title: '嘉年华演唱会',
    date: new Date('2019-12-15'),
    content: '嘉年华世界巡回演唱会台北站，开启新一轮巡演。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
  },
  {
    id: '18',
    title: '最伟大的作品',
    date: new Date('2022-07-15'),
    content: '第十五张专辑《最伟大的作品》，同名歌曲MV创下单日播放纪录。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
    person: '周杰伦',
    type: '专辑',
  },
  {
    id: '19',
    title: '2023年演唱会重启',
    date: new Date('2023-05-10'),
    content: '嘉年华世界巡回演唱会重新启动，场场爆满。',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    person: '周杰伦',
    type: '演唱会',
  },
  {
    id: '20',
    title: '期待新作品',
    date: new Date('2025-01-01'),
    content: '新专辑筹备中，敬请期待...',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    person: '周杰伦',
    type: '生活',
  },
];

export const useTimelineStore = defineStore('timeline', () => {
  const events = ref<TimelineEvent[]>(SAMPLE_EVENTS);
  const viewMode = ref<ViewMode>('overlay');
  const lanes = ref(3);
  const zoomLevel = ref<ZoomLevel>('year');
  const isLoading = ref(false);

  const filterOptions = ref<FilterOptions>({
    persons: [],
    types: [],
    startDate: undefined,
    endDate: undefined,
    searchQuery: '',
  });

  const uniquePersons = computed(() => [...new Set(events.value.map(e => e.person))]);
  const uniqueTypes = computed(() => [...new Set(events.value.map(e => e.type))]);

  const filteredEvents = computed(() => {
    return events.value.filter(event => {
      if (filterOptions.value.persons.length > 0 && !filterOptions.value.persons.includes(event.person)) {
        return false;
      }
      if (filterOptions.value.types.length > 0 && !filterOptions.value.types.includes(event.type)) {
        return false;
      }
      if (filterOptions.value.startDate && event.date < filterOptions.value.startDate) {
        return false;
      }
      if (filterOptions.value.endDate && event.date > filterOptions.value.endDate) {
        return false;
      }
      if (filterOptions.value.searchQuery) {
        const query = filterOptions.value.searchQuery.toLowerCase();
        return event.title.toLowerCase().includes(query) || event.content.toLowerCase().includes(query);
      }
      return true;
    });
  });

  function addEvent(input: TimelineEventInput): TimelineEvent {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      ...input,
      date: new Date(input.date),
      content: input.content || '',
    };
    events.value.push(newEvent);
    return newEvent;
  }

  function updateEvent(id: string, input: Partial<TimelineEventInput>): TimelineEvent | null {
    const index = events.value.findIndex(e => e.id === id);
    if (index === -1) return null;

    const updated = {
      ...events.value[index],
      ...input,
      date: input.date ? new Date(input.date) : events.value[index].date,
    };
    events.value[index] = updated;
    return updated;
  }

  function deleteEvent(id: string): boolean {
    const index = events.value.findIndex(e => e.id === id);
    if (index === -1) return false;
    events.value.splice(index, 1);
    return true;
  }

  function setViewMode(mode: ViewMode): void {
    viewMode.value = mode;
  }

  function setLanes(count: number): void {
    lanes.value = count;
  }

  function setZoomLevel(level: ZoomLevel): void {
    zoomLevel.value = level;
  }

  function setFilterOptions(options: Partial<FilterOptions>): void {
    filterOptions.value = { ...filterOptions.value, ...options };
  }

  function clearFilters(): void {
    filterOptions.value = {
      persons: [],
      types: [],
      startDate: undefined,
      endDate: undefined,
      searchQuery: '',
    };
  }

  return {
    events,
    viewMode,
    lanes,
    zoomLevel,
    isLoading,
    filterOptions,
    uniquePersons,
    uniqueTypes,
    filteredEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    setViewMode,
    setLanes,
    setZoomLevel,
    setFilterOptions,
    clearFilters,
  };
});
