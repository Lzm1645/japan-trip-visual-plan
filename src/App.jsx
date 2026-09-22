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
    lead: "首晚以银座为主：YAKINIKU MARUUSHI 銀座本店晚餐，时间允许再逛银座、去 Bar Lupin。",
    route: "成田机场 → MARUUSHI 银座本店 → Bar Lupin → 吾妻桥",
    mapStops: ["成田 T1", "MARUUSHI / 银座", "Bar Lupin（可选）", "吾妻桥片区"],
    geoStops: [
      ["成田机场 T1", 35.7720, 140.3929],
      ["MARUUSHI 银座本店附近", 35.6739, 139.7665],
      ["Bar Lupin", 35.6716, 139.7638],
      ["吾妻桥片区", 35.7107, 139.8016],
    ],
    schedule: [
      ["14:00", "成田机场 T1", "入境、取行李；出关时间不能当成落地时间", AirplaneTilt],
      ["傍晚", "银座购物 / 寄存行李", "MARUUSHI 銀座本店在银座 1 丁目；购物时间以实际出关和餐厅订单为准", Bed],
      ["晚餐后", "MARUUSHI → Bar Lupin", "酒吧在银座 5 丁目；赶不上或等位过久就直接入住", ForkKnife],
    ],
    photos: [
      ["narita-airport.jpg", "成田机场", "落地与进城"],
      ["ginza-jnto.jpg", "银座", "购物、晚餐和酒吧都在同一片区"],
      ["tokyo-skytree.jpg", "吾妻桥", "夜间抵达后入住"],
    ],
    notes: ["若晚餐约 18:00，航班延误风险高", "核对 MARUUSHI 订单时间与晚到规则", "Lupin 只作当晚可选项，不为打卡误了入住"],
    reserve: "MARUUSHI 銀座本店订单；Lupin 营业与等位",
    accent: "#cf3f2d",
  },
  {
    date: "10.01",
    weekday: "THU",
    city: "东京 · 浅草 / 上野 / 秋叶原",
    title: "浅草寿司、博物馆与秋叶原",
    lead: "11:45 在雷门柳小路的ひなと丸吃寿司；下午选一个馆，傍晚秋叶原，晚上回浅草吃一蘭。",
    route: "浅草 → ひなと丸 → 上野 → 秋叶原 → 一蘭浅草",
    mapStops: ["浅草寺", "ひなと丸", "上野博物馆", "秋叶原", "一蘭浅草"],
    geoStops: [
      ["浅草寺", 35.7148, 139.7967],
      ["ひなと丸 雷門柳小路店附近", 35.7124, 139.7966],
      ["东京国立博物馆", 35.7188, 139.7765],
      ["秋叶原", 35.6984, 139.7731],
      ["一蘭 浅草店附近", 35.7103, 139.7978],
    ],
    schedule: [
      ["08:30", "浅草寺 → ひなと丸", "雷门与仲见世；11:45 在雷门柳小路店吃寿司", ForkKnife],
      ["13:30", "上野博物馆", "选东京国立博物馆等一个馆，预留约 2 小时", Ticket],
      ["傍晚", "秋叶原", "目标店、扭蛋或游戏厅；先查想逛店铺的关门时间", Camera],
      ["晚间", "一蘭 浅草店", "从秋叶原返回浅草；别逛到错过末单", ForkKnife],
    ],
    photos: [
      ["sensoji.jpg", "浅草寺", "清晨先避开人流"],
      ["tokyo-national-museum-real.jpg", "东京国立博物馆", "上野公园内的本馆"],
      ["akihabara-unsplash.jpg", "秋叶原", "晚饭前后自由逛"],
    ],
    notes: ["ひなと丸 11:45 餐位按订单核对", "一蘭浅草店目前 22:00 关门、21:45 末单，临行复核", "秋叶原目标店铺的关门时间也需核对"],
    reserve: "ひなと丸订单；一蘭营业时间；博物馆与秋叶原店铺",
    accent: "#194b68",
  },
  {
    date: "10.02",
    weekday: "FRI",
    city: "东京 · 八重洲 / 涩谷",
    title: "八重洲鳗鱼饭，涩谷晚餐",
    lead: "12:30 炭焼うな富士在东京 Midtown 八重洲；上午留在东京站一带，下午去涩谷，晚上よかとこ。",
    route: "吾妻桥 → 东京站 / 八重洲 → 涩谷 PARCO → よかとこ",
    mapStops: ["吾妻桥片区", "东京站", "うな富士八重洲", "涩谷 PARCO", "よかとこ"],
    geoStops: [
      ["吾妻桥片区", 35.7107, 139.8016],
      ["东京站", 35.6812, 139.7671],
      ["炭焼うな富士 东京 Midtown 八重洲", 35.6793, 139.7692],
      ["涩谷 PARCO", 35.6620, 139.6988],
      ["よかとこ 道玄坂附近", 35.6585, 139.6976],
    ],
    schedule: [
      ["上午", "东京站 / 八重洲", "站舍、KITTE 或地下食品街择一，餐前不跨城赶明治神宫", Camera],
      ["12:30", "炭焼うな富士", "东京 Midtown 八重洲 3 楼；按预订时段到店", ForkKnife],
      ["下午", "涩谷 PARCO → 十字路口", "角色商店与购物；Shibuya Sky 可选", Ticket],
      ["晚间", "よかとこ", "位于涩谷道玄坂，和下午逛街同区；核对晚餐时段", ForkKnife],
    ],
    photos: [
      ["tokyo-station-real.jpg", "东京站", "八重洲午餐前顺路浏览"],
      ["midtown-yaesu-commons.jpg", "东京 Midtown 八重洲", "炭焼うな富士所在商场"],
      ["shibuya-crossing-unsplash.jpg", "涩谷", "十字路口与城市夜景"],
    ],
    notes: ["上午以东京站 / 八重洲为主，减少东西折返", "よかとこ在涩谷道玄坂，晚餐后回吾妻桥", "若 10/5 能用券登 Harukas 300，可不买 Shibuya Sky"],
    reserve: "うな富士 12:30 订单；よかとこ晚餐时段；Shibuya Sky 可选",
    accent: "#d44a3a",
  },
  {
    date: "10.03",
    weekday: "SAT",
    city: "东京 → 京都",
    title: "新干线到伏见，傍晚东山",
    lead: "已购新干线；午餐在伏见稻荷 Salmon Noodle，下午清水寺，晚上到市中心 KANEGURA，最后返回伏见住宿。",
    route: "东京站 → 京都站 → 伏见稻荷午餐 → 清水寺 → KANEGURA → 伏见",
    mapStops: ["东京站", "京都站", "Salmon Noodle", "清水寺", "KANEGURA", "伏见住宿片区"],
    geoStops: [
      ["东京站", 35.6812, 139.7671],
      ["京都站", 34.9858, 135.7588],
      ["Salmon Noodle 伏见稻荷店", 34.9666, 135.7710],
      ["清水寺", 34.9949, 135.7850],
      ["KANEGURA 附近", 35.0000, 135.7650],
      ["伏见稻荷住宿片区", 34.9691, 135.7693],
    ],
    schedule: [
      ["按票面", "东京站", "预留进站与买车站便当时间；勿按旧版 11:00 出发", MapPin],
      ["已购票", "东海道新干线", "群聊讨论过约 9 点车次与 D / E 座；以订单为准", Train],
      ["中午", "Salmon Noodle 伏见稻荷店", "先处理行李再去伏见；核对实际车次和店内等位", ForkKnife],
      ["下午", "清水寺 → 二三年坂", "先看开放景点，再沿东山下行", Camera],
      ["19:00", "KANEGURA 伖", "位于四条烏丸一带，不在东山；餐后返回伏见住宿片区", ForkKnife],
    ],
    photos: [
      ["tokyo-station-real.jpg", "东京站", "丸之内红砖站舍"],
      ["fuji-train-unsplash.jpg", "东海道新干线", "天气允许时从 E 座看富士山"],
      ["gion-night-pexels.jpg", "京都夜晚", "居酒屋结束后再散步"],
    ],
    notes: ["京都住宿在伏见稻荷附近，非东山；先确认能否提前放行李", "若不能寄存，大件行李可寄往大阪或使用京都站行李柜", "午餐在伏见，晚餐在市中心，跨区交通需留余量"],
    reserve: "新干线已购：核对车次 / 座位；Salmon Noodle；KANEGURA 19:00 订单",
    accent: "#194b68",
  },
  {
    date: "10.04",
    weekday: "SUN",
    city: "京都 → 大阪",
    title: "京都再玩半天，晚上转大阪",
    lead: "从伏见住宿步行到伏见稻荷；退房后处理行李，下午去永观堂与哲学之道南段，傍晚转大阪。餐食尚未确定。",
    route: "伏见稻荷 → 京都站寄存 → 永观堂 → 哲学之道南段 → 八坂神社 → 大阪",
    mapStops: ["伏见稻荷", "京都站寄存", "永观堂", "哲学之道", "八坂神社", "大阪高津片区"],
    geoStops: [
      ["伏见稻荷", 34.9671, 135.7727],
      ["京都站行李寄存区域", 34.9858, 135.7588],
      ["永观堂", 35.0144, 135.7930],
      ["哲学之道南段", 35.0188, 135.7940],
      ["八坂神社", 35.0036, 135.7785],
      ["大阪高津片区", 34.6675, 135.5103],
    ],
    schedule: [
      ["06:30", "伏见稻荷", "千本鸟居走到奥社附近，不必登顶", MapPin],
      ["上午", "退房 / 行李", "住宿若不能晚取行李，可存京都站或只带过夜包", Bed],
      ["下午", "永观堂 → 哲学之道南段", "寺院参拜受 16:00 停止受理约束；只走南段，不走全长", Camera],
      ["傍晚", "八坂神社 → 京都取行李", "若时间吃紧，八坂神社作路过项；不追 10 月红叶", MapPin],
      ["晚间", "京都 → 大阪", "取行李、晚餐与入住高津；10/4 午晚餐目前待选", Train],
    ],
    photos: [
      ["fushimi-inari-pexels.jpg", "伏见稻荷", "清晨的千本鸟居"],
      ["eikando-commons.jpg", "永观堂", "下午的禅寺与庭园"],
      ["gion-night-pexels.jpg", "八坂神社周边", "晚间转场前慢走"],
    ],
    notes: ["伏见住宿距伏见稻荷近，清晨可步行前往", "退房后若去京都北部，别把行李留在伏见造成回头路", "永观堂与哲学之道优先；八坂神社可删"],
    reserve: "10/4 午晚餐待选；行李寄存；永观堂开放时间",
    accent: "#cf3f2d",
  },
  {
    date: "10.05",
    weekday: "MON",
    city: "大阪 · 市区",
    title: "大阪市区与福太郎本店",
    lead: "普通版关西乐享周游券拟选 Harukas 300 与道顿堀游船两项；均须先核对实际券面权益。",
    route: "高津 → Harukas 300 → 心斋桥 → 道顿堀游船 → 福太郎本店",
    mapStops: ["大阪高津片区", "Harukas 300（待核）", "心斋桥", "道顿堀游船（待核）", "福太郎本店"],
    geoStops: [
      ["大阪高津片区", 34.6675, 135.5103],
      ["Harukas 300", 34.6455, 135.5137],
      ["心斋桥", 34.6746, 135.5016],
      ["Wonder Cruise 日本桥船着场", 34.6686, 135.5077],
      ["福太郎 本店", 34.6656, 135.5045],
    ],
    schedule: [
      ["上午", "慢早餐 / 泡汤二选一", "SPA WORLD 保留为可选；若泡汤就压缩购物，不再叠加大阪城", MapPin],
      ["下午", "Harukas 300 → 心斋桥", "拟兑第一项；如券面不含此权益，则按兴趣决定是否自费", Camera],
      ["傍晚", "道顿堀 Wonder Cruise", "拟兑第二项；周一须先按周游券规则预约时段", Ticket],
      ["晚间", "福太郎 本店", "千日前大阪烧；本店不接受预约，预留排队时间与附近替补", ForkKnife],
    ],
    photos: [
      ["harukas-300-commons.jpg", "Harukas 300", "登高看大阪城市景观"],
      ["dotonbori-unsplash.jpg", "道顿堀", "拟乘游船并在附近吃大阪烧"],
      ["onsen-pexels.jpg", "泡汤", "与购物二选一的上午体验"],
    ],
    notes: ["10/5 午餐尚未确定，可按泡汤 / 天王寺动线现场选择", "核对普通版券面权益；Wonder Cruise 周一需预订", "福太郎本店无法预约，排队超预算时用附近替补"],
    reserve: "周游券权益 / 游船预约；福太郎本店现场排队",
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
      ["大阪高津片区", 34.6675, 135.5103],
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
      ["大阪高津片区", 34.6675, 135.5103],
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
            <p>住宿仅标片区／邻近车站；餐厅点位按公开地址标示，实际步行路线以导航为准。</p>
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
          <span><Bed /> 吾妻桥 / 伏见稻荷 / 高津</span>
        </div>
      </div>
      <div className="cover-gallery">
        {coverPhotos.map((photo, index) => (
          <Photo key={photo[0]} item={photo} large={index === 0} />
        ))}
      </div>
      <span className="cover-stamp">餐食动线版<br />V3.4</span>
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
    ["已购票 / 已预约", ["10/3 新干线已购，核对车次与座位", "10/6 USJ 已购，核对任天堂 12:00 入场", "9/30 MARUUSHI、10/1 ひなと丸：核对订单时段", "10/2 うな富士、10/3 KANEGURA：核对订单人数与取消规则"]],
    ["尚待确认", ["10/1 一蘭、10/2 よかとこ、10/3 Salmon Noodle：确认营业 / 预约情况", "10/4 午晚餐与 10/5 午餐待定", "10/5 周游券权益与游船预约；福太郎本店现场排队", "10/7 南海 05:28 班次与航空公司截载时间"]],
    ["现场动线", ["首晚银座购物 / Lupin 以航班和 MARUUSHI 订单为准", "10/3 京都住宿在伏见稻荷，先确认寄存行李", "10/4 退房后寄存行李再去永观堂；晚上转大阪", "10/6 夜场后打包；10/7 约 04:50 离开住处"]],
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

function SuggestedPlan() {
  return (
    <section className="slide suggestion-slide">
      <header>
        <span className="eyebrow">OPTIONAL ROUTE · FOR DISCUSSION</span>
        <h2>空档行程建议</h2>
        <p>保留已购车票、USJ 门票与现有餐厅。以下新增安排仅供同行讨论，尚未预订。</p>
      </header>

      <div className="suggestion-tokyo">
        <div className="suggestion-date"><strong>10.02</strong><span>东京上午</span></div>
        <p><b>银座购物 10:00–11:45</b>，随后去八重洲吃 12:30 的炭焼うな富士。首晚落地后只保证晚餐，Lupin 视体力决定。</p>
      </div>

      <div className="suggestion-columns">
        <article>
          <div className="suggestion-date"><strong>10.04</strong><span>京都至大阪</span></div>
          <h3>伏见清晨，南禅寺午餐</h3>
          <ol>
            <li><time>06:30</time><span>伏见稻荷；退房后到京都站寄存行李</span></li>
            <li><time>11:00</time><span>南禅寺散步，午餐候选：顺正汤豆腐</span></li>
            <li><time>14:00</time><span>永观堂与哲学之道南段，不追红叶</span></li>
            <li><time>傍晚</time><span>回京都站取行李，前往大阪</span></li>
            <li><time>晚餐</time><span>候选：串炸达摩法善寺店</span></li>
          </ol>
        </article>
        <article>
          <div className="suggestion-date"><strong>10.05</strong><span>大阪市区</span></div>
          <h3>泡汤后到道顿堀</h3>
          <ol>
            <li><time>10:00</time><span>SPA WORLD 泡汤约两小时</span></li>
            <li><time>12:15</time><span>天王寺轻午餐：やまちゃん章鱼烧＋轻食</span></li>
            <li><time>13:30</time><span>Harukas 300；下午回难波购物</span></li>
            <li><time>17:30</time><span>Wonder Cruise，先核对券面并预约</span></li>
            <li><time>晚餐</time><span>福太郎本店；排队过久就用附近替补</span></li>
          </ol>
        </article>
      </div>

      <footer className="suggestion-foot">
        <strong>先核对</strong>
        <span>京都站寄存须按时取件；泡汤有纹身限制；游船持 Fun Kansai Pass 应选 17:00 后班次。</span>
        <a href="https://www.kyoto-station-building.co.jp/qa/" target="_blank" rel="noreferrer">京都站</a>
        <a href="https://www.spaworld.co.jp/english/info/ryokin/" target="_blank" rel="noreferrer">SPA WORLD</a>
        <a href="https://wondercruise.jp/en/wondercruise/" target="_blank" rel="noreferrer">Wonder Cruise</a>
      </footer>
    </section>
  );
}

export function App() {
  const total = days.length + 4;
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
    if (page === total - 2) return <Checklist />;
    if (page === total - 1) return <SuggestedPlan />;
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
              <span>{index === 0 ? "封面" : index === 1 ? "地图" : index === total - 2 ? "清单" : index === total - 1 ? "建议" : `D${index - 1}`}</span>
            </button>
          ))}
        </div>
        <span className="page-count">{String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <button className="arrow-button" aria-label="下一页" disabled={page === total - 1} onClick={() => safeSetPage(page + 1)}><ArrowRight /></button>
      </nav>
    </main>
  );
}
