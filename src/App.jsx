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
    weekday: "TUE",
    city: "东京 · 浅草",
    title: "抵达东京，先把浅草走熟",
    lead: "落地后只安排一条轻松线路：机场 → 酒店 → 隅田川 → 浅草夜景。",
    route: "成田机场 → 吾妻桥 → 浅草寺",
    schedule: [
      ["14:00", "成田机场 T1", "入境、取行李，搭车进市区", AirplaneTilt],
      ["17:30", "浅草 / 吾妻桥", "入住后沿隅田川散步", Bed],
      ["19:00", "雷门 · 浅草寺", "看夜景，晚餐选鳗鱼饭或居酒屋", MapPin],
    ],
    photos: [
      ["narita-airport.jpg", "成田机场", "落地与进城"],
      ["tokyo-skytree.jpg", "隅田川沿岸", "吾妻桥可见晴空塔"],
      ["sensoji-unsplash.jpg", "浅草寺", "晚间灯光更安静"],
    ],
    notes: ["交通留出 90–120 分钟", "第一晚不安排跨区移动", "住宿：浅草 / 本所吾妻桥"],
    reserve: "机场交通与首晚住宿",
    accent: "#cf3f2d",
  },
  {
    date: "10.01",
    weekday: "WED",
    city: "东京 · 上野 / 秋叶原",
    title: "古寺、博物馆与电器街",
    lead: "上午看传统文化，下午切换到动漫与游戏街区，路线集中在东京东北侧。",
    route: "浅草 → 上野 → 秋叶原",
    schedule: [
      ["08:00", "浅草寺", "早参、神社与御朱印", MapPin],
      ["10:30", "东京国立博物馆", "本馆与东洋馆，预留 2 小时", Ticket],
      ["15:00", "秋叶原", "游戏、扭蛋与电器街；晚餐烧鸟", Camera],
    ],
    photos: [
      ["sensoji.jpg", "浅草寺", "清晨先避开人流"],
      ["tokyo-national-museum-real.jpg", "东京国立博物馆", "上野公园内的本馆"],
      ["akihabara-unsplash.jpg", "秋叶原", "下午逛街与购物"],
    ],
    notes: ["午餐：上野附近寿司", "博物馆行程控制在 2 小时", "晚餐：秋叶原或浅草烧鸟"],
    reserve: "确认博物馆休馆日",
    accent: "#194b68",
  },
  {
    date: "10.02",
    weekday: "THU",
    city: "东京 · 原宿 / 涩谷",
    title: "从明治神宫走到涩谷夜景",
    lead: "绿荫、潮流街区与城市天际线放在同一天，基本可以步行串联。",
    route: "明治神宫 → 原宿 → 涩谷",
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
    weekday: "FRI",
    city: "东京 → 大阪",
    title: "东京站出发，傍晚吃到大阪",
    lead: "上午不赶景点，把时间留给退房与车站；下午搭新干线，晚上逛道顿堀。",
    route: "东京站 → 新大阪 → 难波",
    schedule: [
      ["10:30", "东京站", "丸之内站舍、百货地下街与午餐", MapPin],
      ["13:00", "东海道新干线", "选 D / E 侧座位，途中看富士山", Train],
      ["18:00", "难波 · 道顿堀", "味乃家大阪烧，散步至法善寺", ForkKnife],
    ],
    photos: [
      ["tokyo-station-real.jpg", "东京站", "丸之内红砖站舍"],
      ["shinkansen-real.jpg", "东海道新干线", "东京到新大阪"],
      ["dotonbori-unsplash.jpg", "道顿堀", "大阪第一晚的霓虹街区"],
    ],
    notes: ["大件行李提前寄送更轻松", "东京站提前 40 分钟到", "住宿：难波 / 心斋桥"],
    reserve: "新干线指定席（D / E 侧）",
    accent: "#194b68",
  },
  {
    date: "10.04",
    weekday: "SAT",
    city: "大阪 · USJ",
    title: "环球影城完整一天",
    lead: "这一天不再叠加城市景点，围绕园区入场、任天堂世界与夜间万圣节安排。",
    route: "难波 → 环球城 → USJ",
    schedule: [
      ["07:00", "前往环球城", "尽量在开园前抵达入口", Train],
      ["09:00", "超级任天堂世界", "优先核心项目，再转哈利·波特园区", Ticket],
      ["17:30", "夜间活动", "晚餐与万圣节氛围，按体力决定离园", Camera],
    ],
    photos: [
      ["usj-real.jpg", "超级任天堂世界", "当天最优先的园区"],
      ["hogwarts-usj-pexels.jpg", "哈利·波特魔法世界", "午后转到霍格沃茨城堡"],
      ["usj-globe-unsplash.jpg", "USJ 入园地标", "早到后直接进入园区"],
    ],
    notes: ["入园后立刻确认区域整理券", "午餐尽量错峰", "穿适合长时间步行的鞋"],
    reserve: "门票 + Express Pass",
    accent: "#cf3f2d",
  },
  {
    date: "10.05",
    weekday: "SUN",
    city: "大阪 → 京都",
    title: "上午泡汤，下午进入京都",
    lead: "先用轻松的温泉恢复体力，再转场京都，把清水寺到祇园串成一条下坡路线。",
    route: "新世界 → 京都站 → 清水寺 → 祇园",
    schedule: [
      ["08:45", "SPA WORLD", "泡汤至 10:30，随后新世界吃串炸", ForkKnife],
      ["12:30", "前往京都", "入住或寄存行李，转巴士去清水寺", Train],
      ["15:00", "清水寺 → 祇园", "二年坂、三年坂、八坂神社、鸭川", MapPin],
    ],
    photos: [
      ["onsen-pexels.jpg", "日式温泉", "上午恢复体力"],
      ["kiyomizudera-pexels.jpg", "清水寺", "下午进入京都的第一站"],
      ["gion-night-pexels.jpg", "祇园", "傍晚继续走到鸭川"],
    ],
    notes: ["大阪退房后直接带行李转场", "清水寺之后一路下坡", "住宿：京都站周边"],
    reserve: "京都住宿；确认 SPA 开放时段",
    accent: "#194b68",
  },
  {
    date: "10.06",
    weekday: "MON",
    city: "京都 → 关西机场",
    title: "伏见稻荷清晨，午后返程",
    lead: "最后一天只保留一个早晨景点，回酒店吃早餐、退房，再搭 HARUKA 去机场。",
    route: "伏见稻荷 → 京都站 → KIX",
    schedule: [
      ["06:30", "伏见稻荷大社", "趁早走千本鸟居，不必登顶", MapPin],
      ["09:00", "早餐与退房", "回酒店取行李，10:30 到京都站", ForkKnife],
      ["11:15", "HARUKA → KIX", "12:40 左右抵达，16:45 起飞", AirplaneTilt],
    ],
    photos: [
      ["fushimi-inari-pexels.jpg", "伏见稻荷", "清晨的千本鸟居"],
      ["japanese-breakfast-pexels.jpg", "日式早餐", "回酒店后补充体力"],
      ["kansai-airport-real.jpg", "关西机场", "预留充足值机时间"],
    ],
    notes: ["鸟居段往返约 60–90 分钟", "京都站买好便当与伴手礼", "起飞前至少 3 小时到机场"],
    reserve: "HARUKA 指定席 / 机场交通",
    accent: "#cf3f2d",
  },
];

