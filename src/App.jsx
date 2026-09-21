import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
    city: "东京 · 银座 / 吾妻桥",
    title: "抵达东京，银座和牛晚餐",
    lead: "首晚已有银座晚餐预订，进城和行李优先；浅草夜景留作有余力时的加项。",
    route: "成田机场 → 银座晚餐 → 吾妻桥",
    mapStops: ["成田 T1", "银座寄存 / 晚餐", "吾妻桥住宿"],
    geoStops: [
      ["成田机场 T1", 35.7720, 140.3929],
      ["银座晚餐区域", 35.6717, 139.7650],
      ["吾妻桥民宿", 35.7107, 139.8016],
    ],
    schedule: [
      ["14:00", "成田机场 T1", "入境、取行李；出关时间不能当成落地时间", AirplaneTilt],
      ["傍晚", "直达银座或先去民宿", "若晚餐仍是 18:00，优先直达银座并寄存行李", Bed],
      ["待核对", "银座和牛晚餐", "群里曾订 18:00，也讨论过改晚；以订单时间为准", ForkKnife],
    ],
    photos: [
      ["narita-airport.jpg", "成田机场", "落地与进城"],
      ["ginza-jnto.jpg", "银座", "晚餐后再去吾妻桥入住"],
      ["tokyo-skytree.jpg", "吾妻桥", "首晚有余力再散步"],
    ],
    notes: ["18:00 预订与航班延误冲突风险高", "先核对可否改至 19:30 后", "首晚不再塞浅草寺和 Bar Lupin"],
    reserve: "银座和牛最终时间、晚到规则",
    accent: "#cf3f2d",
  },
  {
    date: "10.01",
    weekday: "THU",
    city: "东京 · 浅草 / 上野 / 银座",
    title: "浅草海鲜丼、博物馆与银座",
    lead: "围绕已约的 11:45 海鲜丼安排浅草上午；下午看一个馆，晚间购物和 Bar Lupin。",
    route: "浅草 → 上野 → 银座",
    mapStops: ["浅草寺 / 海鲜丼", "上野博物馆", "银座购物", "Bar Lupin"],
    geoStops: [
      ["浅草寺 / 海鲜丼区域", 35.7148, 139.7967],
      ["东京国立博物馆", 35.7188, 139.7765],
      ["银座购物", 35.6717, 139.7650],
      ["Bar Lupin", 35.6716, 139.7638],
    ],
    schedule: [
      ["08:30", "浅草寺 → 海鲜丼", "雷门与仲见世；11:45 浅草海鲜丼已预约", ForkKnife],
      ["13:30", "上野博物馆", "选东京国立博物馆等一个馆，预留约 2 小时", Ticket],
      ["17:00", "银座购物 → Bar Lupin", "晚餐灵活安排；酒吧视排队和营业情况", Camera],
    ],
    photos: [
      ["sensoji.jpg", "浅草寺", "清晨先避开人流"],
      ["tokyo-national-museum-real.jpg", "东京国立博物馆", "上野公园内的本馆"],
      ["ginza-jnto.jpg", "银座与 Bar Lupin", "购物和酒吧留给晚间"],
    ],
    notes: ["海鲜丼 11:45 已预约，核对店名与订单", "秋叶原移到 10/2 上午", "Lupin 不保证入座；先核对营业与支付规则"],
    reserve: "海鲜丼订单；博物馆和 Lupin 营业",
    accent: "#194b68",
  },
  {
    date: "10.02",
    weekday: "FRI",
    city: "东京 · 秋叶原 / 银座 / 涩谷",
    title: "秋叶原购物，鳗鱼饭后去涩谷",
    lead: "12:30 银座鳗鱼饭是当天固定锚点；购物按东到西走，傍晚留给涩谷。",
    route: "秋叶原 → 银座鳗鱼饭 → 涩谷",
    mapStops: ["秋叶原", "12:30 鳗鱼饭", "涩谷 PARCO", "涩谷十字路口", "Shibuya Sky"],
    geoStops: [
      ["秋叶原", 35.6984, 139.7731],
      ["银座鳗鱼饭", 35.6717, 139.7650],
      ["涩谷 PARCO", 35.6620, 139.6988],
      ["涩谷十字路口", 35.6595, 139.7005],
      ["Shibuya Sky", 35.6584, 139.7016],
    ],
    schedule: [
      ["10:00", "秋叶原", "先看目标店；若买得多再考虑寄存或回民宿", Camera],
      ["12:30", "银座鳗鱼饭", "已预约；从秋叶原留足跨区交通时间", ForkKnife],
      ["14:30", "涩谷 PARCO → Sky", "角色商店与购物；Sky 门票尚待核对", Ticket],
    ],
    photos: [
      ["akihabara-unsplash.jpg", "秋叶原", "上午逛目标店"],
      ["ginza-jnto.jpg", "银座", "鳗鱼饭已约 12:30"],
      ["shibuya-crossing-unsplash.jpg", "涩谷", "十字路口与城市夜景"],
    ],
    notes: ["鳗鱼饭改约与取消期限要看订单", "明治神宫与原宿降为可选，不挤占购物", "东京大阪烧预订已取消"],
    reserve: "鳗鱼饭订单；Shibuya Sky 门票",
    accent: "#d44a3a",
  },
  {
    date: "10.03",
    weekday: "SAT",
    city: "东京 → 京都",
    title: "新干线到京都，晚上已约居酒屋",
    lead: "上午乘车，下午走清水寺与二三年坂；19:00 京都居酒屋是当天的时间锚点。",
    route: "东京站 → 京都站 → 清水寺 → 居酒屋",
    mapStops: ["东京站", "富士山车窗", "京都站", "清水寺", "19:00 居酒屋"],
    geoStops: [
      ["东京站", 35.6812, 139.7671],
      ["新富士附近", 35.1614, 138.6764],
      ["京都站", 34.9858, 135.7588],
      ["清水寺", 34.9949, 135.7850],
      ["东山居酒屋区域", 35.0005, 135.7805],
    ],
    schedule: [
      ["09:30", "东京站", "丸之内站舍、百货地下街与车站便当", MapPin],
      ["11:00", "东海道新干线", "选 D / E 连座，E 座窗边看富士山", Train],
      ["14:30", "清水寺 → 二三年坂", "先看开放景点，再沿东山下行；19:00 居酒屋已约", ForkKnife],
    ],
    photos: [
      ["tokyo-station-real.jpg", "东京站", "丸之内红砖站舍"],
      ["fuji-train-unsplash.jpg", "东海道新干线", "天气允许时从 E 座看富士山"],
      ["gion-night-pexels.jpg", "京都夜晚", "居酒屋结束后再散步"],
    ],
    notes: ["大件行李可寄往大阪，京都只带一晚小包", "清水寺放在商店街与晚餐之前", "19:00 居酒屋已约；核对店名和取消规则"],
    reserve: "新干线指定席；京都居酒屋订单",
    accent: "#194b68",
  },
  {
    date: "10.04",
    weekday: "SUN",
    city: "京都 → 大阪",
    title: "京都清晨，大阪泡汤与夜食",
    lead: "清晨看千本鸟居，中午到大阪；新世界与泡汤保留，晚上不设硬性餐厅时段。",
    route: "伏见稻荷 → 难波 → 新世界 → 道顿堀",
    mapStops: ["伏见稻荷", "大阪高津", "新世界", "SPA WORLD", "道顿堀"],
    geoStops: [
      ["伏见稻荷", 34.9671, 135.7727],
      ["大阪高津民宿", 34.6674, 135.5145],
      ["新世界", 34.6524, 135.5063],
      ["SPA WORLD", 34.6504, 135.5058],
      ["道顿堀", 34.6687, 135.5013],
    ],
    schedule: [
      ["06:30", "伏见稻荷", "千本鸟居走到奥社附近，不必登顶", MapPin],
      ["11:00", "京都 → 大阪", "入住高津民宿，午餐安排新世界串炸", Train],
      ["14:30", "SPA WORLD → 道顿堀", "泡汤约 2 小时；晚餐按抵达和体力选择", ForkKnife],
    ],
    photos: [
      ["fushimi-inari-pexels.jpg", "伏见稻荷", "清晨的千本鸟居"],
      ["onsen-pexels.jpg", "SPA WORLD", "连续步行后的恢复时段"],
      ["dotonbori-unsplash.jpg", "道顿堀", "大阪烧、章鱼烧与夜景"],
    ],
    notes: ["午餐可选新世界串炸", "SPA WORLD 开放与纹身规则临近核对", "不为 17:30 大阪烧赶路；道顿堀晚间自由吃"],
    reserve: "京都 → 大阪交通；SPA WORLD 当日信息",
    accent: "#cf3f2d",
  },
  {
    date: "10.05",
    weekday: "MON",
    city: "大阪 · USJ",
    title: "星期一完整留给环球影城",
    lead: "USJ 仍是全天主角；同行人想晚餐吃大阪烧，但排队不能挤掉万圣节夜场。",
    route: "高津 → 环球城 → USJ",
    mapStops: ["大阪高津", "环球城", "任天堂世界", "哈利·波特", "万圣节夜场"],
    geoStops: [
      ["大阪高津民宿", 34.6674, 135.5145],
      ["环球城站", 34.6679, 135.4385],
      ["超级任天堂世界", 34.6648, 135.4323],
      ["哈利·波特园区", 34.6667, 135.4331],
      ["万圣节夜场", 34.6654, 135.4323],
    ],
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
    notes: ["入园后绑定门票并确认整理券", "园内主题餐错峰，晚间留给万圣节", "同行四人大阪烧为候选；太晚或排队久就改天"],
    reserve: "USJ 门票 / Express；大阪烧未预约",
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
    geoStops: [
      ["大阪高津民宿", 34.6674, 135.5145],
      ["难波早餐", 34.6665, 135.5018],
      ["心斋桥购物", 34.6720, 135.5010],
      ["南海难波站", 34.6627, 135.5019],
      ["关西机场 T1", 34.4347, 135.2441],
    ],
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

function RouteMapSlide() {
  const [activeDay, setActiveDay] = useState(0);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const day = days[activeDay];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 80);
    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (routeLayerRef.current) routeLayerRef.current.remove();

    const group = L.layerGroup().addTo(map);
    routeLayerRef.current = group;
    const latLngs = day.geoStops.map(([, lat, lng]) => [lat, lng]);

    L.polyline(latLngs, {
      color: day.accent,
      weight: 4,
      opacity: 0.86,
      dashArray: "8 7",
    }).addTo(group);

    day.geoStops.forEach(([label, lat, lng], index) => {
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "trip-map-marker",
          html: `<span>${index + 1}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(group);
      marker.bindTooltip(`${index + 1}. ${label}`, {
        direction: "top",
        offset: [0, -10],
      });
    });

    map.fitBounds(L.latLngBounds(latLngs), {
      padding: [42, 42],
      maxZoom: 14,
    });
    window.setTimeout(() => map.invalidateSize(), 40);
  }, [activeDay, day]);

  return (
    <section className="slide map-slide" style={{ "--accent": day.accent }}>
      <header className="map-slide-head">
        <div>
          <span className="eyebrow">INTERACTIVE ROUTE MAP</span>
          <h2>七天路线地图</h2>
          <p>切换日期查看真实位置、当天移动方向与跨城市距离；地图支持拖动和缩放。</p>
        </div>
        <div className="map-legend">
          <span><i></i>当天路线</span>
          <span><b>1</b>停靠顺序</span>
        </div>
      </header>

      <div className="map-layout">
        <div className="interactive-map" ref={containerRef} aria-label={`${day.date}路线地图`} />
        <aside className="map-day-panel">
          <span className="section-label">选择日期</span>
          <div className="map-day-tabs">
            {days.map((item, index) => (
              <button
                type="button"
                key={item.date}
                className={index === activeDay ? "active" : ""}
                onClick={() => setActiveDay(index)}
              >
                <span>D{index + 1}</span>
                <strong>{item.date}</strong>
                <em>{item.city.split("·")[0].trim()}</em>
              </button>
            ))}
          </div>
          <div className="map-route-detail">
            <span>DAY {activeDay + 1} · {day.weekday}</span>
            <h3>{day.title}</h3>
            <ol>
              {day.geoStops.map(([label]) => <li key={label}>{label}</li>)}
            </ol>
          </div>
        </aside>
      </div>
    </section>
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
            <button key={stop} onClick={() => goToDay(index === 0 ? 2 : index === 1 ? 5 : 6)}>
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
      <span className="cover-stamp">群聊更新版<br />V3.0</span>
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
            <div><span>预订状态 / 待确认</span><strong>{day.reserve}</strong></div>
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
    ["已预约，核对订单", ["9/30 银座和牛：最终时间与晚到规则", "10/1 11:45 浅草海鲜丼", "10/2 12:30 银座鳗鱼饭", "10/3 19:00 京都居酒屋"]],
    ["尚待确认", ["USJ 门票与任天堂时段 Express", "Shibuya Sky 日落时段票", "东京 → 京都 D / E 连座", "10/5 大阪烧不能预约，排队视体力"]],
    ["现场动线", ["首晚若仍 18:00 预约，直达银座寄存行李", "京都只带一晚随身包", "Lupin 和 SPA WORLD 核对营业规则", "10/6 提前抵达关西机场"]],
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
  const total = days.length + 3;
  const [page, setPage] = useState(0);
  const deckRef = useRef(null);
  const safeSetPage = (next) => setPage(Math.max(0, Math.min(total - 1, next)));

  useEffect(() => {
    if (deckRef.current) deckRef.current.scrollTop = 0;
  }, [page]);

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
    if (page === 1) return <RouteMapSlide />;
    if (page === total - 1) return <Checklist />;
    return <DaySlide day={days[page - 2]} dayIndex={page - 2} />;
  }, [page, total]);

  return (
    <main className="prototype-shell">
      <div className="deck" ref={deckRef}>
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
              <span>{index === 0 ? "封面" : index === 1 ? "地图" : index === total - 1 ? "清单" : `D${index - 1}`}</span>
            </button>
          ))}
        </div>
        <span className="page-count">{String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <button className="arrow-button" aria-label="下一页" disabled={page === total - 1} onClick={() => safeSetPage(page + 1)}><ArrowRight /></button>
      </nav>
    </main>
  );
}
