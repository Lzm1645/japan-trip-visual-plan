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
    title: "抵达东京，银座购物与 Lupin",
    lead: "首晚以银座为主：在已约和牛晚餐前后逛街，若进城顺利再去 Bar Lupin。",
    route: "成田机场 → 银座购物 / 晚餐 → Bar Lupin → 吾妻桥",
    mapStops: ["成田 T1", "银座购物 / 晚餐", "Bar Lupin（视时间）", "吾妻桥住宿"],
    geoStops: [
      ["成田机场 T1", 35.7720, 140.3929],
      ["银座晚餐区域", 35.6717, 139.7650],
      ["Bar Lupin", 35.6716, 139.7638],
      ["吾妻桥民宿", 35.7107, 139.8016],
    ],
    schedule: [
      ["14:00", "成田机场 T1", "入境、取行李；出关时间不能当成落地时间", AirplaneTilt],
      ["傍晚", "银座购物 / 寄存行李", "若晚餐仍是 18:00，购物只能短逛；以订单时间为准", Bed],
      ["晚餐后", "银座和牛 → Bar Lupin", "Lupin 不接受预约；赶不上或等位过久就直接入住", ForkKnife],
    ],
    photos: [
      ["narita-airport.jpg", "成田机场", "落地与进城"],
      ["ginza-jnto.jpg", "银座", "购物、晚餐和酒吧都在同一片区"],
      ["tokyo-skytree.jpg", "吾妻桥", "夜间抵达后入住"],
    ],
    notes: ["18:00 预订与航班延误冲突风险高", "先核对晚餐最终时间与晚到规则", "Lupin 只作当晚可选项，不为打卡误了入住"],
    reserve: "银座和牛订单；Lupin 营业与等位",
    accent: "#cf3f2d",
  },
  {
    date: "10.01",
    weekday: "THU",
    city: "东京 · 浅草 / 上野 / 秋叶原",
    title: "浅草海鲜丼、博物馆与秋叶原",
    lead: "围绕已约的 11:45 海鲜丼安排浅草上午；下午看一个馆，晚上去秋叶原逛店和游戏厅。",
    route: "浅草 → 上野 → 秋叶原",
    mapStops: ["浅草寺 / 海鲜丼", "上野博物馆", "秋叶原夜逛"],
    geoStops: [
      ["浅草寺 / 海鲜丼区域", 35.7148, 139.7967],
      ["东京国立博物馆", 35.7188, 139.7765],
      ["秋叶原", 35.6984, 139.7731],
    ],
    schedule: [
      ["08:30", "浅草寺 → 海鲜丼", "雷门与仲见世；11:45 浅草海鲜丼已预约", ForkKnife],
      ["13:30", "上野博物馆", "选东京国立博物馆等一个馆，预留约 2 小时", Ticket],
      ["傍晚", "秋叶原", "目标店、扭蛋或游戏厅；先查想逛店铺的关门时间", Camera],
    ],
    photos: [
      ["sensoji.jpg", "浅草寺", "清晨先避开人流"],
      ["tokyo-national-museum-real.jpg", "东京国立博物馆", "上野公园内的本馆"],
      ["akihabara-unsplash.jpg", "秋叶原", "晚饭前后自由逛"],
    ],
    notes: ["海鲜丼 11:45 已预约，核对店名与订单", "银座与 Lupin 优先放在首晚", "秋叶原放在晚间，避免 10/2 重复跑一趟"],
    reserve: "海鲜丼订单；博物馆与秋叶原店铺营业",
    accent: "#194b68",
  },
  {
    date: "10.02",
    weekday: "FRI",
    city: "东京 · 鳗鱼饭 / 涩谷",
    title: "鳗鱼饭后，逛涩谷",
    lead: "12:30 的鳗鱼饭已约，但不在银座；地址尚未给出，上午动线等餐厅位置确认后再定。",
    route: "上午弹性 → 鳗鱼饭（地址待定）→ 涩谷",
    mapStops: ["上午弹性", "12:30 鳗鱼饭（地址待定）", "涩谷 PARCO", "涩谷十字路口"],
    geoStops: [
      ["东京住宿 / 上午起点", 35.7107, 139.8016],
      ["涩谷 PARCO", 35.6620, 139.6988],
      ["涩谷十字路口", 35.6595, 139.7005],
    ],
    schedule: [
      ["上午", "灵活安排", "先拿到鳗鱼饭准确店址，再决定是否加入原宿或明治神宫", Camera],
      ["12:30", "鳗鱼饭", "已预约、但不在银座；地图暂不冒充精确店址", ForkKnife],
      ["下午", "涩谷 PARCO → 十字路口", "角色商店与购物；Shibuya Sky 不再是必选", Ticket],
    ],
    photos: [
      ["meiji-shrine-unsplash.jpg", "明治神宫", "仅在餐厅地址顺路时安排"],
      ["takeshita-street-unsplash.jpg", "原宿", "上午可替换项"],
      ["shibuya-crossing-unsplash.jpg", "涩谷", "十字路口与城市夜景"],
    ],
    notes: ["鳗鱼饭不在银座，等地址再画餐厅地图点", "明治神宫与原宿只在顺路时加入", "若 10/5 能用券登 Harukas 300，可不买 Shibuya Sky"],
    reserve: "鳗鱼饭准确地址；Shibuya Sky 仅兴趣项",
    accent: "#d44a3a",
  },
  {
    date: "10.03",
    weekday: "SAT",
    city: "东京 → 京都",
    title: "新干线到京都，晚上已约居酒屋",
    lead: "新干线票已购；到京都后走清水寺与二三年坂，19:00 居酒屋是晚间锚点。",
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
      ["按票面", "东京站", "预留进站与买车站便当时间；勿按旧版 11:00 出发", MapPin],
      ["已购票", "东海道新干线", "群聊讨论过约 9 点车次与 D / E 座；以订单为准", Train],
      ["下午", "清水寺 → 二三年坂", "先看开放景点，再沿东山下行；19:00 居酒屋已约", ForkKnife],
    ],
    photos: [
      ["tokyo-station-real.jpg", "东京站", "丸之内红砖站舍"],
      ["fuji-train-unsplash.jpg", "东海道新干线", "天气允许时从 E 座看富士山"],
      ["gion-night-pexels.jpg", "京都夜晚", "居酒屋结束后再散步"],
    ],
    notes: ["大件行李可寄往大阪，京都只带一晚小包", "清水寺放在商店街与晚餐之前", "19:00 居酒屋已约；核对店名和取消规则"],
    reserve: "新干线已购：核对车次 / 座位；京都居酒屋订单",
    accent: "#194b68",
  },
  {
    date: "10.04",
    weekday: "SUN",
    city: "京都 → 大阪",
    title: "京都再玩半天，晚上转大阪",
    lead: "清晨伏见稻荷；下午留给永观堂与哲学之道南段，傍晚顺路经过八坂神社后再去大阪。",
    route: "伏见稻荷 → 永观堂 → 哲学之道南段 → 八坂神社 → 大阪",
    mapStops: ["伏见稻荷", "永观堂", "哲学之道南段", "八坂神社", "大阪高津"],
    geoStops: [
      ["伏见稻荷", 34.9671, 135.7727],
      ["永观堂", 35.0144, 135.7930],
      ["哲学之道南段", 35.0188, 135.7940],
      ["八坂神社", 35.0036, 135.7785],
      ["大阪高津民宿", 34.6674, 135.5145],
    ],
    schedule: [
      ["06:30", "伏见稻荷", "千本鸟居走到奥社附近，不必登顶", MapPin],
      ["下午", "永观堂 → 哲学之道南段", "寺院参拜受 16:00 停止受理约束；只走南段，不走全长", Camera],
      ["傍晚", "八坂神社 → 京都取行李", "若时间吃紧，八坂神社作路过项；不追 10 月红叶", MapPin],
      ["晚间", "京都 → 大阪", "晚餐与入住高津民宿；跨城出发时刻按实际体力定", Train],
    ],
    photos: [
      ["fushimi-inari-pexels.jpg", "伏见稻荷", "清晨的千本鸟居"],
      ["eikando-commons.jpg", "永观堂", "下午的禅寺与庭园"],
      ["gion-night-pexels.jpg", "八坂神社周边", "晚间转场前慢走"],
    ],
    notes: ["京都下午不再提前转大阪", "永观堂与哲学之道优先；八坂神社可删", "原计划的 SPA WORLD 移出今天，避免挤掉京都"],
    reserve: "永观堂开放时间；京都 → 大阪交通",
    accent: "#cf3f2d",
  },
  {
    date: "10.05",
    weekday: "MON",
    city: "大阪 · 市区",
    title: "用周游券逛大阪，晚上吃大阪烧",
    lead: "普通版关西乐享周游券拟选 Harukas 300 与道顿堀游船两项；均须先核对实际券面权益。",
    route: "高津 → Harukas 300 → 心斋桥 → 道顿堀游船 / 大阪烧",
    mapStops: ["大阪高津", "Harukas 300（待核）", "心斋桥", "道顿堀游船（待核）", "大阪烧"],
    geoStops: [
      ["大阪高津民宿", 34.6674, 135.5145],
      ["Harukas 300", 34.6455, 135.5137],
      ["心斋桥", 34.6746, 135.5016],
      ["Wonder Cruise 日本桥船着场", 34.6686, 135.5077],
      ["大阪烧候选区域", 34.6687, 135.5013],
    ],
    schedule: [
      ["上午", "慢早餐 / 泡汤二选一", "SPA WORLD 保留为可选；若泡汤就压缩购物，不再叠加大阪城", MapPin],
      ["下午", "Harukas 300 → 心斋桥", "拟兑第一项；如券面不含此权益，则按兴趣决定是否自费", Camera],
      ["傍晚", "道顿堀 Wonder Cruise", "拟兑第二项；周一须先按周游券规则预约时段", Ticket],
      ["晚间", "四人大阪烧", "热门店目前只能现场排队；预留附近替补店", ForkKnife],
    ],
    photos: [
      ["harukas-300-commons.jpg", "Harukas 300", "登高看大阪城市景观"],
      ["dotonbori-unsplash.jpg", "道顿堀", "拟乘游船并在附近吃大阪烧"],
      ["onsen-pexels.jpg", "泡汤", "与购物二选一的上午体验"],
    ],
    notes: ["先核对普通版券面是否有两项及有效期", "Wonder Cruise 周一需要预订，别直接到码头碰运气", "泡汤为可选项；大阪烧仍未预约"],
    reserve: "周游券权益 / 游船预约；大阪烧排队",
    accent: "#194b68",
  },
  {
    date: "10.06",
    weekday: "TUE",
    city: "大阪 · USJ",
    title: "已购票：USJ 与万圣节夜场",
    lead: "群聊明确买了 10/6 的园区票，含 12:00 任天堂入场；快速通关并未确认购买。",
    route: "高津 → 环球城 → 任天堂世界 → 夜场",
    mapStops: ["大阪高津", "环球城", "任天堂世界", "哈利·波特", "万圣节夜场"],
    geoStops: [
      ["大阪高津民宿", 34.6674, 135.5145],
      ["环球城站", 34.6679, 135.4385],
      ["超级任天堂世界", 34.6648, 135.4323],
      ["哈利·波特园区", 34.6667, 135.4331],
      ["万圣节夜场", 34.6654, 135.4323],
    ],
    schedule: [
      ["开园前", "前往环球城", "按 10/6 官方开园时间倒推，预留进站与安检时间", Train],
      ["12:00", "超级任天堂世界", "群聊选定的入场时段；按票面确认具体使用规则", Ticket],
      ["晚间", "万圣节夜场", "看当日活动安排；夜场后直接回大阪住宿", Camera],
    ],
    photos: [
      ["usj-real.jpg", "超级任天堂世界", "已选 12:00 入场"],
      ["hogwarts-usj-pexels.jpg", "哈利·波特魔法世界", "主题园区体验"],
      ["usj-globe-unsplash.jpg", "USJ 万圣节", "留到夜场结束再离园"],
    ],
    notes: ["门票已购，含任天堂入场保障；不是快速通关", "核对票面使用日期与二维码", "夜场活动和关园时间以官方日历为准"],
    reserve: "USJ 已购：核对 10/6 日期、12:00 时段与人数",
    accent: "#cf3f2d",
  },
  {
    date: "10.07",
    weekday: "WED",
    city: "大阪 → 关西机场",
    title: "清晨赴关西机场，09:30 返程",
    lead: "9:30 国际航班需很早出发；前晚完成打包，早晨只做退房和赶车。",
    route: "高津 → 南海难波 → 关西机场",
    mapStops: ["大阪高津", "南海难波", "关西 T1"],
    geoStops: [
      ["大阪高津民宿", 34.6674, 135.5145],
      ["南海难波站", 34.6627, 135.5019],
      ["关西机场 T1", 34.4347, 135.2441],
    ],
    schedule: [
      ["约 04:50", "退房前往南海难波", "前晚已打包；步行时间与叫车时间需提前确认", Bed],
      ["建议 05:28", "南海空港急行 → KIX", "现行平日时刻表 06:16 到机场站；临行再复核", Train],
      ["09:30", "关西机场 T1 起飞", "从机场站步行到航站楼，预留值机、托运与出境时间", AirplaneTilt],
    ],
    photos: [
      ["japanese-breakfast-pexels.jpg", "早餐", "前一晚准备便携早餐"],
      ["kansai-airport-real.jpg", "关西机场", "09:30 国际航班"],
      ["dotonbori-unsplash.jpg", "大阪", "旅程结束前的城市记忆"],
    ],
    notes: ["5:28 空港急行比 5:45 更有余量", "前晚把行李和退房事项准备好", "机场站至 T1 及航空公司截载时间需核对"],
    reserve: "机票已购：10/7 09:30；复核当日南海班次",
    accent: "#194b68",
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
          <h2>八天路线地图</h2>
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
            {activeDay === 2 && <p>鳗鱼饭地址尚未收到，地图暂不绘制该餐厅点位。</p>}
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
        <span className="eyebrow">JAPAN TRIP · 8 DAYS</span>
        <h1>东京 · 京都 · 大阪<br />旅行计划</h1>
        <p className="cover-date">2026.09.30 — 10.07</p>
        <div className="cover-route">
          {["东京 3晚", "京都 1晚", "大阪 3晚"].map((stop, index) => (
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
      <span className="cover-stamp">群聊更新版<br />V3.2</span>
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
            <strong>{dayIndex === 6 ? "轻便鞋 · 可快速干燥" : "分层穿搭 · 随身小伞"}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Checklist() {
  const groups = [
    ["已购票 / 已预约", ["10/3 新干线已购，核对车次与座位", "10/6 USJ 已购，核对任天堂 12:00 入场", "9/30 银座和牛：最终时间与晚到规则", "10/1 海鲜丼、10/2 鳗鱼饭、10/3 居酒屋订单"]],
    ["尚待确认", ["10/2 鳗鱼饭准确店址；餐厅地址收到后更新地图", "10/5 普通版周游券可兑清单与游船预约", "10/7 南海 05:28 班次与航空公司截载时间", "10/5 大阪烧不能预约，排队视体力"]],
    ["现场动线", ["首晚银座购物 / Lupin 以航班和晚餐订单为准", "10/1 晚去秋叶原；10/4 京都玩到傍晚再转大阪", "泡汤只作 10/5 上午可选项", "10/6 夜场后打包；10/7 约 04:50 离开住处"]],
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
        <div><MapPin weight="fill" /><strong>大阪</strong><span>3晚</span></div>
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
        <div className="page-dots" style={{ "--page-count": total }}>
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
