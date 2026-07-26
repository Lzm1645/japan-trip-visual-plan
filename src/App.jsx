import { useEffect, useMemo, useState } from "react";
import {
  AirplaneTilt,
  ArrowLeft,
  ArrowRight,
  Bed,
  Camera,
  CheckCircle,
  Clock,
  ForkKnife,
  MapPin,
  NavigationArrow,
  Ticket,
  Train,
} from "@phosphor-icons/react";

const A = `${import.meta.env.BASE_URL}assets/places/`;

const days = [
  {
    date: "09.30",
    weekday: "WED",
    city: "东京 · 浅草",
    title: "抵达东京，先把浅草走熟",
    lead: "落地后只安排一条轻松线路：机场 → 酒店 → 隅田川 → 浅草夜景。",
    route: "成田机场 → 吾妻桥 → 浅草寺",
    mapStops: ["成田 T1", "吾妻桥民宿", "隅田川", "浅草寺"],
    schedule: [
      ["14:00", "成田机场 T1", "入境、取行李，搭车进市区", AirplaneTilt],
      ["17:00", "浅草 / 吾妻桥", "入住后沿隅田川散步", Bed],
      ["19:00", "雷门 · 浅草寺", "看夜景，晚餐选鳗鱼饭或居酒屋", MapPin],
    ],
    photos: [
      ["narita-airport.jpg", "成田机场", "落地与进城"],
      ["tokyo-skytree.jpg", "隅田川沿岸", "吾妻桥可见晴空塔"],
      ["sensoji-unsplash.jpg", "浅草寺", "晚间灯光更安静"],
    ],
    notes: ["优先查看浅草方向 Access 特急", "第一晚不安排跨区移动", "住宿：吾妻桥民宿"],
    reserve: "机场交通与首晚住宿",
    accent: "#cf3f2d",
  },
  {
    date: "10.01",
    weekday: "THU",
    city: "东京 · 上野 / 秋叶原 / 银座",
    title: "古寺、动漫与银座文豪之夜",
    lead: "白天从江户文化走到动漫街区，傍晚转入银座购物，以 Bar Lupin 收尾。",
    route: "浅草 → 上野 → 秋叶原 → 银座",
    mapStops: ["浅草", "上野博物馆", "秋叶原", "银座购物", "Bar Lupin"],
    schedule: [
      ["08:30", "浅草寺", "雷门、仲见世、神社与御朱印", MapPin],
      ["10:30", "东京国立博物馆", "本馆与东洋馆，预留 2 小时", Ticket],
      ["15:00", "秋叶原 → 银座", "17:30 银座购物，19:15 New Torigin，20:30 Bar Lupin", Camera],
    ],
    photos: [
      ["sensoji.jpg", "浅草寺", "清晨先避开人流"],
      ["tokyo-national-museum-real.jpg", "东京国立博物馆", "上野公园内的本馆"],
      ["ginza-jnto.jpg", "银座与 Bar Lupin", "先购物，后进入文豪酒吧"],
    ],
    notes: ["购物二选一：三越＋GINZA SIX，或三丽鸥＋Loft＋UNIQLO", "晚餐：New Torigin 烧鸟与釜饭", "Lupin 现金结算；入店先询问拍照规则"],
    reserve: "博物馆开放时间；Bar Lupin 当日营业",
    accent: "#194b68",
  },
  {
    date: "10.02",
    weekday: "FRI",
    city: "东京 · 原宿 / 涩谷",
    title: "从明治神宫走到涩谷夜景",
    lead: "绿荫、潮流街区与城市天际线放在同一天，基本可以步行串联。",
    route: "明治神宫 → 原宿 → 涩谷",
    mapStops: ["明治神宫", "原宿", "Cat Street", "涩谷 PARCO", "Shibuya Sky"],
    schedule: [
      ["08:30", "明治神宫", "清晨参拜，慢走林荫参道", MapPin],
      ["10:30", "竹下通 / Cat Street", "原宿逛街，12:30 午餐", Camera],
      ["14:00", "涩谷 PARCO", "16:30 登 Shibuya Sky，晚餐和牛烧肉", Ticket],
    ],
    photos: [
      ["meiji-shrine-unsplash.jpg", "明治神宫", "安静的森林参道"],
      ["takeshita-street-unsplash.jpg", "竹下通", "原宿最直接的街区印象"],
      ["shibuya-crossing-unsplash.jpg", "涩谷", "十字路口与城市夜景"],
    ],
    notes: ["全日步行量较大", "Shibuya Sky 建议日落前入场", "晚餐：涩谷和牛烧肉"],
    reserve: "Shibuya Sky 时段票",
    accent: "#d44a3a",
  },
  {
    date: "10.03",
    weekday: "SAT",
    city: "东京 → 京都",
    title: "新干线越过富士山，住进京都",
    lead: "上午从东京站出发，车上吃便当看富士山；下午把清水寺到祇园走成一条线。",
    route: "东京站 → 京都站 → 清水寺 → 祇园",
    mapStops: ["东京站", "富士山车窗", "京都站", "清水寺", "祇园"],
    schedule: [
      ["09:30", "东京站", "丸之内站舍、百货地下街与车站便当", MapPin],
      ["11:00", "东海道新干线", "选 D / E 连座，E 座窗边看富士山", Train],
      ["14:30", "清水寺 → 祇园", "二三年坂、八坂塔、鸭川与京都纪念餐", ForkKnife],
    ],
    photos: [
      ["tokyo-station-real.jpg", "东京站", "丸之内红砖站舍"],
      ["fuji-train-unsplash.jpg", "东海道新干线", "天气允许时从 E 座看富士山"],
      ["gion-night-pexels.jpg", "祇园", "东山散步后的古都夜色"],
    ],
    notes: ["大件行李可提前寄往大阪，仅带一晚小包去京都", "清水寺必须先于二三年坂", "住宿：京都町屋 / 别墅"],
    reserve: "东京 → 京都指定席；京都纪念餐",
    accent: "#194b68",
  },
  {
    date: "10.04",
    weekday: "SUN",
    city: "京都 → 大阪",
    title: "京都清晨，大阪泡汤与夜食",
    lead: "趁清晨走过千本鸟居，中午抵达大阪；下午把新世界、泡汤和道顿堀连起来。",
    route: "伏见稻荷 → 难波 → 新世界 → 道顿堀",
    mapStops: ["伏见稻荷", "大阪高津", "新世界", "SPA WORLD", "道顿堀"],
    schedule: [
      ["06:30", "伏见稻荷", "千本鸟居走到奥社附近，不必登顶", MapPin],
      ["11:00", "京都 → 大阪", "入住高津民宿，午餐安排新世界串炸", Train],
      ["14:30", "SPA WORLD → 道顿堀", "泡汤约 2 小时；大阪烧、大丸与 BOOKOFF 按体力选择", ForkKnife],
    ],
    photos: [
      ["fushimi-inari-pexels.jpg", "伏见稻荷", "清晨的千本鸟居"],
      ["onsen-pexels.jpg", "SPA WORLD", "连续步行后的恢复时段"],
      ["dotonbori-unsplash.jpg", "道顿堀", "大阪烧、章鱼烧与夜景"],
    ],
    notes: ["午餐可选新世界串炸或黑门しゃぶ笑寿喜烧", "SPA WORLD 10:00 后营业；纹身限制严格", "晚间顺路：大丸心斋桥、BOOKOFF、格力高"],
    reserve: "京都 → 大阪交通；SPA WORLD 当日信息",
    accent: "#cf3f2d",
  },
  {
    date: "10.05",
    weekday: "MON",
    city: "大阪 · USJ",
    title: "星期一完整留给环球影城",
    lead: "不移动行李、不叠加城市景点，从开园一直留到万圣节夜场结束。",
    route: "高津 → 环球城 → USJ",
    mapStops: ["大阪高津", "环球城", "任天堂世界", "哈利·波特", "万圣节夜场"],
    schedule: [
      ["06:30", "前往环球城", "按官方开园时间倒推，争取提前 60–90 分钟抵达", Train],
      ["开园后", "超级任天堂世界", "按 Express 时段安排马力欧、咚奇刚与园区探索", Ticket],
      ["18:00后", "万圣节夜场", "哈利·波特、限定餐食、街头僵尸与夜间氛围", Camera],
    ],
    photos: [
      ["usj-real.jpg", "超级任天堂世界", "当天最优先的园区"],
      ["hogwarts-usj-pexels.jpg", "哈利·波特魔法世界", "午后与夜间氛围都值得保留"],
      ["usj-globe-unsplash.jpg", "USJ 万圣节", "留到夜场结束再离园"],
    ],
    notes: ["入园后立刻绑定门票并确认整理券", "主题餐错峰；穿适合全天步行的鞋", "万圣惊魂夜覆盖本次旅行日期"],
    reserve: "Studio Pass + 含任天堂时段的 Express Pass",
    accent: "#194b68",
  },
  {
    date: "10.06",
    weekday: "TUE",
    city: "大阪 → 关西机场",
    title: "慢早餐与最后购物，从难波返程",
    lead: "USJ 后不再早起赶景点，上午在难波轻松收尾，留足机场与免税购物时间。",
    route: "高津 → 难波 → KIX",
    mapStops: ["大阪高津", "难波早餐", "最后购物", "南海难波", "关西 T1"],
    schedule: [
      ["08:30", "大阪早餐", "日式定食或喫茶店，按体力自然醒", ForkKnife],
      ["10:00", "难波最后购物", "百货地下层、药妆与伴手礼；11:30 前取行李", Camera],
      ["12:00", "南海难波 → KIX", "优先 Rapi:t，约 13:00 抵达，16:45 起飞", AirplaneTilt],
    ],
    photos: [
      ["japanese-breakfast-pexels.jpg", "日式早餐", "回酒店后补充体力"],
      ["dotonbori-unsplash.jpg", "难波", "最后补齐伴手礼与购物"],
      ["kansai-airport-real.jpg", "关西机场", "预留充足值机时间"],
    ],
    notes: ["不安排大阪城或远距离景点", "南海难波站预留找站与购票时间", "起飞前至少 3 小时到机场"],
    reserve: "Rapi:t / 南海机场交通",
    accent: "#cf3f2d",
  },
];

