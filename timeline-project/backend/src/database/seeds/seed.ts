import { AppDataSource } from '../data-source'
import { Person } from '../../events/entities/person.entity'
import { Event, EventType } from '../../events/entities/event.entity'

async function seed() {
  await AppDataSource.initialize()
  console.log('🌱 Starting database seed...')

  const personRepository = AppDataSource.getRepository(Person)
  const eventRepository = AppDataSource.getRepository(Event)

  // ==================== 示例人物：周杰伦 ====================
  const zhouJielun = personRepository.create({
    name: '周杰伦',
    color: '#8b5cf6', // 紫色
    icon: '🎤'
  })
  await personRepository.save(zhouJielun)

  // ==================== 示例人物：邓丽君 ====================
  const dengLijun = personRepository.create({
    name: '邓丽君',
    color: '#ec4899', // 粉色
    icon: '🌸'
  })
  await personRepository.save(dengLijun)

  // ==================== 示例人物：陈奕迅 ====================
  const chenYixun = personRepository.create({
    name: '陈奕迅',
    color: '#0ea5e9', // 蓝色
    icon: '🎸'
  })
  await personRepository.save(chenYixun)

  // ==================== 周杰伦事件 ====================
  const jayEvents = [
    { title: '首张专辑《Jay》发行', date: '2000-11-07', type: EventType.ALBUM, content: '周杰伦的首张个人专辑《Jay》正式发行，收录了《可爱女人》、《黑色幽默》、《星晴》等经典歌曲，标志着华语乐坛新星的崛起。', person: zhouJielun },
    { title: '专辑《范特西》发行', date: '2001-09-14', type: EventType.ALBUM, content: '第二张专辑《范特西》大获成功，包含《双截棍》、《爱在西元前》、《简单爱》等热门歌曲，奠定了周杰伦在华语乐坛的地位。', person: zhouJielun },
    { title: '首次世界巡回演唱会', date: '2002-03-23', type: EventType.CONCERT, content: '「The One」世界巡回演唱会首站在台北举行，开启全球巡演之旅。', person: zhouJielun },
    { title: '金曲奖最佳专辑奖', date: '2002-04-14', type: EventType.AWARD, content: '凭借《范特西》获得第13届金曲奖最佳流行音乐演唱专辑奖。', person: zhouJielun },
    { title: '专辑《叶惠美》发行', date: '2003-07-31', type: EventType.ALBUM, content: '第三张专辑《叶惠美》以母亲名字命名，收录《以父之名》、《晴天》、《东风破》等经典。', person: zhouJielun },
    { title: '专辑《七里香》发行', date: '2004-08-03', type: EventType.ALBUM, content: '第四张专辑《七里香》创下亚洲销量纪录，同名主打歌成为经典。', person: zhouJielun },
    { title: '专辑《十一月的肖邦》', date: '2005-11-01', type: EventType.ALBUM, content: '第五张专辑，包含《夜曲》、《发如雪》、《蓝色风暴》等。', person: zhouJielun },
    { title: '首部电影《头文字D》上映', date: '2005-06-19', type: EventType.MILESTONE, content: '主演电影《头文字D》上映，获得第42届金马奖最佳新演员奖。', person: zhouJielun },
    { title: '专辑《依然范特西》', date: '2006-09-05', type: EventType.ALBUM, content: '第六张专辑，包含《菊花台》、《千里之外》等。', person: zhouJielun },
    { title: '专辑《我很忙》', date: '2007-11-02', type: EventType.ALBUM, content: '第七张专辑，收录《牛仔很忙》、《彩虹》、《青花瓷》等。', person: zhouJielun },
    { title: '专辑《魔杰座》', date: '2008-10-15', type: EventType.ALBUM, content: '第八张专辑，包含《稻香》、《龙战骑士》等。', person: zhouJielun },
    { title: '专辑《跨时代》', date: '2010-05-18', type: EventType.ALBUM, content: '第十张专辑，同名主打歌《跨时代》获得金曲奖年度歌曲。', person: zhouJielun },
    { title: '专辑《惊叹号》', date: '2011-11-11', type: EventType.ALBUM, content: '第十一张专辑，同名主打歌《惊叹号》。', person: zhouJielun },
    { title: '专辑《十二新作》', date: '2012-12-28', type: EventType.ALBUM, content: '第十二张专辑，包含《明明就》、《红尘客栈》等。', person: zhouJielun },
    { title: '专辑《哎呦，不错哦》', date: '2014-12-25', type: EventType.ALBUM, content: '第十三张专辑，同名主打歌《哎呦，不错哦》。', person: zhouJielun },
    { title: '专辑《周杰伦的床边故事》', date: '2016-06-24', type: EventType.ALBUM, content: '第十四张专辑，包含《告白气球》、《床边故事》等。', person: zhouJielun },
    { title: '结婚大婚', date: '2015-01-17', type: EventType.MILESTONE, content: '与昆凌在古堡举行婚礼。', person: zhouJielun },
    { title: '专辑《最伟大的作品》', date: '2022-07-15', type: EventType.ALBUM, content: '第十五张专辑，同名主打歌《最伟大的作品》。', person: zhouJielun },
    { title: '「嘉年华」世界巡回演唱会', date: '2019-10-12', type: EventType.CONCERT, content: '「嘉年华」世界巡回演唱会启动，首站在台北。', person: zhouJielun },
  ]

  for (const eventData of jayEvents) {
    const event = eventRepository.create({
      ...eventData,
      person: zhouJielun,
    })
    await eventRepository.save(event)
  }

  // ==================== 邓丽君事件 ====================
  const dengEvents = [
    { title: '出生', date: '1953-01-29', type: EventType.MILESTONE, content: '邓丽君出生于台湾省云林县。', person: dengLijun },
    { title: '首次登台演出', date: '1967-07-01', type: EventType.CONCERT, content: '14岁首次登台演出，开启歌唱生涯。', person: dengLijun },
    { title: '首张个人专辑发行', date: '1968-01-01', type: EventType.ALBUM, content: '发行首张个人专辑《邓丽君之歌》。', person: dengLijun },
    { title: '《甜蜜蜜》发行', date: '1979-12-15', type: EventType.ALBUM, content: '经典歌曲《甜蜜蜜》发行，成为华语乐坛永恒经典。', person: dengLijun },
    { title: '《月亮代表我的心》发行', date: '1977-01-01', type: EventType.ALBUM, content: '《月亮代表我的心》发行，成为华语情歌代表作。', person: dengLijun },
    { title: '《小城故事》发行', date: '1979-01-01', type: EventType.ALBUM, content: '电影《小城故事》主题曲发行。', person: dengLijun },
    { title: '《我只在乎你》发行', date: '1986-12-01', type: EventType.ALBUM, content: '经典歌曲《我只在乎你》发行。', person: dengLijun },
    { title: '逝世', date: '1995-05-08', type: EventType.MILESTONE, content: '邓丽君在泰国清迈因哮喘发作逝世，享年42岁。', person: dengLijun },
  ]

  for (const eventData of dengEvents) {
    const event = eventRepository.create({
      ...eventData,
      person: dengLijun,
    })
    await eventRepository.save(event)
  }

  // ==================== 陈奕迅事件 ====================
  const chenEvents = [
    { title: '出生', date: '1974-07-27', type: EventType.MILESTONE, content: '陈奕迅出生于香港。', person: chenYixun },
    { title: '参加新秀歌唱大赛夺冠', date: '1995-08-01', type: EventType.AWARD, content: '参加第14届新秀歌唱大赛获得冠军，签约华星唱片。', person: chenYixun },
    { title: '首张专辑《陈奕迅》发行', date: '1996-11-28', type: EventType.ALBUM, content: '首张粤语专辑《陈奕迅》发行。', person: chenYixun },
    { title: '《K歌之王》发行', date: '2000-09-29', type: EventType.ALBUM, content: '歌曲《K歌之王》收录于专辑《Shall We Talk?》。', person: chenYixun },
    { title: '《十年》发行', date: '2003-04-01', type: EventType.ALBUM, content: '国语歌曲《十年》收录于专辑《黑白灰》，成为经典。', person: chenYixun },
    { title: '《浮夸》发行', date: '2005-06-01', type: EventType.ALBUM, content: '歌曲《浮夸》收录于专辑《U87》，成为代表作。', person: chenYixun },
    { title: '《爱情转移》发行', date: '2007-04-01', type: EventType.ALBUM, content: '歌曲《爱情转移》收录于专辑《认了吧》。', person: chenYixun },
    { title: '《孤独患者》发行', date: '2011-11-11', type: EventType.ALBUM, content: '歌曲《孤独患者》收录于专辑《Stranger under my skin》。', person: chenYixun },
    { title: '《任我行》发行', date: '2013-07-01', type: EventType.ALBUM, content: '歌曲《任我行》收录于专辑《The Key》。', person: chenYixun },
    { title: '《孤勇者》发行', date: '2021-11-08', type: EventType.ALBUM, content: '歌曲《孤勇者》发行，成为现象级爆款歌曲。', person: chenYixun },
    { title: '「Fear and Dreams」世界巡回演唱会', date: '2022-12-09', type: EventType.CONCERT, content: '「Fear and Dreams」世界巡回演唱会启动。', person: chenYixun },
  ]

  for (const eventData of chenEvents) {
    const event = eventRepository.create({
      ...eventData,
      person: chenYixun,
    })
    await eventRepository.save(event)
  }

  console.log('✅ Database seed completed successfully!')
  console.log(`📊 ${personRepository.createQueryBuilder().getCount()} persons, ${eventRepository.createQueryBuilder().getCount()} events`)

  await AppDataSource.destroy()
}

seed().catch(console.error)