const coverPhotos = [
  ["sensoji-unsplash.jpg", "东京 · 浅草"],
  ["dotonbori-unsplash.jpg", "大阪 · 道顿堀"],
  ["kiyomizudera-pexels.jpg", "京都 · 清水寺"],
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

function Cover({ goToDay }) {
  return (
    <section className="slide cover-slide">
      <div className="cover-copy">
        <span className="eyebrow">JAPAN TRIP · 7 DAYS</span>
        <h1>东京 · 大阪 · 京都<br />旅行计划</h1>
        <p className="cover-date">2025.09.30 — 10.06</p>
        <div className="cover-route">
          {["东京 3晚", "大阪 2晚", "京都 1晚"].map((stop, index) => (
            <button key={stop} onClick={() => goToDay(index === 0 ? 1 : index === 1 ? 4 : 6)}>
              <span>{index + 1}</span>{stop}
            </button>
          ))}
        </div>
        <div className="cover-meta">
          <span><AirplaneTilt /> 成田进 · 关西出</span>
          <span><Train /> 东京 → 新大阪 → 京都</span>
          <span><Bed /> 浅草 / 难波 / 京都站</span>
        </div>
      </div>
      <div className="cover-gallery">
        {coverPhotos.map((photo, index) => (
          <Photo key={photo[0]} item={[...photo, index === 0 ? "传统街区" : index === 1 ? "夜间美食" : "古都步行"]} large={index === 0} />
        ))}
      </div>
      <span className="cover-stamp">行程视觉版<br />V1.0</span>
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
            <strong>{dayIndex === 4 ? "轻便鞋 · 可快速干燥" : "分层穿搭 · 随身小伞"}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Checklist() {
  const groups = [
    ["先订", ["往返机票", "东京 / 大阪 / 京都住宿", "USJ 门票与 Express Pass", "Shibuya Sky 时段票"]],
    ["出发前确认", ["新干线指定席", "HARUKA 机场交通", "博物馆与温泉开放时段", "海外流量 / 交通卡 / 旅行保险"]],
    ["行李策略", ["东京 → 大阪可考虑行李配送", "USJ 当天只带小包", "京都最后一晚住车站附近", "返程预留机场购物时间"]],
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
        <div><MapPin weight="fill" /><strong>大阪</strong><span>2晚</span></div>
        <i></i>
        <div><MapPin weight="fill" /><strong>京都</strong><span>1晚</span></div>
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
        <div className="deck-corner">JP · 2025</div>
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