const coverPhotos = [
  ["sensoji-unsplash.jpg", "东京 · 浅草", "传统街区"],
  ["kiyomizudera-pexels.jpg", "京都 · 清水寺", "古都步行"],
  ["dotonbori-unsplash.jpg", "大阪 · 道顿堀", "夜间美食"],
];

function Photo({ item, large = false }) {
  return (
    <figure className={`photo-card ${large ? "photo-card--large" : ""}`}>
      <img src={`${A}${item[0]}`} alt={item[1]} />
      <figcaption>
        <strong>{item[1]}</strong>
        <span>{item[2]}</span>
      </figcaption>
    </figure>
  );
}

function DailyRouteMap({ stops }) {
  return (
    <div className="daily-route-map" aria-label={`当天路线：${stops.join("，")}`}>
      <span className="route-map-label"><NavigationArrow weight="fill" />当天路线图</span>
      <div className="route-map-stops" style={{ gridTemplateColumns: `repeat(${stops.length}, 1fr)` }}>
        {stops.map((stop, index) => (
          <div className="route-map-stop" key={stop}>
            <span className="route-map-dot">{String(index + 1).padStart(2, "0")}</span>
            <strong>{stop}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cover({ goToDay }) {
  return (
    <section className="slide cover-slide">
      <div className="cover-copy">
        <span className="eyebrow">JAPAN TRIP · 7 DAYS</span>
        <h1>东京 · 京都 · 大阪<br />旅行计划</h1>
        <p className="cover-date">2026.09.30 — 10.06</p>
        <div className="cover-route">
          {["东京 3晚", "京都 1晚", "大阪 2晚"].map((stop, index) => (
            <button key={stop} onClick={() => goToDay(index === 0 ? 1 : index === 1 ? 4 : 5)}>
              <span>{index + 1}</span>{stop}
            </button>
          ))}
        </div>
        <div className="cover-meta">
          <span><AirplaneTilt /> 成田进 · 关西出</span>
          <span><Train /> 东京 → 京都 → 大阪</span>
          <span><Bed /> 吾妻桥 / 京都町屋 / 高津</span>
        </div>
      </div>
      <div className="cover-gallery">
        {coverPhotos.map((photo, index) => (
          <Photo key={photo[0]} item={photo} large={index === 0} />
        ))}
      </div>
      <span className="cover-stamp">行程视觉版<br />V2.0</span>
    </section>
  );
}

function DaySlide({ day, dayIndex }) {
  return (
    <section className="slide day-slide" style={{ "--accent": day.accent }}>
      <header className="slide-head">
        <div className="date-block">
          <span>DAY {dayIndex + 1}</span>
          <strong>{day.date}</strong>
          <em>{day.weekday}</em>
        </div>
        <div>
          <span className="eyebrow">{day.city}</span>
          <h2>{day.title}</h2>
          <p>{day.lead}</p>
        </div>
        <div className="route-chip"><NavigationArrow weight="fill" />{day.route}</div>
      </header>

      <DailyRouteMap stops={day.mapStops} />

      <div className="day-grid">
        <div className="timeline">
          <span className="section-label">当天日程</span>
          {day.schedule.map(([time, place, detail, Icon], index) => (
            <div className="timeline-item" key={time + place}>
              <div className="time"><Clock />{time}</div>
              <div className="route-node">{index + 1}</div>
              <div className="activity">
                <Icon />
                <div><strong>{place}</strong><span>{detail}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="photo-grid">
          {day.photos.map((photo, index) => <Photo key={photo[0]} item={photo} large={index === 0} />)}
        </div>

        <aside className="day-aside">
          <div className="aside-number">{String(dayIndex + 1).padStart(2, "0")}</div>
          <span className="section-label">当天重点</span>
          <ul>
            {day.notes.map((note) => <li key={note}><CheckCircle weight="fill" />{note}</li>)}
          </ul>
          <div className="reserve">
            <Ticket />
            <div><span>建议提前确认</span><strong>{day.reserve}</strong></div>
          </div>
          <div className="weather-note">
            <span>穿着提示</span>
            <strong>{dayIndex === 5 ? "轻便鞋 · 可快速干燥" : "分层穿搭 · 随身小伞"}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Checklist() {
  const groups = [
    ["先订", ["USJ 门票与含任天堂时段的 Express Pass", "Shibuya Sky 日落时段票", "东京 → 京都 D / E 连座", "京都纪念餐"]],
    ["出发前确认", ["Bar Lupin 营业信息与现金", "SPA WORLD 维护与开放信息", "Rapi:t 机场交通", "博物馆开放时段"]],
    ["行李策略", ["东京可将大行李直送大阪", "京都只带一晚随身包", "USJ 当天只带小包", "返程预留机场购物时间"]],
  ];
  return (
    <section className="slide checklist-slide">
      <header>
        <span className="eyebrow">BEFORE DEPARTURE</span>
        <h2>出发前，把这三组事情处理完</h2>
        <p>行程本身已经够满，提前把票、住宿和行李动线定好，现场只需要照着走。</p>
      </header>
      <div className="check-grid">
        {groups.map(([title, items], index) => (
          <article key={title}>
            <span className="check-index">0{index + 1}</span>
            <h3>{title}</h3>
            {items.map((item) => <label key={item}><span></span>{item}</label>)}
          </article>
        ))}
      </div>
      <div className="final-route">
        <div><MapPin weight="fill" /><strong>东京</strong><span>3晚</span></div>
        <i></i>
        <div><MapPin weight="fill" /><strong>京都</strong><span>1晚</span></div>
        <i></i>
        <div><MapPin weight="fill" /><strong>大阪</strong><span>2晚</span></div>
        <i></i>
        <div><AirplaneTilt weight="fill" /><strong>关西机场</strong><span>返程</span></div>
      </div>
    </section>
  );
}

export function App() {
  const total = days.length + 2;
  const [page, setPage] = useState(0);
  const safeSetPage = (next) => setPage(Math.max(0, Math.min(total - 1, next)));

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight" || event.key === " ") safeSetPage(page + 1);
      if (event.key === "ArrowLeft") safeSetPage(page - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page]);

  const content = useMemo(() => {
    if (page === 0) return <Cover goToDay={safeSetPage} />;
    if (page === total - 1) return <Checklist />;
    return <DaySlide day={days[page - 1]} dayIndex={page - 1} />;
  }, [page, total]);

  return (
    <main className="prototype-shell">
      <div className="deck">
        {content}
        <div className="deck-corner">JP · 2026</div>
      </div>
      <nav className="deck-nav" aria-label="幻灯片导航">
        <button className="arrow-button" aria-label="上一页" disabled={page === 0} onClick={() => safeSetPage(page - 1)}><ArrowLeft /></button>
        <div className="page-dots">
          {Array.from({ length: total }, (_, index) => (
            <button
              key={index}
              className={index === page ? "active" : ""}
              aria-label={`第 ${index + 1} 页`}
              onClick={() => safeSetPage(index)}
            >
              <span>{index === 0 ? "封面" : index === total - 1 ? "清单" : `D${index}`}</span>
            </button>
          ))}
        </div>
        <span className="page-count">{String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <button className="arrow-button" aria-label="下一页" disabled={page === total - 1} onClick={() => safeSetPage(page + 1)}><ArrowRight /></button>
      </nav>
    </main>
  );
}
