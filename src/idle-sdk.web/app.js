const DEFAULT_STACK_LIMIT = 1000000;

const ITEM_DEFS = {
    chip_green: {
        name: "Green Chips",
        icon: "assets/icons/chip_green_dark.png",
        description: "Lucky green tokens earned from scratchers.",
        price: 2,
        stackLimit: DEFAULT_STACK_LIMIT,
        stackable: true,
        unique: false
    },
    chip_blue: {
        name: "Blue Chips",
        icon: "assets/icons/chip_blue_dark.png",
        description: "Rare keno chips with higher exchange value.",
        price: 5,
        stackLimit: DEFAULT_STACK_LIMIT,
        stackable: true,
        unique: false
    }
};

const CURRENCY_DEFS = {
    cash: { name: "Cash", icon: "assets/icons/cash_dark.png" },
    credit: { name: "Credit", icon: "assets/icons/credit_dark.png" }
};

const DEFAULT_RENDER_FPS_CAP = 30;
const DEFAULT_MODEL_VIEWER_SETTINGS = Object.freeze({
    autoRotate: false,
    rotateSensitivity: 0.01,
    zoomMin: 0.7,
    zoomMax: 1.6,
    zoomSpeed: 0.9
});

const state = {
    tickRate: 1,
    tick: 0,
    isLocked: false,
    sandboxEnabled: true,
    debugControlsEnabled: true,
    zoom: 1,
    renderFpsCap: DEFAULT_RENDER_FPS_CAP,
    modelViewer: { ...DEFAULT_MODEL_VIEWER_SETTINGS },
    skillXpMultiplier: 1,
    rewardMultiplier: 1,
    cashMultiplier: 1,
    clickXpBonus: 0,
    clickXpBonusPerClick: 0.0001,
    clickXpBonusMax: 0.25,
    clickXpBonusDecayPerSecond: 0.06,
    clickEnergyPerClick: 0.04,
    clickEnergyDecayPerSecond: 4.2,
    clickEnergyMax: 1.4,
    clickEnergyLevelUpBoost: 0.6,
    clickEnergyLevelUpPerLevel: 0.2,
    ringParticlesEnabled: true,
    lastActiveSkillId: null,
    wallet: { cash: 125, credit: 40 },
    inventorySlots: [],
    inventoryHistory: {},
    skills: [
        {
            id: "gambling",
            name: "Gambling",
            icon: "🎰",
            iconImage: "assets/icons/slots_dark.png",
            level: 1,
            xp: 0,
            maxLevel: 60,
            active: false,
            task: "scratchers",
            tasks: [
                {
                    id: "scratchers",
                    label: "Scratchers",
                    level: 1,
                    reward: "1-3 Green Chips",
                    rewardItemId: "chip_green",
                    iconImage: "assets/icons/scratcher_dark.png"
                },
                {
                    id: "keno",
                    label: "Keno games",
                    level: 5,
                    reward: "1-3 Blue Chips",
                    rewardItemId: "chip_blue",
                    iconImage: "assets/icons/keno_dark.png"
                }
            ]
        }
    ],
    world: ["Universe: Meadow", "World: Bristlewood", "Region: North Reach", "Zone: Clearing", "Node: Camp"],
    equipment: ["Starter Deck", "Lucky Token"],
    quests: ["Win Scratchers (0/5)", "Play Keno (0/3)"],
    achievements: ["High Roller (0/10)", "Stack Chips (0/12)"],
    collections: ["Gambling Set: 1/3"],
    combat: ["player hits slime (3)", "slime misses"],
    crafting: ["Redeem Chips x1 (2 green)", "Lucky Charm x1 (1 blue)"],
    trade: ["3 Green Chips -> 2 Cash"],
    generator: ["Biome: Casino", "Weather: Neon"],
    compendium: ["Green Chips", "Blue Chips"],
    saveStatus: "Ready",
    contentPacks: []
};

const ui = {
    saveStatus: document.getElementById("saveStatus"),
    worldList: document.getElementById("worldList"),
    walletList: document.getElementById("walletList"),
    skillsList: document.getElementById("skillsList"),
    skillIcon: document.getElementById("skillIcon"),
    skillIconImg: document.getElementById("skillIconImg"),
    skillName: document.getElementById("skillName"),
    skillDetails: document.getElementById("skillDetails"),
    skillLevel: document.getElementById("skillLevel"),
    taskList: document.getElementById("taskList"),
    taskAction: document.getElementById("taskAction"),
    taskActionHint: document.getElementById("taskActionHint"),
    inventoryList: document.getElementById("inventoryList"),
    inventoryPopover: document.getElementById("inventoryPopover"),
    popoverIcon: document.getElementById("popoverIcon"),
    popoverName: document.getElementById("popoverName"),
    popoverDesc: document.getElementById("popoverDesc"),
    popoverStack: document.getElementById("popoverStack"),
    popoverValue: document.getElementById("popoverValue"),
    popoverGraph: document.getElementById("popoverGraph"),
    equipmentList: document.getElementById("equipmentList"),
    questList: document.getElementById("questList"),
    achievementList: document.getElementById("achievementList"),
    collectionList: document.getElementById("collectionList"),
    combatList: document.getElementById("combatList"),
    craftingList: document.getElementById("craftingList"),
    tradeList: document.getElementById("tradeList"),
    generatorList: document.getElementById("generatorList"),
    compendiumList: document.getElementById("compendiumList"),
    contextRing: document.getElementById("contextRing"),
    contextRingSvg: document.getElementById("contextRingSvg"),
    contextRingProgress: document.getElementById("contextRingProgress"),
    contextRingTip: document.getElementById("contextRingTip"),
    contextRingParticles: document.getElementById("contextRingParticles"),
    contextRingWrap: document.querySelector(".ring-wrap"),
    debugOverlay: document.getElementById("debugOverlay"),
    debugTickRate: document.getElementById("debugTickRate"),
    debugFps: document.getElementById("debugFps"),
    debugUiUpdates: document.getElementById("debugUiUpdates"),
    debugOnline: document.getElementById("debugOnline"),
    debugOffline: document.getElementById("debugOffline"),
    runtimePerf: document.getElementById("runtimePerf"),
    runtimeSession: document.getElementById("runtimeSession"),
    runtimeHost: document.getElementById("runtimeHost"),
    runtimeProtocol: document.getElementById("runtimeProtocol"),
    runtimeDevMode: document.getElementById("runtimeDevMode"),
    runtimeRenderer: document.getElementById("runtimeRenderer"),
    runtimeEngine: document.getElementById("runtimeEngine"),
    runtimeStorage: document.getElementById("runtimeStorage"),
    runtimeErrors: document.getElementById("runtimeErrors"),
    runtimeGraph: document.getElementById("runtimeGraph"),
    runtimeUptime: document.getElementById("runtimeUptime"),
    runtimeSaved: document.getElementById("runtimeSaved"),
    tickBtn: document.getElementById("tickBtn"),
    offlineBtn: document.getElementById("offlineBtn"),
    saveBtn: document.getElementById("saveBtn"),
    loadBtn: document.getElementById("loadBtn"),
    pinnedInspector: document.getElementById("pinnedInspector"),
    walletInspector: document.getElementById("walletInspector"),
    inventoryInspector: document.getElementById("inventoryInspector"),
    skillInspector: document.getElementById("skillInspector"),
    contentPackInspector: document.getElementById("contentPackInspector"),
    moduleInspector: document.getElementById("moduleInspector"),
    externalModuleInput: document.getElementById("externalModuleInput"),
    loadModulesBtn: document.getElementById("loadModulesBtn"),
    clearModulesBtn: document.getElementById("clearModulesBtn"),
    debugOverlayPanel: document.querySelector(".overlay-panel"),
    debugSizeToggle: document.getElementById("toggleDebugSize"),
    debugControlsToggle: document.getElementById("debugControlsToggle"),
    freezeTicksToggle: document.getElementById("freezeTicksToggle"),
    tickBatchInput: document.getElementById("tickBatchInput"),
    tickBatchBtn: document.getElementById("tickBatchBtn"),
    tickBatchTime: document.getElementById("tickBatchTime"),
    themeDialog: document.getElementById("themeDialog"),
    themeList: document.getElementById("themeList"),
    themeJson: document.getElementById("themeJson"),
    applyThemeJson: document.getElementById("applyThemeJson"),
    reloadThemesBtn: document.getElementById("reloadThemesBtn"),
    openThemeBtn: document.getElementById("openTheme"),
    closeThemeBtn: document.getElementById("closeTheme"),
    openErrorsBtn: document.getElementById("openErrors"),
    errorDialog: document.getElementById("errorDialog"),
    errorList: document.getElementById("errorList"),
    errorDetails: document.getElementById("errorDetails"),
    copyErrorsBtn: document.getElementById("copyErrors"),
    clearErrorsBtn: document.getElementById("clearErrors"),
    closeErrorsBtn: document.getElementById("closeErrors"),
    modelViewerDialog: document.getElementById("modelViewerDialog"),
    modelViewerViewport: document.getElementById("modelViewerViewport"),
    modelViewerStatus: document.getElementById("modelViewerStatus"),
    modelViewerTitle: document.getElementById("modelViewerTitle"),
    modelViewerCloseBtn: document.getElementById("modelViewerClose"),
    modelViewerResetBtn: document.getElementById("modelViewerReset"),
    modelViewerRotateLeft: document.getElementById("modelViewerRotateLeft"),
    modelViewerRotateRight: document.getElementById("modelViewerRotateRight"),
    modelViewerAutoRotate: document.getElementById("modelViewerAutoRotate"),
    modelViewerZoom: document.getElementById("modelViewerZoom"),
    modelViewerZoomIn: document.getElementById("modelViewerZoomIn"),
    modelViewerZoomOut: document.getElementById("modelViewerZoomOut"),
    modelViewerZoomValue: document.getElementById("modelViewerZoomValue"),
    modelUploadInput: document.getElementById("modelUploadInput"),
    modelClearBtn: document.getElementById("modelClearBtn"),
    modelUploadName: document.getElementById("modelUploadName"),
    modelExpandBtn: document.getElementById("modelExpandBtn"),
    zoomSlider: document.getElementById("zoomSlider"),
    zoomValue: document.getElementById("zoomValue"),
    comboMeter: document.getElementById("comboMeter"),
    comboValue: document.getElementById("comboValue"),
    comboFill: document.getElementById("comboFill")
};

let selectedSkillId = "gambling";
let pendingTaskBounceId = null;
let lastTaskListKey = "";
let running = true;
let lastTick = performance.now();
let fpsFrames = 0;
let fpsElapsed = 0;
let uiUpdates = 0;
let lastUiUpdateCount = 0;
let lastOfflineSeconds = 0;
let lastParticleTime = 0;
let lastCompletionBurst = 0;
let popoverPinned = false;
let pendingIconBurstAt = 0;
let pendingIconBurstSkillId = null;
let iconComboLevel = 0;
let iconComboExpireAt = 0;
let iconBurstTimeoutId = null;
let tickIntervalId = null;
let iconEnergy = 0;
let iconEnergyVelocity = 0;
let modelRenderer = null;
const errorLog = [];
let threeLoaderPromise = null;
let threeModule = null;
let gltfLoaderCtor = null;
let objLoaderCtor = null;
let orbitControlsCtor = null;
let modelUploadUrl = null;
const modelTypeOverrides = new Map();
const rawConsoleWarn = console.warn.bind(console);
const rawConsoleError = console.error.bind(console);
const rawConsoleInfo = (console.info ?? console.log).bind(console);
let currentFps = 0;
let tickRateObserved = 0;
let telemetryElapsed = 0;
const tickSamples = [];
const pinnedProperties = new Set();
const pinnedUi = new Map();
const runtimeFpsSamples = [];
let runtimeGraphCtx = null;
const sessionStartedAt = Date.now();
let lastSavedAt = null;

const moduleState = {
    simulation: { enabled: true },
    skills: { enabled: true },
    inventory: { enabled: true },
    economy: { enabled: true },
    renderer: { enabled: true },
    renderer3d: { enabled: true }
};

const DEFAULT_MODULE_STATE = Object.freeze({
    simulation: { enabled: true },
    skills: { enabled: true },
    inventory: { enabled: true },
    economy: { enabled: true },
    renderer: { enabled: true },
    renderer3d: { enabled: true }
});

const moduleDefinitions = [
    {
        id: "simulation",
        name: "Simulation",
        version: "1.0.0",
        description: "Controls tick timing and lock state.",
        properties: [
            {
                id: "tickRate",
                label: "Tick Rate",
                type: "number",
                min: 0.5,
                max: 5,
                step: 0.5,
                get: () => state.tickRate,
                set: (value) => applyTickRate(value)
            },
            {
                id: "locked",
                label: "Locked",
                type: "boolean",
                get: () => state.isLocked,
                set: (value) => {
                    state.isLocked = value;
                    refreshToggleButtons();
                }
            }
        ]
    },
    {
        id: "skills",
        name: "Skill System",
        version: "1.0.0",
        description: "XP gain, unlocks, and skill context.",
        properties: [
            {
                id: "xpMultiplier",
                label: "XP Multiplier",
                type: "number",
                min: 0,
                max: 5,
                step: 0.1,
                get: () => state.skillXpMultiplier,
                set: (value) => {
                    state.skillXpMultiplier = clamp(value, 0, 5);
                }
            }
        ]
    },
    {
        id: "active-skilling",
        name: "Active Skilling",
        version: "1.0.0",
        description: "Click-based XP bonus and icon energy feedback.",
        properties: [
            {
                id: "clickBonus",
                label: "Current Click Bonus",
                type: "number",
                min: 0,
                max: 0.5,
                step: 0.001,
                get: () => state.clickXpBonus,
                set: (value) => {
                    state.clickXpBonus = clamp(value, 0, state.clickXpBonusMax);
                }
            },
            {
                id: "clickBonusPerClick",
                label: "Bonus per Click",
                type: "number",
                min: 0,
                max: 0.05,
                step: 0.0001,
                get: () => state.clickXpBonusPerClick,
                set: (value) => {
                    state.clickXpBonusPerClick = clamp(value, 0, 0.05);
                }
            },
            {
                id: "clickBonusMax",
                label: "Bonus Cap",
                type: "number",
                min: 0,
                max: 1,
                step: 0.01,
                get: () => state.clickXpBonusMax,
                set: (value) => {
                    state.clickXpBonusMax = clamp(value, 0, 1);
                }
            },
            {
                id: "clickBonusDecay",
                label: "Bonus Decay/sec",
                type: "number",
                min: 0,
                max: 1,
                step: 0.01,
                get: () => state.clickXpBonusDecayPerSecond,
                set: (value) => {
                    state.clickXpBonusDecayPerSecond = clamp(value, 0, 1);
                }
            },
            {
                id: "energyPerClick",
                label: "Energy per Click",
                type: "number",
                min: 0,
                max: 1,
                step: 0.01,
                get: () => state.clickEnergyPerClick,
                set: (value) => {
                    state.clickEnergyPerClick = clamp(value, 0, 1);
                }
            },
            {
                id: "energyDecay",
                label: "Energy Decay/sec",
                type: "number",
                min: 0,
                max: 10,
                step: 0.1,
                get: () => state.clickEnergyDecayPerSecond,
                set: (value) => {
                    state.clickEnergyDecayPerSecond = clamp(value, 0, 10);
                }
            },
            {
                id: "energyMax",
                label: "Energy Max",
                type: "number",
                min: 0.5,
                max: 4,
                step: 0.1,
                get: () => state.clickEnergyMax,
                set: (value) => {
                    state.clickEnergyMax = clamp(value, 0.5, 4);
                }
            },
            {
                id: "energyLevelUp",
                label: "Energy per Level Up",
                type: "number",
                min: 0,
                max: 2,
                step: 0.05,
                get: () => state.clickEnergyLevelUpBoost,
                set: (value) => {
                    state.clickEnergyLevelUpBoost = clamp(value, 0, 2);
                }
            },
            {
                id: "energyLevelUpPer",
                label: "Energy per Level Gained",
                type: "number",
                min: 0,
                max: 1,
                step: 0.05,
                get: () => state.clickEnergyLevelUpPerLevel,
                set: (value) => {
                    state.clickEnergyLevelUpPerLevel = clamp(value, 0, 1);
                }
            }
        ]
    },
    {
        id: "inventory",
        name: "Inventory System",
        version: "1.0.0",
        description: "Reward drops and stack handling.",
        properties: [
            {
                id: "rewardMultiplier",
                label: "Reward Multiplier",
                type: "number",
                min: 0,
                max: 5,
                step: 0.1,
                get: () => state.rewardMultiplier,
                set: (value) => {
                    state.rewardMultiplier = clamp(value, 0, 5);
                }
            }
        ]
    },
    {
        id: "economy",
        name: "Economy System",
        version: "1.0.0",
        description: "Wallet updates and currency gains.",
        properties: [
            {
                id: "cashMultiplier",
                label: "Cash Gain Multiplier",
                type: "number",
                min: 0,
                max: 5,
                step: 0.1,
                get: () => state.cashMultiplier,
                set: (value) => {
                    state.cashMultiplier = clamp(value, 0, 5);
                }
            }
        ]
    },
    {
        id: "renderer",
        name: "Renderer",
        version: "1.0.0",
        description: "Visual effects and camera settings.",
        properties: [
            {
                id: "fpsCap",
                label: "FPS Cap",
                type: "number",
                min: 0,
                max: 240,
                step: 5,
                get: () => state.renderFpsCap,
                set: (value) => {
                    const next = clamp(Number(value) || 0, 0, 240);
                    state.renderFpsCap = next;
                    persistModuleState();
                }
            },
            {
                id: "zoom",
                label: "Zoom",
                type: "number",
                min: 0.75,
                max: 1.5,
                step: 0.01,
                get: () => state.zoom,
                set: (value) => applyZoom(value)
            },
            {
                id: "ringParticles",
                label: "Ring Particles",
                type: "boolean",
                get: () => state.ringParticlesEnabled,
                set: (value) => {
                    state.ringParticlesEnabled = Boolean(value);
                }
            }
        ]
    },
    {
        id: "renderer3d",
        name: "Renderer (3D)",
        version: "1.0.0",
        description: "Three.js model previews and debug viewport.",
        properties: [
            {
                id: "autoRotate",
                label: "Auto Rotate",
                type: "boolean",
                get: () => state.modelViewer.autoRotate,
                set: (value) => {
                    state.modelViewer.autoRotate = Boolean(value);
                    applyModelViewerSettings();
                }
            },
            {
                id: "rotateSensitivity",
                label: "Rotate Sensitivity",
                type: "number",
                min: 0.002,
                max: 0.05,
                step: 0.002,
                get: () => state.modelViewer.rotateSensitivity,
                set: (value) => {
                    state.modelViewer.rotateSensitivity = clamp(Number(value) || 0.01, 0.002, 0.05);
                    applyModelViewerSettings();
                }
            },
            {
                id: "zoomMin",
                label: "Zoom Min",
                type: "number",
                min: 0.4,
                max: 1,
                step: 0.05,
                get: () => state.modelViewer.zoomMin,
                set: (value) => {
                    state.modelViewer.zoomMin = clamp(Number(value) || 0.7, 0.4, 1);
                    applyModelViewerSettings();
                }
            },
            {
                id: "zoomMax",
                label: "Zoom Max",
                type: "number",
                min: 1,
                max: 3,
                step: 0.05,
                get: () => state.modelViewer.zoomMax,
                set: (value) => {
                    state.modelViewer.zoomMax = clamp(Number(value) || 1.6, 1, 3);
                    applyModelViewerSettings();
                }
            },
            {
                id: "zoomSpeed",
                label: "Zoom Speed",
                type: "number",
                min: 0.2,
                max: 2,
                step: 0.05,
                get: () => state.modelViewer.zoomSpeed,
                set: (value) => {
                    state.modelViewer.zoomSpeed = clamp(Number(value) || 0.9, 0.2, 2);
                    applyModelViewerSettings();
                }
            }
        ]
    }
];

const externalModules = [];

const builtinThemes = [
    {
        id: "midnight",
        name: "Midnight",
        source: "built-in",
        mode: "dark",
        colors: {
            "--bg": "#0b0f14",
            "--panel": "#111823",
            "--card": "#151d2a",
            "--card-border": "#273244",
            "--text": "#e2e8f0",
            "--muted": "#93a4b8",
            "--accent": "#60a5fa",
            "--accent-strong": "#3b82f6",
            "--ring-track": "rgba(17, 24, 35, 0.55)",
            "--glow-1": "#f6c8ff",
            "--glow-2": "#b7f7ff",
            "--glow-3": "#b7ffd8",
            "--glow-4": "#ffe6a7",
            "--ring-glow": "rgba(183, 247, 255, 0.18)",
            "--ring-progress-glow": "rgba(183, 247, 255, 0.45)",
            "--ring-tip-core": "rgba(255, 255, 255, 0.95)",
            "--ring-tip-mid": "rgba(183, 247, 255, 0.65)",
            "--ring-tip-outer": "rgba(246, 200, 255, 0)",
            "--ring-tip-shadow": "rgba(182, 247, 255, 0.35)"
        }
    },
    {
        id: "obsidian",
        name: "Obsidian",
        source: "built-in",
        mode: "dark",
        colors: {
            "--bg": "#0a0b10",
            "--panel": "#0f1420",
            "--card": "#141a28",
            "--card-border": "#263145",
            "--text": "#e5e7eb",
            "--muted": "#8c98ad",
            "--accent": "#22d3ee",
            "--accent-strong": "#06b6d4",
            "--ring-track": "rgba(24, 30, 45, 0.6)",
            "--glow-1": "#67e8f9",
            "--glow-2": "#a5f3fc",
            "--glow-3": "#bae6fd",
            "--glow-4": "#fde68a",
            "--ring-glow": "rgba(34, 211, 238, 0.2)",
            "--ring-progress-glow": "rgba(34, 211, 238, 0.5)",
            "--ring-tip-core": "rgba(255, 255, 255, 0.95)",
            "--ring-tip-mid": "rgba(34, 211, 238, 0.6)",
            "--ring-tip-outer": "rgba(34, 211, 238, 0)",
            "--ring-tip-shadow": "rgba(34, 211, 238, 0.35)"
        }
    },
    {
        id: "ember",
        name: "Ember",
        source: "built-in",
        mode: "dark",
        colors: {
            "--bg": "#120b0b",
            "--panel": "#1a1212",
            "--card": "#221717",
            "--card-border": "#3a2a2a",
            "--text": "#f8e7dc",
            "--muted": "#b6a39a",
            "--accent": "#fb7185",
            "--accent-strong": "#f43f5e",
            "--ring-track": "rgba(58, 42, 42, 0.6)",
            "--glow-1": "#fb7185",
            "--glow-2": "#fda4af",
            "--glow-3": "#fdba74",
            "--glow-4": "#fde68a",
            "--ring-glow": "rgba(251, 113, 133, 0.2)",
            "--ring-progress-glow": "rgba(251, 113, 133, 0.5)",
            "--ring-tip-core": "rgba(255, 255, 255, 0.95)",
            "--ring-tip-mid": "rgba(251, 113, 133, 0.6)",
            "--ring-tip-outer": "rgba(251, 113, 133, 0)",
            "--ring-tip-shadow": "rgba(251, 113, 133, 0.35)"
        }
    },
    {
        id: "daylight",
        name: "Daylight",
        source: "built-in",
        mode: "light",
        colors: {
            "--bg": "#edf2f7",
            "--panel": "#f8fafc",
            "--card": "#ffffff",
            "--card-border": "#d7e0ec",
            "--text": "#0f172a",
            "--muted": "#475569",
            "--accent": "#2563eb",
            "--accent-strong": "#1d4ed8",
            "--ring-track": "rgba(148, 163, 184, 0.6)",
            "--glow-1": "#93c5fd",
            "--glow-2": "#38bdf8",
            "--glow-3": "#86efac",
            "--glow-4": "#fde68a",
            "--ring-glow": "rgba(59, 130, 246, 0.18)",
            "--ring-progress-glow": "rgba(37, 99, 235, 0.45)",
            "--ring-tip-core": "rgba(255, 255, 255, 0.95)",
            "--ring-tip-mid": "rgba(59, 130, 246, 0.55)",
            "--ring-tip-outer": "rgba(37, 99, 235, 0)",
            "--ring-tip-shadow": "rgba(37, 99, 235, 0.35)"
        }
    },
    {
        id: "linen",
        name: "Linen",
        source: "built-in",
        mode: "light",
        colors: {
            "--bg": "#f7f1ea",
            "--panel": "#fff9f2",
            "--card": "#ffffff",
            "--card-border": "#e2d6c9",
            "--text": "#2b2a28",
            "--muted": "#6b6258",
            "--accent": "#f97316",
            "--accent-strong": "#ea580c",
            "--ring-track": "rgba(148, 136, 122, 0.5)",
            "--glow-1": "#fdba74",
            "--glow-2": "#fcd34d",
            "--glow-3": "#a7f3d0",
            "--glow-4": "#93c5fd",
            "--ring-glow": "rgba(249, 115, 22, 0.18)",
            "--ring-progress-glow": "rgba(249, 115, 22, 0.45)",
            "--ring-tip-core": "rgba(255, 255, 255, 0.95)",
            "--ring-tip-mid": "rgba(249, 115, 22, 0.45)",
            "--ring-tip-outer": "rgba(249, 115, 22, 0)",
            "--ring-tip-shadow": "rgba(249, 115, 22, 0.35)"
        }
    },
    {
        id: "frost",
        name: "Frost",
        source: "built-in",
        mode: "light",
        colors: {
            "--bg": "#eef5ff",
            "--panel": "#f6faff",
            "--card": "#ffffff",
            "--card-border": "#d5e3f6",
            "--text": "#0f172a",
            "--muted": "#475569",
            "--accent": "#0ea5e9",
            "--accent-strong": "#0284c7",
            "--ring-track": "rgba(148, 163, 184, 0.5)",
            "--glow-1": "#a5f3fc",
            "--glow-2": "#60a5fa",
            "--glow-3": "#93c5fd",
            "--glow-4": "#fde68a",
            "--ring-glow": "rgba(14, 165, 233, 0.18)",
            "--ring-progress-glow": "rgba(14, 165, 233, 0.45)",
            "--ring-tip-core": "rgba(255, 255, 255, 0.95)",
            "--ring-tip-mid": "rgba(14, 165, 233, 0.5)",
            "--ring-tip-outer": "rgba(14, 165, 233, 0)",
            "--ring-tip-shadow": "rgba(14, 165, 233, 0.35)"
        }
    }
];

const themePacks = [];

const DEV_MODE = location.hostname === "localhost"
    || location.hostname === "127.0.0.1"
    || new URLSearchParams(location.search).has("dev")
    || localStorage.getItem("idle-sdk-dev") === "1";

const STORAGE_KEY = "idle-sdk-web-demo-state";
const MODULE_STORAGE_KEY = "idle-sdk-web-demo-modules";
const THEME_STORAGE_KEY = "idle-sdk-web-demo-theme";
const PINNED_STORAGE_KEY = "idle-sdk-web-demo-pins";
const RING_RADIUS = 38;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const skillUi = new Map();
const skillProgress = new Map();
const skillCompletionHold = new Map();
const contextCard = document.querySelector(".skill-context");

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function isModuleEnabled(moduleId) {
    return moduleState[moduleId]?.enabled !== false;
}

function persistModuleState() {
    const snapshot = {
        modules: moduleState,
        values: {
            tickRate: state.tickRate,
            skillXpMultiplier: state.skillXpMultiplier,
            rewardMultiplier: state.rewardMultiplier,
            cashMultiplier: state.cashMultiplier,
            clickXpBonus: state.clickXpBonus,
            clickXpBonusPerClick: state.clickXpBonusPerClick,
            clickXpBonusMax: state.clickXpBonusMax,
            clickXpBonusDecayPerSecond: state.clickXpBonusDecayPerSecond,
            clickEnergyPerClick: state.clickEnergyPerClick,
            clickEnergyDecayPerSecond: state.clickEnergyDecayPerSecond,
            clickEnergyMax: state.clickEnergyMax,
            clickEnergyLevelUpBoost: state.clickEnergyLevelUpBoost,
            clickEnergyLevelUpPerLevel: state.clickEnergyLevelUpPerLevel,
            ringParticlesEnabled: state.ringParticlesEnabled,
            debugControlsEnabled: state.debugControlsEnabled,
            zoom: state.zoom,
            renderFpsCap: state.renderFpsCap,
            modelViewer: {
                autoRotate: state.modelViewer.autoRotate,
                rotateSensitivity: state.modelViewer.rotateSensitivity,
                zoomMin: state.modelViewer.zoomMin,
                zoomMax: state.modelViewer.zoomMax,
                zoomSpeed: state.modelViewer.zoomSpeed
            }
        },
        externalModules
    };
    localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(snapshot));
}

function resetModulePreferencesToDefaults() {
    Object.keys(moduleState).forEach((key) => delete moduleState[key]);
    Object.entries(DEFAULT_MODULE_STATE).forEach(([key, value]) => {
        moduleState[key] = { enabled: value.enabled !== false };
    });
    state.renderFpsCap = DEFAULT_RENDER_FPS_CAP;
    state.modelViewer = { ...DEFAULT_MODEL_VIEWER_SETTINGS };
    state.debugControlsEnabled = true;
    externalModules.length = 0;
    pinnedProperties.clear();
    getDefaultPinnedProperties().forEach((id) => pinnedProperties.add(id));
    savePinnedProperties();
    localStorage.removeItem(MODULE_STORAGE_KEY);
    localStorage.removeItem(PINNED_STORAGE_KEY);
}

function getDefaultPinnedProperties() {
    return [
        "telemetry.fps",
        "telemetry.tickRate",
        "telemetry.errors",
        "module:simulation:tickRate",
        "wallet.cash",
        "wallet.credit"
    ];
}

function loadPinnedProperties() {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                pinnedProperties.clear();
                parsed.forEach((id) => pinnedProperties.add(id));
            }
        } catch {
            pinnedProperties.clear();
        }
    }
    if (pinnedProperties.size === 0) {
        getDefaultPinnedProperties().forEach((id) => pinnedProperties.add(id));
    }
    savePinnedProperties();
}

function savePinnedProperties() {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify([...pinnedProperties]));
}

function isPinned(id) {
    return pinnedProperties.has(id);
}

function togglePin(id) {
    if (!state.debugControlsEnabled) return;
    if (pinnedProperties.has(id)) {
        pinnedProperties.delete(id);
    } else {
        pinnedProperties.add(id);
    }
    savePinnedProperties();
    renderPinnedProperties();
    renderModules();
    renderContentPacks();
}

function createPinButton(id) {
    const button = document.createElement("button");
    button.className = `button ghost pin-toggle${isPinned(id) ? " is-pinned" : ""}`;
    button.type = "button";
    button.textContent = isPinned(id) ? "★" : "☆";
    button.title = isPinned(id) ? "Unpin from Overview" : "Pin to Overview";
    button.disabled = !state.debugControlsEnabled;
    button.onclick = () => togglePin(id);
    return button;
}

function getTelemetryDescriptor(id) {
    if (id === "telemetry.fps") {
        return {
            id,
            label: "FPS",
            type: "readonly",
            get: () => currentFps
        };
    }
    if (id === "telemetry.tickRate") {
        return {
            id,
            label: "Tick Rate",
            type: "readonly",
            get: () => Number.isFinite(tickRateObserved) ? tickRateObserved.toFixed(2) : "--"
        };
    }
    if (id === "telemetry.uiUpdates") {
        return {
            id,
            label: "UI Updates",
            type: "readonly",
            get: () => lastUiUpdateCount
        };
    }
    if (id === "telemetry.errors") {
        return {
            id,
            label: "Errors",
            type: "readonly",
            get: () => errorLog.length
        };
    }
    if (id === "telemetry.uptime") {
        return {
            id,
            label: "Uptime",
            type: "readonly",
            get: () => formatDuration(Date.now() - sessionStartedAt)
        };
    }
    if (id === "telemetry.renderCap") {
        return {
            id,
            label: "FPS Cap",
            type: "readonly",
            get: () => state.renderFpsCap || "Off"
        };
    }
    return null;
}

function getWalletDescriptor(id) {
    const [, currencyId] = id.split(".");
    if (!currencyId || !(currencyId in state.wallet)) return null;
    const label = CURRENCY_DEFS[currencyId]?.name ?? currencyId;
    return {
        id,
        label,
        type: "number",
        min: 0,
        max: 999999,
        step: 1,
        get: () => state.wallet[currencyId],
        set: (value) => {
            const next = Math.max(0, Math.floor(Number(value) || 0));
            state.wallet[currencyId] = next;
            updateLists();
        }
    };
}

function getModuleDescriptor(moduleId, propId) {
    const module = [...moduleDefinitions, ...externalModules]
        .find((entry) => entry.id === moduleId);
    if (!module || !Array.isArray(module.properties)) return null;
    const prop = module.properties.find((entry) => entry.id === propId);
    if (!prop) return null;
    return {
        id: `module:${moduleId}:${propId}`,
        label: prop.label ?? prop.id,
        type: prop.type === "boolean" ? "boolean" : "number",
        min: Number.isFinite(prop.min) ? prop.min : 0,
        max: Number.isFinite(prop.max) ? prop.max : 999,
        step: Number.isFinite(prop.step) ? prop.step : 1,
        get: () => (prop.get ? prop.get() : prop.value),
        set: (value) => {
            if (prop.set) {
                prop.set(value);
            } else if (prop.type === "boolean") {
                prop.value = Boolean(value);
            } else {
                prop.value = Number(value);
            }
            persistModuleState();
            renderModules();
        }
    };
}

function getPackDescriptor(packId, propId) {
    const pack = state.contentPacks.find((entry) => entry.id === packId);
    if (!pack || !Array.isArray(pack.properties)) return null;
    const prop = pack.properties.find((entry) => entry.id === propId);
    if (!prop) return null;
    return {
        id: `pack:${packId}:${propId}`,
        label: prop.label ?? prop.id,
        type: prop.type === "boolean" ? "boolean" : "number",
        min: Number.isFinite(prop.min) ? prop.min : 0,
        max: Number.isFinite(prop.max) ? prop.max : 999,
        step: Number.isFinite(prop.step) ? prop.step : 1,
        get: () => (prop.get ? prop.get() : prop.value),
        set: (value) => {
            if (prop.set) {
                prop.set(value);
            } else if (prop.type === "boolean") {
                prop.value = Boolean(value);
            } else {
                prop.value = Number(value);
            }
            renderContentPacks();
        }
    };
}

function getPinnedDescriptor(id) {
    if (id.startsWith("telemetry.")) return getTelemetryDescriptor(id);
    if (id.startsWith("wallet.")) return getWalletDescriptor(id);
    if (id.startsWith("module:")) {
        const [, moduleId, propId] = id.split(":");
        return getModuleDescriptor(moduleId, propId);
    }
    if (id.startsWith("pack:")) {
        const [, packId, propId] = id.split(":");
        return getPackDescriptor(packId, propId);
    }
    if (id === "simulation.tickRate") {
        return {
            id,
            label: "Tick Rate",
            type: "number",
            min: 0.5,
            max: 5,
            step: 0.5,
            get: () => state.tickRate,
            set: (value) => applyTickRate(value)
        };
    }
    return null;
}

function renderPinnedProperties() {
    if (!ui.pinnedInspector) return;
    ui.pinnedInspector.innerHTML = "";
    pinnedUi.clear();
    [...pinnedProperties].forEach((id) => {
        const descriptor = getPinnedDescriptor(id);
        if (!descriptor) {
            pinnedProperties.delete(id);
            return;
        }
        const row = document.createElement("div");
        row.className = "module-prop pinned-prop";
        const label = document.createElement("span");
        label.textContent = descriptor.label;
        row.appendChild(label);

        let input = null;
        let value = null;

        if (descriptor.type === "boolean") {
            input = document.createElement("input");
            input.type = "checkbox";
            input.checked = Boolean(descriptor.get());
            input.onchange = () => descriptor.set?.(input.checked);
            row.appendChild(input);
        } else if (descriptor.type === "readonly") {
            value = document.createElement("span");
            value.className = "subtle";
            row.appendChild(value);
        } else {
            input = document.createElement("input");
            input.className = "text-input";
            input.type = "number";
            input.min = descriptor.min ?? 0;
            input.max = descriptor.max ?? 999;
            input.step = descriptor.step ?? 1;
            input.value = descriptor.get();
            input.onchange = () => descriptor.set?.(input.value);
            value = document.createElement("span");
            value.className = "subtle";
            value.textContent = input.value;
            input.oninput = () => {
                value.textContent = input.value;
            };
            row.appendChild(input);
            row.appendChild(value);
        }

        row.appendChild(createPinButton(id));
        ui.pinnedInspector.appendChild(row);
        pinnedUi.set(id, { descriptor, input, value });
    });
    savePinnedProperties();
    updatePinnedValues();
}

function updatePinnedValues() {
    pinnedUi.forEach((entry) => {
        const current = entry.descriptor.get?.();
        if (entry.descriptor.type === "readonly") {
            if (entry.value) {
                entry.value.textContent = Number.isFinite(current)
                    ? `${Math.round(current)}`
                    : `${current ?? "--"}`;
            }
            return;
        }
        if (entry.input && document.activeElement !== entry.input) {
            if (entry.descriptor.type === "boolean") {
                entry.input.checked = Boolean(current);
            } else if (current != null) {
                entry.input.value = current;
            }
        }
        if (entry.value && entry.descriptor.type !== "boolean") {
            entry.value.textContent = entry.input?.value ?? "--";
        }
    });
}

function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }
    return `${value.toFixed(value < 10 ? 2 : 1)} ${units[index]}`;
}

function formatDuration(ms) {
    if (!Number.isFinite(ms) || ms < 0) return "--";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
}

function formatTimestamp(ts) {
    if (!ts) return "Never";
    return new Date(ts).toLocaleTimeString();
}

function renderRuntimeRow(label, value, badge) {
    const row = document.createElement("div");
    row.className = "runtime-row";
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    const valueWrap = document.createElement("span");
    valueWrap.className = "runtime-value";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    valueWrap.appendChild(valueEl);
    if (badge) {
        const badgeEl = document.createElement("span");
        badgeEl.className = `runtime-badge runtime-badge-${badge.tone ?? "muted"}`;
        badgeEl.textContent = badge.text;
        valueWrap.appendChild(badgeEl);
    }
    row.appendChild(labelEl);
    row.appendChild(valueWrap);
    return row;
}

function getLocalStorageUsage() {
    try {
        let total = 0;
        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (!key) continue;
            const value = localStorage.getItem(key) ?? "";
            total += key.length + value.length;
        }
        return total * 2;
    } catch {
        return 0;
    }
}

function updateRuntimeDiagnostics() {
    if (ui.runtimeHost) {
        ui.runtimeHost.textContent = `Host: ${location.hostname || "local"}`;
    }
    if (ui.runtimeProtocol) {
        ui.runtimeProtocol.textContent = `Protocol: ${location.protocol.replace(":", "")}`;
    }
    if (ui.runtimeDevMode) {
        ui.runtimeDevMode.textContent = `Dev Mode: ${DEV_MODE ? "Enabled" : "Disabled"}`;
    }
    if (ui.runtimeUptime) {
        ui.runtimeUptime.textContent = `Uptime: ${formatDuration(Date.now() - sessionStartedAt)}`;
    }
    if (ui.runtimeSaved) {
        ui.runtimeSaved.textContent = `Last save: ${formatTimestamp(lastSavedAt)}`;
    }
    if (ui.runtimeRenderer) {
        ui.runtimeRenderer.innerHTML = "";
        const rendererEnabled = isModuleEnabled("renderer");
        ui.runtimeRenderer.appendChild(renderRuntimeRow(
            "Renderer",
            rendererEnabled ? "Enabled" : "Disabled",
            rendererEnabled ? null : { text: "Module off", tone: "muted" }
        ));
        const previewEnabled = isModuleEnabled("renderer3d");
        ui.runtimeRenderer.appendChild(renderRuntimeRow(
            "3D Preview",
            previewEnabled ? "Enabled" : "Disabled",
            previewEnabled ? null : { text: "Module off", tone: "muted" }
        ));
        const threeStatus = window.THREE ? "Loaded" : previewEnabled ? "Loading" : "Disabled";
        const threeBadge = window.THREE ? null : previewEnabled ? { text: "Pending", tone: "warn" } : { text: "N/A", tone: "muted" };
        ui.runtimeRenderer.appendChild(renderRuntimeRow("Three.js", threeStatus, threeBadge));
        ui.runtimeRenderer.appendChild(renderRuntimeRow("FPS Cap", state.renderFpsCap || "Off"));
    }
    if (ui.runtimeEngine) {
        ui.runtimeEngine.innerHTML = "";
        ui.runtimeEngine.appendChild(renderRuntimeRow("Modules", moduleDefinitions.length));
        ui.runtimeEngine.appendChild(renderRuntimeRow("External Modules", externalModules.length));
        ui.runtimeEngine.appendChild(renderRuntimeRow("Content Packs", state.contentPacks.length));
    }
    if (ui.runtimeStorage) {
        ui.runtimeStorage.innerHTML = "";
        ui.runtimeStorage.appendChild(renderRuntimeRow("LocalStorage", formatBytes(getLocalStorageUsage())));
        if (performance?.memory?.usedJSHeapSize) {
            const used = performance.memory.usedJSHeapSize;
            const total = performance.memory.totalJSHeapSize;
            ui.runtimeStorage.appendChild(renderRuntimeRow("JS Heap", `${formatBytes(used)} / ${formatBytes(total)}`));
        } else {
            ui.runtimeStorage.appendChild(renderRuntimeRow("JS Heap", "Unavailable", { text: "N/A", tone: "muted" }));
        }
    }
    if (ui.runtimeErrors) {
        const lastError = errorLog[errorLog.length - 1];
        ui.runtimeErrors.innerHTML = "";
        const hasErrors = errorLog.length > 0;
        ui.runtimeErrors.appendChild(renderRuntimeRow("Count", errorLog.length, hasErrors ? null : { text: "None", tone: "success" }));
        ui.runtimeErrors.appendChild(renderRuntimeRow("Last", lastError?.time ?? "--", hasErrors ? null : { text: "N/A", tone: "muted" }));
        ui.runtimeErrors.appendChild(renderRuntimeRow("Level", lastError?.level?.toUpperCase?.() ?? "--", hasErrors ? null : { text: "N/A", tone: "muted" }));
        ui.runtimeErrors.appendChild(renderRuntimeRow("Message", lastError?.message ?? "--", hasErrors ? null : { text: "N/A", tone: "muted" }));
    }
}

function setupRuntimeGraph() {
    if (!ui.runtimeGraph) return;
    runtimeGraphCtx = ui.runtimeGraph.getContext("2d");
    runtimeFpsSamples.length = 0;
}

function recordRuntimeFpsSample() {
    runtimeFpsSamples.push(Math.max(0, currentFps));
    const maxSamples = 80;
    if (runtimeFpsSamples.length > maxSamples) {
        runtimeFpsSamples.splice(0, runtimeFpsSamples.length - maxSamples);
    }
}

function drawRuntimeGraph() {
    if (!runtimeGraphCtx || !ui.runtimeGraph) return;
    const ctx = runtimeGraphCtx;
    const width = ui.runtimeGraph.width;
    const height = ui.runtimeGraph.height;
    ctx.clearRect(0, 0, width, height);
    if (runtimeFpsSamples.length < 2) return;

    const max = Math.max(...runtimeFpsSamples, 1);
    const min = Math.min(...runtimeFpsSamples, 0);
    const span = Math.max(1, max - min);
    ctx.strokeStyle = "rgba(96, 165, 250, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    runtimeFpsSamples.forEach((value, index) => {
        const x = (index / (runtimeFpsSamples.length - 1)) * (width - 8) + 4;
        const y = height - 6 - ((value - min) / span) * (height - 12);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

function updateDebugTelemetry() {
    if (ui.debugFps) {
        ui.debugFps.textContent = `FPS: ${Math.round(currentFps)}`;
    }
    if (ui.debugTickRate) {
        const observed = Number.isFinite(tickRateObserved) ? tickRateObserved : 0;
        ui.debugTickRate.textContent = `Tick rate: ${observed.toFixed(2)}/s • Target ${state.tickRate}/s • Tick ${state.tick}`;
    }
    if (ui.debugUiUpdates) {
        ui.debugUiUpdates.textContent = `UI updates/frame: ${lastUiUpdateCount}`;
    }
    updateRuntimeDiagnostics();
    drawRuntimeGraph();
    updatePinnedValues();
}

function recordTickSample() {
    const now = performance.now();
    tickSamples.push(now);
    const horizon = 3000;
    while (tickSamples.length && tickSamples[0] < now - horizon) {
        tickSamples.shift();
    }
    if (tickSamples.length > 1) {
        const span = (tickSamples[tickSamples.length - 1] - tickSamples[0]) / 1000;
        tickRateObserved = span > 0 ? (tickSamples.length - 1) / span : 0;
    } else {
        tickRateObserved = 0;
    }
}

function applyDevModeUI() {
    document.querySelectorAll(".dev-only").forEach((el) => {
        el.classList.toggle("hidden", !DEV_MODE);
    });
}

function formatErrorPayload(payload) {
    if (payload == null) return "";
    if (payload instanceof Error) return payload.stack || payload.message || String(payload);
    if (payload instanceof ErrorEvent) {
        return JSON.stringify({
            message: payload.message,
            filename: payload.filename,
            lineno: payload.lineno,
            colno: payload.colno
        }, null, 2);
    }
    if (payload?.type === "error" && payload?.target?.src) {
        return JSON.stringify({
            message: "Script load failed",
            src: payload.target.src
        }, null, 2);
    }
    if (typeof payload === "string") return payload;
    try {
        return JSON.stringify(payload, null, 2);
    } catch {
        return String(payload);
    }
}

function updateErrorButton() {
    if (!ui.openErrorsBtn) return;
    const count = errorLog.length;
    ui.openErrorsBtn.classList.toggle("hidden", count === 0);
    ui.openErrorsBtn.textContent = count > 0 ? `⚠ Errors (${count})` : "⚠ Errors";
}

function renderErrorList() {
    if (!ui.errorList || !ui.errorDetails) return;
    ui.errorList.innerHTML = "";
    errorLog.slice().reverse().forEach((entry) => {
        const row = document.createElement("div");
        row.className = `error-row level-${entry.level}`;
        const pill = document.createElement("span");
        pill.className = "level-pill";
        pill.textContent = entry.level.toUpperCase();
        const message = document.createElement("span");
        message.textContent = entry.message;
        const time = document.createElement("span");
        time.className = "error-time";
        time.textContent = entry.time;
        row.appendChild(pill);
        row.appendChild(message);
        row.appendChild(time);
        row.addEventListener("click", () => {
            ui.errorDetails.value = entry.details;
        });
        ui.errorList.appendChild(row);
    });
    if (errorLog.length > 0 && !ui.errorDetails.value) {
        ui.errorDetails.value = errorLog[errorLog.length - 1].details;
    }
}

function logIssue(level, message, detail, emitConsole = true) {
    if (detail && detail.__logged) return;
    if (detail && typeof detail === "object") {
        detail.__logged = true;
    }
    const entry = {
        level,
        message: message || "Unknown issue",
        details: formatErrorPayload(detail || message),
        time: new Date().toLocaleTimeString()
    };
    errorLog.push(entry);
    if (errorLog.length > 100) {
        errorLog.shift();
    }
    updateErrorButton();
    renderErrorList();
    if (emitConsole) {
        const logArgs = detail ? [message, detail] : [message];
        if (level === "error") {
            rawConsoleError(...logArgs);
        } else if (level === "warn") {
            rawConsoleWarn(...logArgs);
        } else {
            rawConsoleInfo(...logArgs);
        }
    }
    if (level === "error" && ui.errorDialog) {
        ui.errorDialog.classList.remove("hidden");
    }
}

function setupErrorLogging() {
    console.warn = (...args) => {
        rawConsoleWarn(...args);
        logIssue("warn", args.map(formatErrorPayload).join(" "), args.find((arg) => arg instanceof Error), false);
    };
    console.error = (...args) => {
        rawConsoleError(...args);
        logIssue("error", args.map(formatErrorPayload).join(" "), args.find((arg) => arg instanceof Error), false);
    };
    window.addEventListener("error", (event) => {
        logIssue("error", event.message || "Window error", event.error || event);
    });
    window.addEventListener("unhandledrejection", (event) => {
        logIssue("error", "Unhandled promise rejection", event.reason || event);
    });
}

function loadScriptOnce(src, id) {
    return new Promise((resolve, reject) => {
        if (id && document.getElementById(id)) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        if (id) {
            script.id = id;
        }
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve();
        script.onerror = (error) => {
            const wrapped = new Error(`Failed to load script: ${src}`);
            wrapped.original = error;
            reject(wrapped);
        };
        document.head.appendChild(script);
    });
}

async function tryLoadScripts(sources, idPrefix) {
    for (let i = 0; i < sources.length; i += 1) {
        const src = sources[i];
        try {
            await loadScriptOnce(src, `${idPrefix}-${i}`);
            return true;
        } catch (error) {
            logIssue("warn", `Failed to load ${idPrefix} from ${src}`, error);
        }
    }
    return false;
}

function resolveModuleUrl(src) {
    if (src.startsWith("./")) {
        return new URL(src, import.meta.url).href;
    }
    return src;
}

async function tryImportModule(sources, label) {
    for (let i = 0; i < sources.length; i += 1) {
        const src = resolveModuleUrl(sources[i]);
        try {
            const module = await import(src);
            return module;
        } catch (error) {
            logIssue("warn", `Failed to import ${label} from ${src}`, error);
        }
    }
    return null;
}

function ensureThreeJs() {
    if (
        window.THREE
        && (window.GLTFLoader || window.THREE.GLTFLoader)
        && (window.OBJLoader || window.THREE.OBJLoader)
        && (window.OrbitControls || window.THREE?.OrbitControls || orbitControlsCtor)
    ) {
        return Promise.resolve(true);
    }
    if (threeLoaderPromise) return threeLoaderPromise;
    threeLoaderPromise = (async () => {
        try {
            const moduleSources = [
                "./vendor/three/three.module.min.js",
                "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js",
                "https://unpkg.com/three@0.161.0/build/three.module.js",
                "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.min.js"
            ];
            if (!window.THREE) {
                const module = await tryImportModule(moduleSources, "three-module");
                if (module) {
                    threeModule = module;
                    window.THREE = module;
                }
            }
            if (!window.THREE) {
                const coreSources = [
                    "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.min.js",
                    "https://unpkg.com/three@0.161.0/build/three.min.js",
                    "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.161.0/three.min.js",
                    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r161/build/three.min.js",
                    "vendor/three/three.min.js"
                ];
                await tryLoadScripts(coreSources, "three-core");
            }
            if (!window.GLTFLoader && !window.THREE?.GLTFLoader) {
                const gltfModuleSources = [
                    "./vendor/three/GLTFLoader.js",
                    "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js",
                    "https://unpkg.com/three@0.161.0/examples/jsm/loaders/GLTFLoader.js"
                ];
                const gltfModule = await tryImportModule(gltfModuleSources, "gltf-loader");
                if (gltfModule?.GLTFLoader) {
                    gltfLoaderCtor = gltfModule.GLTFLoader;
                    window.GLTFLoader = gltfModule.GLTFLoader;
                }
            }
            if (!window.OBJLoader && !window.THREE?.OBJLoader) {
                const objModuleSources = [
                    "./vendor/three/OBJLoader.js",
                    "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/OBJLoader.js",
                    "https://unpkg.com/three@0.161.0/examples/jsm/loaders/OBJLoader.js"
                ];
                const objModule = await tryImportModule(objModuleSources, "obj-loader");
                if (objModule?.OBJLoader) {
                    objLoaderCtor = objModule.OBJLoader;
                    window.OBJLoader = objModule.OBJLoader;
                }
            }
            if (!window.OrbitControls && !window.THREE?.OrbitControls && !orbitControlsCtor) {
                const controlSources = [
                    "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js",
                    "https://unpkg.com/three@0.161.0/examples/jsm/controls/OrbitControls.js"
                ];
                const controlsModule = await tryImportModule(controlSources, "orbit-controls");
                if (controlsModule?.OrbitControls) {
                    orbitControlsCtor = controlsModule.OrbitControls;
                    window.OrbitControls = controlsModule.OrbitControls;
                }
            }
            if (!window.OrbitControls && !window.THREE?.OrbitControls && !orbitControlsCtor) {
                const controlScripts = [
                    "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/js/controls/OrbitControls.js",
                    "https://unpkg.com/three@0.161.0/examples/js/controls/OrbitControls.js"
                ];
                await tryLoadScripts(controlScripts, "orbit-controls-script");
                if (window.THREE?.OrbitControls) {
                    orbitControlsCtor = window.THREE.OrbitControls;
                    window.OrbitControls = window.THREE.OrbitControls;
                }
            }
            return Boolean(window.THREE);
        } catch (error) {
            logIssue("error", "Failed to load Three.js", error);
            return false;
        }
    })();
    return threeLoaderPromise;
}

function persistSnapshot(snapshot) {
    if (DEV_MODE) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        return true;
    }

    console.warn("Remote persistence not configured; skipping save.");
    return false;
}

function loadSnapshotFromStorage() {
    if (DEV_MODE) {
        return localStorage.getItem(STORAGE_KEY);
    }

    console.warn("Remote persistence not configured; skipping load.");
    return null;
}

function restoreModuleState() {
    const raw = localStorage.getItem(MODULE_STORAGE_KEY);
    if (!raw) return;
    try {
        const snapshot = JSON.parse(raw);
        if (snapshot?.modules) {
            Object.entries(snapshot.modules).forEach(([key, value]) => {
                moduleState[key] = { enabled: value?.enabled !== false };
            });
        }
        if (snapshot?.values) {
            if (Number.isFinite(snapshot.values.tickRate)) {
                state.tickRate = snapshot.values.tickRate;
            }
            if (Number.isFinite(snapshot.values.skillXpMultiplier)) {
                state.skillXpMultiplier = snapshot.values.skillXpMultiplier;
            }
            if (Number.isFinite(snapshot.values.rewardMultiplier)) {
                state.rewardMultiplier = snapshot.values.rewardMultiplier;
            }
            if (Number.isFinite(snapshot.values.cashMultiplier)) {
                state.cashMultiplier = snapshot.values.cashMultiplier;
            }
            if (Number.isFinite(snapshot.values.clickXpBonus)) {
                state.clickXpBonus = snapshot.values.clickXpBonus;
            }
            if (Number.isFinite(snapshot.values.clickXpBonusPerClick)) {
                state.clickXpBonusPerClick = snapshot.values.clickXpBonusPerClick;
            }
            if (Number.isFinite(snapshot.values.clickXpBonusMax)) {
                state.clickXpBonusMax = snapshot.values.clickXpBonusMax;
            }
            if (Number.isFinite(snapshot.values.clickXpBonusDecayPerSecond)) {
                state.clickXpBonusDecayPerSecond = snapshot.values.clickXpBonusDecayPerSecond;
            }
            if (Number.isFinite(snapshot.values.clickEnergyPerClick)) {
                state.clickEnergyPerClick = snapshot.values.clickEnergyPerClick;
            }
            if (Number.isFinite(snapshot.values.clickEnergyDecayPerSecond)) {
                state.clickEnergyDecayPerSecond = snapshot.values.clickEnergyDecayPerSecond;
            }
            if (Number.isFinite(snapshot.values.clickEnergyMax)) {
                state.clickEnergyMax = snapshot.values.clickEnergyMax;
            }
            if (Number.isFinite(snapshot.values.clickEnergyLevelUpBoost)) {
                state.clickEnergyLevelUpBoost = snapshot.values.clickEnergyLevelUpBoost;
            }
            if (Number.isFinite(snapshot.values.clickEnergyLevelUpPerLevel)) {
                state.clickEnergyLevelUpPerLevel = snapshot.values.clickEnergyLevelUpPerLevel;
            }
            if (typeof snapshot.values.ringParticlesEnabled === "boolean") {
                state.ringParticlesEnabled = snapshot.values.ringParticlesEnabled;
            }
            if (typeof snapshot.values.debugControlsEnabled === "boolean") {
                state.debugControlsEnabled = snapshot.values.debugControlsEnabled;
            } else {
                state.debugControlsEnabled = true;
                persistModuleState();
            }
            if (Number.isFinite(snapshot.values.zoom)) {
                state.zoom = snapshot.values.zoom;
            }
            if (Number.isFinite(snapshot.values.renderFpsCap)) {
                state.renderFpsCap = snapshot.values.renderFpsCap;
            }
            if (state.renderFpsCap === 0) {
                state.renderFpsCap = DEFAULT_RENDER_FPS_CAP;
                persistModuleState();
            }
            if (snapshot.values.modelViewer && typeof snapshot.values.modelViewer === "object") {
                const viewer = snapshot.values.modelViewer;
                if (typeof viewer.autoRotate === "boolean") {
                    state.modelViewer.autoRotate = viewer.autoRotate;
                }
                if (Number.isFinite(viewer.rotateSensitivity)) {
                    state.modelViewer.rotateSensitivity = viewer.rotateSensitivity;
                }
                if (Number.isFinite(viewer.zoomMin)) {
                    state.modelViewer.zoomMin = viewer.zoomMin;
                }
                if (Number.isFinite(viewer.zoomMax)) {
                    state.modelViewer.zoomMax = viewer.zoomMax;
                }
                if (Number.isFinite(viewer.zoomSpeed)) {
                    state.modelViewer.zoomSpeed = viewer.zoomSpeed;
                }
            }
        }
        if (Array.isArray(snapshot?.externalModules)) {
            externalModules.length = 0;
            snapshot.externalModules.forEach((module) => externalModules.push(module));
        }
    } catch (error) {
        console.warn("Failed to restore module state", error);
    }
}

function applyTickRate(value) {
    state.tickRate = clamp(Number(value) || 1, 0.5, 5);
    if (ui.debugTickRate) {
        updateDebugTelemetry();
    }
    refreshTickLoop();
    persistModuleState();
}

function applyZoom(value) {
    state.zoom = clamp(Number(value) || 1, 0.75, 1.5);
    const appRoot = document.getElementById("app");
    if (appRoot) {
        appRoot.style.transform = `scale(${state.zoom})`;
        appRoot.style.transformOrigin = "top left";
    }
    if (ui.zoomSlider) {
        ui.zoomSlider.value = String(state.zoom);
    }
    if (ui.zoomValue) {
        ui.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
    }
    persistModuleState();
}

function normalizeModelViewerSettings() {
    const min = clamp(Number(state.modelViewer.zoomMin) || 0.7, 0.4, 1);
    const max = clamp(Number(state.modelViewer.zoomMax) || 1.6, 1, 3);
    if (min >= max) {
        state.modelViewer.zoomMin = Math.max(0.4, Math.min(min, max - 0.1));
        state.modelViewer.zoomMax = Math.min(3, Math.max(max, state.modelViewer.zoomMin + 0.1));
    } else {
        state.modelViewer.zoomMin = min;
        state.modelViewer.zoomMax = max;
    }
    state.modelViewer.rotateSensitivity = clamp(Number(state.modelViewer.rotateSensitivity) || 0.01, 0.002, 0.05);
    state.modelViewer.zoomSpeed = clamp(Number(state.modelViewer.zoomSpeed) || 0.9, 0.2, 2);
}

function applyModelViewerSettings() {
    normalizeModelViewerSettings();
    modelRenderer?.viewer?.applySettings?.(state.modelViewer);
    persistModuleState();
}

function formatTickDuration(ticks, tickRate) {
    const safeTicks = Math.max(0, Number(ticks) || 0);
    const rate = Math.max(0.001, Number(tickRate) || 1);
    const totalSeconds = Math.floor(safeTicks / rate);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value) => String(value).padStart(2, "0");
    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateTickBatchPreview() {
    if (!ui.tickBatchTime) return;
    ui.tickBatchTime.textContent = formatTickDuration(ui.tickBatchInput?.value ?? 0, state.tickRate);
}

function setDebugControlsEnabled(enabled) {
    state.debugControlsEnabled = Boolean(enabled);
    if (ui.debugOverlayPanel) {
        ui.debugOverlayPanel.classList.toggle("controls-locked", !state.debugControlsEnabled);
    }
    persistModuleState();
    refreshToggleButtons();
    renderModules();
    renderContentPacks();
    renderPinnedProperties();
}

const ThemeManager = {
    themes: new Map(),
    activeId: "dark",
    register(theme) {
        if (!theme?.id) return;
        this.themes.set(theme.id, theme);
    },
    loadBuiltIns() {
        this.themes.clear();
        builtinThemes.forEach((theme) => this.register(theme));
        themePacks.forEach((pack) => {
            const packEnabled = state.contentPacks.find((entry) => entry.id === pack.packId)?.enabled !== false;
            if (!packEnabled) return;
            pack.themes.forEach((theme) => this.register(theme));
        });
    },
    apply(themeId) {
        const theme = this.themes.get(themeId);
        if (!theme) return;
        this.activeId = theme.id;
        const root = document.documentElement;
        root.style.colorScheme = theme.mode === "light" ? "light" : "dark";
        Object.entries(theme.colors ?? {}).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        localStorage.setItem(THEME_STORAGE_KEY, theme.id);
        renderThemeList();
    },
    restore() {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        this.activeId = stored ?? "dark";
        if (!this.themes.has(this.activeId)) {
            this.activeId = "dark";
        }
        this.apply(this.activeId);
    },
    updateFromJson(payload) {
        if (!payload) return;
        this.register(payload);
        this.apply(payload.id);
    }
};

function renderThemeList() {
    if (!ui.themeList) return;
    ui.themeList.innerHTML = "";
    [...ThemeManager.themes.values()].forEach((theme) => {
        const row = document.createElement("div");
        row.className = "theme-row";
        const swatch = document.createElement("span");
        swatch.className = "theme-swatch";
        const accent = theme.colors?.["--accent"] ?? "#60a5fa";
        swatch.style.background = accent;
        const label = document.createElement("span");
        label.textContent = `${theme.name} (${theme.source})`;
        const button = document.createElement("button");
        button.className = "button ghost";
        button.textContent = ThemeManager.activeId === theme.id ? "Active" : "Apply";
        button.onclick = () => ThemeManager.apply(theme.id);
        row.appendChild(swatch);
        row.appendChild(label);
        row.appendChild(button);
        ui.themeList.appendChild(row);
    });
    if (ui.themeJson) {
        const active = ThemeManager.themes.get(ThemeManager.activeId);
        ui.themeJson.value = JSON.stringify(active, null, 2);
    }
}

function ensureSelectedSkill() {
    if (!state.skills.length) return;
    if (!selectedSkillId || !state.skills.some((skill) => skill.id === selectedSkillId)) {
        const active = state.skills.find((skill) => skill.active);
        selectedSkillId = active?.id ?? state.lastActiveSkillId ?? state.skills[0].id;
    }
}

function refreshTickLoop() {
    if (tickIntervalId) {
        clearInterval(tickIntervalId);
        tickIntervalId = null;
    }
    if (isModuleEnabled("simulation")) {
        tickIntervalId = setInterval(() => {
            if (!state.isLocked) {
                tickOnce();
            }
        }, 1000 / state.tickRate);
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCompactNumber(value) {
    const abs = Math.abs(value);
    if (abs >= 1e12) return `${(value / 1e12).toFixed(2).replace(/\.00$/, "")}T`;
    if (abs >= 1e9) return `${(value / 1e9).toFixed(2).replace(/\.00$/, "")}B`;
    if (abs >= 1e6) return `${(value / 1e6).toFixed(2).replace(/\.00$/, "")}M`;
    if (abs >= 1e3) return `${(value / 1e3).toFixed(2).replace(/\.00$/, "")}K`;
    return `${value}`;
}

function getItemDef(itemId) {
    return ITEM_DEFS[itemId] ?? {
        name: itemId,
        icon: null,
        description: "",
        price: 0,
        stackLimit: DEFAULT_STACK_LIMIT,
        stackable: true,
        unique: false
    };
}

function getStackLimit(def) {
    if (def.unique || def.stackable === false) return 1;
    return def.stackLimit ?? DEFAULT_STACK_LIMIT;
}

function getInventoryTotals() {
    const totals = {};
    state.inventorySlots.forEach((slot) => {
        totals[slot.id] = (totals[slot.id] ?? 0) + slot.quantity;
    });
    return totals;
}

function addItemToInventory(itemId, quantity) {
    if (quantity <= 0) return;
    const def = getItemDef(itemId);
    const stackLimit = getStackLimit(def);
    const remainingSlots = [...state.inventorySlots];

    if (def.unique) {
        const alreadyOwned = remainingSlots.some((slot) => slot.id === itemId && slot.quantity > 0);
        if (!alreadyOwned) {
            state.inventorySlots.push({ id: itemId, quantity: 1 });
        }
        return;
    }

    let remaining = quantity;

    if (def.stackable !== false) {
        state.inventorySlots.forEach((slot) => {
            if (slot.id !== itemId) return;
            if (slot.quantity >= stackLimit) return;
            const space = stackLimit - slot.quantity;
            const toAdd = Math.min(space, remaining);
            if (toAdd > 0) {
                slot.quantity += toAdd;
                remaining -= toAdd;
            }
        });
    }

    while (remaining > 0) {
        const toAdd = def.stackable === false ? 1 : Math.min(stackLimit, remaining);
        state.inventorySlots.push({ id: itemId, quantity: toAdd });
        remaining -= toAdd;
    }

    const totals = getInventoryTotals();
    const history = state.inventoryHistory[itemId] ?? [];
    history.push({ t: Date.now(), v: totals[itemId] ?? 0 });
    state.inventoryHistory[itemId] = history.slice(-50);
}

function removeItemFromInventory(itemId, quantity) {
    if (quantity <= 0) return;
    let remaining = quantity;
    for (let i = state.inventorySlots.length - 1; i >= 0 && remaining > 0; i -= 1) {
        const slot = state.inventorySlots[i];
        if (slot.id !== itemId) continue;
        const toRemove = Math.min(slot.quantity, remaining);
        slot.quantity -= toRemove;
        remaining -= toRemove;
        if (slot.quantity <= 0) {
            state.inventorySlots.splice(i, 1);
        }
    }
}

function showInventoryPopover(slot, anchor) {
    if (!ui.inventoryPopover || !ui.popoverIcon || !ui.popoverName || !ui.popoverDesc || !ui.popoverStack || !ui.popoverValue || !ui.popoverGraph) {
        return;
    }
    const meta = getItemDef(slot.id);
    const stackLimit = getStackLimit(meta);
    const cashIcon = CURRENCY_DEFS.cash?.icon ?? "";
    const unitValue = meta.price ?? 0;
    const totalValue = unitValue * slot.quantity;
    ui.popoverIcon.src = meta.icon ?? "";
    ui.popoverIcon.alt = meta.name;
    ui.popoverName.textContent = meta.name;
    ui.popoverDesc.textContent = meta.description || "No description.";
    ui.popoverStack.innerHTML = `
        <div class="inventory-popover-label">STACK</div>
        <div class="inventory-popover-value-line stack-qty">${slot.quantity.toLocaleString()}</div>
        <div class="inventory-popover-value-line stack-max">MAX ${stackLimit.toLocaleString()}</div>
    `;
    ui.popoverValue.innerHTML = `
        <span class="inventory-popover-value">
            <span class="inventory-popover-label">EACH</span>
            <img src="${cashIcon}" alt="Cash" class="inventory-popover-cash" /> ${unitValue.toLocaleString()}
        </span>
        <span class="inventory-popover-value">
            <span class="inventory-popover-label">TOTAL</span>
            <img src="${cashIcon}" alt="Cash" class="inventory-popover-cash" /> ${totalValue.toLocaleString()}
        </span>
    `;

    drawInventoryGraph(slot.id);

    const anchorRect = anchor.getBoundingClientRect();
    ui.inventoryPopover.style.left = `${anchorRect.right + 12 + window.scrollX}px`;
    ui.inventoryPopover.style.top = `${anchorRect.top + window.scrollY}px`;
    ui.inventoryPopover.classList.remove("hidden");
    ui.inventoryPopover.setAttribute("aria-hidden", "false");
}

function hideInventoryPopover() {
    if (!ui.inventoryPopover) return;
    ui.inventoryPopover.classList.add("hidden");
    ui.inventoryPopover.setAttribute("aria-hidden", "true");
}

function drawInventoryGraph(itemId) {
    const canvas = ui.popoverGraph;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const history = state.inventoryHistory[itemId] ?? [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (history.length < 2) {
        ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 4);
        ctx.lineTo(canvas.width, canvas.height - 4);
        ctx.stroke();
        return;
    }
    const values = history.map((point) => point.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);
    ctx.strokeStyle = "rgba(183, 247, 255, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    values.forEach((value, index) => {
        const x = (index / (values.length - 1)) * (canvas.width - 8) + 4;
        const y = canvas.height - 6 - ((value - min) / span) * (canvas.height - 12);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
}

function createListItem(text) {
    const li = document.createElement("li");
    li.textContent = text;
    return li;
}

function xpForLevel(level) {
    if (level <= 1) return 0;
    let total = 0;
    const base = 60;
    const growth = 1.5;
    for (let i = 2; i <= level; i++) {
        total += base * Math.pow(growth, i - 2);
    }
    return Math.round(total);
}

function getProgress(skill) {
    const current = xpForLevel(skill.level);
    const next = skill.level >= skill.maxLevel ? current : xpForLevel(skill.level + 1);
    if (next === current) return 1;
    return clamp((skill.xp - current) / (next - current), 0, 1);
}

function renderList(listEl, values) {
    listEl.innerHTML = "";
    values.forEach((line) => listEl.appendChild(createListItem(line)));
}

function renderWallet() {
    ui.walletList.innerHTML = "";
    Object.entries(state.wallet).forEach(([id, amount]) => {
        const currency = CURRENCY_DEFS[id] ?? { name: id, icon: null };
        const li = document.createElement("li");
        li.className = "wallet-row";
        const iconMarkup = currency.icon
            ? `<img src="${currency.icon}" alt="${currency.name}" class="item-icon" />`
            : `<span class="item-icon">${id.slice(0, 1).toUpperCase()}</span>`;
        li.innerHTML = `${iconMarkup}<span>${currency.name}</span><span class="subtle">${amount}</span>`;
        ui.walletList.appendChild(li);
    });
}

function renderInventory() {
    ui.inventoryList.innerHTML = "";
    ui.inventoryList.className = "list inventory-grid";
    const totals = getInventoryTotals();
    const entries = Object.entries(totals);
    if (entries.length === 0) {
        const li = document.createElement("li");
        li.className = "inventory-empty";
        li.textContent = "No items yet. Start a task to collect rewards.";
        ui.inventoryList.appendChild(li);
        return;
    }

    entries.forEach(([itemId, quantity]) => {
        const slot = { id: itemId, quantity };
        const meta = getItemDef(itemId);
        const stackLimit = getStackLimit(meta);
        const li = document.createElement("li");
        li.className = "inventory-slot";
        li.innerHTML = `
            <div class="inventory-badge" data-item="${slot.id}" data-qty="${slot.quantity}" data-stack="${stackLimit}">
                <div class="inventory-icon-wrap">
                    <img src="${meta.icon}" alt="${meta.name}" class="inventory-icon" />
                </div>
                <div class="inventory-amount">${formatCompactNumber(slot.quantity)}</div>
            </div>
        `;
        const badge = li.querySelector(".inventory-badge");
        if (badge) {
            badge.addEventListener("mouseenter", () => showInventoryPopover(slot, badge));
            badge.addEventListener("mouseleave", () => {
                if (!popoverPinned) hideInventoryPopover();
            });
            badge.addEventListener("click", (event) => {
                event.stopPropagation();
                popoverPinned = !popoverPinned;
                if (popoverPinned) {
                    showInventoryPopover(slot, badge);
                } else {
                    hideInventoryPopover();
                }
            });
        }
        ui.inventoryList.appendChild(li);
    });
}

function renderSkills() {
    ui.skillsList.innerHTML = "";
    skillUi.clear();
    skillProgress.clear();
    state.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.className = "skill-row";
        const dot = document.createElement("span");
        dot.textContent = skill.active ? "●" : "○";

        const iconBox = document.createElement("span");
        iconBox.className = "skill-icon";
        if (skill.iconImage) {
            const img = document.createElement("img");
            img.src = skill.iconImage;
            img.alt = `${skill.name} icon`;
            iconBox.appendChild(img);
        } else {
            iconBox.textContent = skill.icon;
        }

        const meta = document.createElement("div");
        meta.className = "skill-meta";
        const name = document.createElement("div");
        name.className = "skill-name";
        name.textContent = skill.name;
        const level = document.createElement("div");
        level.className = "subtle";
        level.textContent = `L${skill.level} • ${skill.xp} XP`;
        const progress = document.createElement("div");
        progress.className = "progress glow";
        const bar = document.createElement("div");
        bar.className = "bar";
        progress.appendChild(bar);
        meta.appendChild(name);
        meta.appendChild(level);
        meta.appendChild(progress);

        li.appendChild(dot);
        li.appendChild(iconBox);
        li.appendChild(meta);
        li.addEventListener("click", () => selectSkill(skill.id));
        ui.skillsList.appendChild(li);
        skillUi.set(skill.id, { bar, level, dot, row: li, iconBox });
        const initialProgress = getProgress(skill);
        bar.style.width = `${initialProgress * 100}%`;
        skillProgress.set(skill.id, initialProgress);
    });
}

function ensureSkillUi() {
    if (skillUi.size !== state.skills.length) {
        renderSkills();
    }
}

function updateSkillMeta() {
    ensureSkillUi();
    state.skills.forEach((skill) => {
        const parts = skillUi.get(skill.id);
        if (!parts) return;
        parts.dot.textContent = skill.active ? "●" : "○";
        parts.level.textContent = `L${skill.level} • ${skill.xp} XP`;
    });
}

function updateSkillBars(delta) {
    ensureSkillUi();
    if (!isModuleEnabled("renderer")) {
        ui.debugUiUpdates.textContent = "UI updates/frame: --";
        return;
    }
    uiUpdates = 0;
    const now = performance.now();
    const icon = document.querySelector(".skill-context .skill-icon");
    if (icon) {
        const bonusDecay = Math.exp(-delta * state.clickXpBonusDecayPerSecond);
        state.clickXpBonus *= bonusDecay;
        if (state.clickXpBonus < 0.000001) {
            state.clickXpBonus = 0;
        }

        const decay = Math.exp(-delta * state.clickEnergyDecayPerSecond);
        iconEnergyVelocity *= Math.exp(-delta * (state.clickEnergyDecayPerSecond + 1));
        iconEnergy *= decay;
        iconEnergy += iconEnergyVelocity;
        if (iconEnergy < 0.001) {
            iconEnergy = 0;
            iconEnergyVelocity = 0;
        }
        iconEnergy = clamp(iconEnergy, 0, state.clickEnergyMax);
        const energyRatio = state.clickEnergyMax > 0 ? iconEnergy / state.clickEnergyMax : 0;
        const scale = 0.5 + energyRatio * 0.4;
        const shift = energyRatio * 3.4;
        const rot = energyRatio * 2.6;
        icon.style.setProperty("--icon-energy-scale", scale.toFixed(3));
        icon.style.setProperty("--icon-energy-shift", `${shift.toFixed(2)}px`);
        icon.style.setProperty("--icon-energy-rot", `${rot.toFixed(2)}deg`);
    }

    if (ui.comboMeter && ui.comboValue && ui.comboFill) {
        const ratio = state.clickXpBonusMax > 0 ? state.clickXpBonus / state.clickXpBonusMax : 0;
        const percent = (state.clickXpBonus * 100).toFixed(2);
        ui.comboValue.textContent = `+${percent}%`;
        ui.comboFill.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
        ui.comboMeter.classList.toggle("visible", state.clickXpBonus > 0.0001);
    }
    if (iconComboLevel > 0 && now > iconComboExpireAt) {
        iconComboLevel = 0;
        const icon = document.querySelector(".skill-context .skill-icon");
        if (icon) {
            icon.classList.add("combo-deflate");
            icon.style.setProperty("--icon-combo-scale", "1");
            icon.style.removeProperty("--icon-pop-scale");
            icon.style.removeProperty("--icon-pop-overshoot");
            icon.style.removeProperty("--icon-wobble-rot");
            icon.style.removeProperty("--icon-wobble-shift");
            icon.style.removeProperty("--icon-wobble-scale");
            icon.style.removeProperty("--icon-burst-duration");
            window.setTimeout(() => {
                icon.classList.remove("combo-deflate");
                icon.classList.remove("level-up-burst");
            }, 900);
        }
    }
    if (pendingIconBurstAt && now >= pendingIconBurstAt) {
        if (pendingIconBurstSkillId === selectedSkillId) {
            triggerSkillIconLevelUp();
        }
        pendingIconBurstAt = 0;
        pendingIconBurstSkillId = null;
    }
    state.skills.forEach((skill) => {
        const parts = skillUi.get(skill.id);
        if (!parts) return;
        const bar = parts.bar;
        const holdUntil = skillCompletionHold.get(skill.id) ?? 0;
        const target = holdUntil > now ? 1 : getProgress(skill);
        const current = skillProgress.get(skill.id) ?? 0;
        const smoothing = 1 - Math.exp(-delta / 0.18);
        const next = current + (target - current) * smoothing;
        const clamped = clamp(next, 0, 1);
        if (Math.abs(clamped - current) > 0.0005 && bar) {
            bar.style.width = `${clamped * 100}%`;
            uiUpdates += 1;
        }
        skillProgress.set(skill.id, clamped);
    });
    ensureSelectedSkill();
    const selectedHold = skillCompletionHold.get(selectedSkillId) ?? 0;
    const selectedProgress = selectedHold > performance.now()
        ? 1
        : (skillProgress.get(selectedSkillId) ?? 0);
    const clampedProgress = clamp(selectedProgress, 0, 1);
    setRingProgress(clampedProgress);
    const selectedSkill = state.skills.find((s) => s.id === selectedSkillId);
    const isSelectedActive = Boolean(selectedSkill?.active);
    updateRingTip(clampedProgress, isSelectedActive);
    if (isSelectedActive && state.ringParticlesEnabled) {
        emitRingParticles(selectedProgress, now);
    }
    ui.debugUiUpdates.textContent = `UI updates/frame: ${uiUpdates}`;
}

function emitRingParticles(progress, now) {
    if (!ui.contextRingParticles || !ui.contextRing || !ui.contextRingWrap) return;
    if (!state.ringParticlesEnabled) return;
    const intensity = clamp(progress, 0, 1);
    const interval = 220 - intensity * 170;
    if (now - lastParticleTime < interval) return;
    lastParticleTime = now;

    const count = Math.max(1, Math.round(1 + intensity * 4));
    for (let i = 0; i < count; i++) {
        spawnRingParticle(progress);
    }

    if (progress >= 0.999 && now - lastCompletionBurst > 600) {
        lastCompletionBurst = now;
        for (let i = 0; i < 14; i++) {
            spawnRingParticle(1, true);
        }
    }
}

function setRingProgress(progress) {
    if (!ui.contextRingProgress) return;
    ui.contextRingProgress.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;
    ui.contextRingProgress.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - progress)}`;
}

function getRingMetrics() {
    if (!ui.contextRingWrap || !ui.contextRingProgress || !ui.contextRingSvg) return null;
    const wrapRect = ui.contextRingWrap.getBoundingClientRect();
    const svgRect = ui.contextRingSvg.getBoundingClientRect();
    if (!svgRect.width || !svgRect.height) return null;
    const viewBox = (ui.contextRingSvg.getAttribute("viewBox") ?? "0 0 100 100").split(" ");
    const viewSize = Number(viewBox[2]) || 100;
    const radius = Number(ui.contextRingProgress.getAttribute("r") ?? RING_RADIUS);
    const radiusPx = (svgRect.width * radius) / viewSize;
    return {
        centerX: svgRect.left - wrapRect.left + svgRect.width / 2,
        centerY: svgRect.top - wrapRect.top + svgRect.height / 2,
        radiusPx
    };
}

function updateRingTip(progress, isActive) {
    if (!ui.contextRing || !ui.contextRingTip || !ui.contextRingWrap) return;
    const metrics = getRingMetrics();
    if (!metrics) return;
    const tipRect = ui.contextRingTip.getBoundingClientRect();
    const radius = metrics.radiusPx;
    const angle = (progress * Math.PI * 2) - Math.PI / 2;
    const centerX = metrics.centerX;
    const centerY = metrics.centerY;
    const tipX = centerX + Math.cos(angle) * radius - tipRect.width / 2;
    const tipY = centerY + Math.sin(angle) * radius - tipRect.height / 2;
    ui.contextRingTip.style.left = `${tipX}px`;
    ui.contextRingTip.style.top = `${tipY}px`;
    ui.contextRingTip.style.opacity = isActive ? `${0.4 + clamp(progress, 0, 1) * 0.6}` : "0";
}

function spawnRingParticle(progress, burst = false) {
    if (!ui.contextRingParticles || !ui.contextRing || !ui.contextRingWrap) return;
    const particle = document.createElement("span");
    particle.className = "ring-particle";
    const metrics = getRingMetrics();
    if (!metrics) return;
    const radius = metrics.radiusPx;
    const angle = (progress * Math.PI * 2) - Math.PI / 2;
    const centerX = metrics.centerX;
    const centerY = metrics.centerY;
    const tipX = centerX + Math.cos(angle) * radius;
    const tipY = centerY + Math.sin(angle) * radius;
    const spread = burst ? 18 : 8;
    const driftX = (Math.random() - 0.5) * spread;
    const driftY = (Math.random() - 0.5) * spread - 12;
    const size = burst ? 8 : 4 + Math.random() * 4;
    const duration = burst ? 0.8 : 0.6 + Math.random() * 0.6;
    const hue = 280 + Math.random() * 60;

    particle.style.left = `${tipX}px`;
    particle.style.top = `${tipY}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.setProperty("--dx", `${driftX}px`);
    particle.style.setProperty("--dy", `${driftY}px`);
    particle.style.background = `radial-gradient(circle, hsla(${hue}, 90%, 80%, 1), hsla(${hue}, 90%, 70%, 0.6))`;
    ui.contextRingParticles.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
}

function triggerContextShake() {
    if (!contextCard) return;
    contextCard.classList.remove("shake");
    void contextCard.offsetWidth;
    contextCard.classList.add("shake");
}

function pushIconCombo(levels = 1) {
    const now = performance.now();
    iconComboLevel = Math.min(8, iconComboLevel + levels);
    const extension = 1100 + iconComboLevel * 160;
    iconComboExpireAt = Math.max(iconComboExpireAt, now + extension);
    const icon = document.querySelector(".skill-context .skill-icon");
    if (icon) {
        const comboScale = 1 + iconComboLevel * 0.06;
        icon.style.setProperty("--icon-combo-scale", `${comboScale.toFixed(2)}`);
        icon.classList.remove("combo-deflate");
    }
}

function triggerSkillIconLevelUp() {
    const icon = document.querySelector(".skill-context .skill-icon");
    if (!icon) return;
    const combo = Math.max(1, iconComboLevel || 1);
    const popScale = 1.2 + combo * 0.05;
    const popOvershoot = 0.94 - combo * 0.01;
    const wobbleRot = 10 + combo * 2.2;
    const wobbleShift = 4 + combo * 0.7;
    const wobbleScale = 1.08 + combo * 0.02;
    const burstDuration = 0.5 + combo * 0.05;
    const comboScale = 1 + combo * 0.06;
    icon.style.setProperty("--icon-combo-scale", `${comboScale.toFixed(2)}`);
    icon.style.setProperty("--icon-pop-scale", `${popScale.toFixed(2)}`);
    icon.style.setProperty("--icon-pop-overshoot", `${popOvershoot.toFixed(2)}`);
    icon.style.setProperty("--icon-wobble-rot", `${wobbleRot.toFixed(1)}deg`);
    icon.style.setProperty("--icon-wobble-shift", `${wobbleShift.toFixed(1)}px`);
    icon.style.setProperty("--icon-wobble-scale", `${wobbleScale.toFixed(2)}`);
    icon.style.setProperty("--icon-burst-duration", `${burstDuration.toFixed(2)}s`);
    icon.classList.remove("level-up-burst");
    void icon.offsetWidth;
    icon.classList.add("level-up-burst");
    if (iconBurstTimeoutId) {
        clearTimeout(iconBurstTimeoutId);
    }
    iconBurstTimeoutId = window.setTimeout(() => {
        if (performance.now() >= iconComboExpireAt) {
            icon.classList.remove("level-up-burst");
        }
    }, Math.round(burstDuration * 1000));

    let burst = icon.querySelector(".skill-icon-burst");
    if (!burst) {
        burst = document.createElement("span");
        burst.className = "skill-icon-burst";
        burst.setAttribute("aria-hidden", "true");
        icon.appendChild(burst);
    }

    burst.innerHTML = "";
    const particleCount = 18 + Math.round(combo * 2);
    for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement("span");
        particle.className = "skill-icon-particle";
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.35;
        const distance = (28 + Math.random() * 36) * (1 + combo * 0.08);
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const size = 4 + Math.random() * 4 + combo * 0.4;
        particle.style.setProperty("--dx", `${dx}px`);
        particle.style.setProperty("--dy", `${dy}px`);
        particle.style.setProperty("--size", `${size}px`);
        burst.appendChild(particle);
        particle.addEventListener("animationend", () => particle.remove(), { once: true });
    }
}

function triggerSkillListLevelUp(skillId) {
    const entry = skillUi.get(skillId);
    if (!entry?.row) return;
    entry.row.classList.remove("level-up");
    void entry.row.offsetWidth;
    entry.row.classList.add("level-up");
    entry.row.addEventListener("animationend", () => entry.row.classList.remove("level-up"), { once: true });
}

function renderSkillContext() {
    ensureSelectedSkill();
    const skill = state.skills.find((s) => s.id === selectedSkillId) ?? state.skills[0];
    if (!skill) return;
    selectedSkillId = skill.id;
    const activeTask = skill.tasks.find((task) => task.id === skill.task);
    const activeTaskBadge = document.getElementById("activeTaskBadge");
    if (activeTaskBadge) {
        activeTaskBadge.innerHTML = `<span class="active-dot">●</span><span>Selected: ${activeTask?.label ?? "None"}</span>`;
    }
    const iconContainer = document.querySelector(".skill-context .skill-icon");
    if (iconContainer) {
        iconContainer.classList.toggle("is-active", Boolean(skill.active));
    }
    if (skill.iconImage) {
        ui.skillIconImg.src = skill.iconImage;
        ui.skillIconImg.style.display = "block";
        ui.skillIcon.style.display = "none";
    } else {
        ui.skillIconImg.style.display = "none";
        ui.skillIcon.style.display = "inline";
        ui.skillIcon.textContent = skill.icon;
    }
    ui.skillName.textContent = skill.name.toUpperCase();
    if (ui.skillLevel) {
        ui.skillLevel.textContent = `${skill.level}`;
    }
    const nextXp = xpForLevel(skill.level + 1);
    ui.skillDetails.textContent = `${skill.xp.toLocaleString()} / ${nextXp.toLocaleString()} XP`;
    if (ui.contextRing) {
        if (isModuleEnabled("renderer")) {
            const holdUntil = skillCompletionHold.get(skill.id) ?? 0;
            const progress = holdUntil > performance.now() ? 1 : (skillProgress.get(skill.id) ?? getProgress(skill));
            const clampedProgress = clamp(progress, 0, 1);
            setRingProgress(clampedProgress);
            updateRingTip(clampedProgress, Boolean(skill.active));
        } else {
            setRingProgress(0);
            updateRingTip(0, false);
        }
    }

    const taskListKey = `${skill.id}|${skill.level}|${skill.tasks.map((task) => `${task.id}:${task.level}:${task.iconImage ?? ""}:${task.rewardItemId ?? ""}`)
        .join("|")}`;
    if (taskListKey !== lastTaskListKey) {
        ui.taskList.innerHTML = "";
        skill.tasks.forEach((task) => {
            const li = document.createElement("li");
            li.dataset.taskId = task.id;
            const locked = skill.level < task.level;
            const rewardItem = task.rewardItemId ? ITEM_DEFS[task.rewardItemId] : null;
            const rewardIcon = rewardItem
                ? `<img src="${rewardItem.icon}" alt="${rewardItem.name}" class="item-icon" />`
                : "";
            const taskIcon = task.iconImage
                ? `<img src="${task.iconImage}" alt="${task.label}" class="item-icon task-icon" />`
                : `<span>${locked ? "🔒" : "✅"}</span>`;
            const labelSuffix = locked ? " • Locked" : "";
            li.innerHTML = `${taskIcon}<div><div>${task.label}${labelSuffix}</div><div class="subtle">Level ${task.level} • ${task.reward}</div></div><span class="reward-icon">${rewardIcon}</span>`;
            li.style.opacity = locked ? "0.5" : "1";
            if (!locked) {
                li.addEventListener("click", () => {
                    skill.task = task.id;
                    pendingTaskBounceId = task.id;
                    renderSkillContext();
                });
            }
            if (skill.task === task.id) {
                li.classList.add("selected");
            }
            ui.taskList.appendChild(li);
        });
        lastTaskListKey = taskListKey;
    }

    ui.taskList.querySelectorAll("li").forEach((li) => {
        const taskId = li.dataset.taskId;
        if (!taskId) return;
        li.classList.toggle("selected", skill.task === taskId);
        if (pendingTaskBounceId === taskId) {
            const iconEl = li.querySelector(".task-icon");
            if (iconEl) {
                iconEl.classList.add("task-bounce");
                iconEl.addEventListener("animationend", () => iconEl.classList.remove("task-bounce"), {
                    once: true
                });
            }
        }
    });
    pendingTaskBounceId = null;

    ui.taskAction.textContent = skill.active
        ? "Stop"
        : skill.id === "gambling"
            ? "Play"
            : "Idle";
    ui.taskActionHint.textContent = skill.active
        ? `Training ${skill.task} in the background.`
        : `Start ${skill.task} to gain XP and rewards.`;
}

function selectSkill(skillId) {
    selectedSkillId = skillId;
    renderSkillContext();
}

function toggleSkillAction() {
    if (!isModuleEnabled("skills")) return;
    const skill = state.skills.find((s) => s.id === selectedSkillId);
    if (!skill) return;
    const currentlyActive = state.skills.find((s) => s.active);
    if (currentlyActive && currentlyActive.id !== skill.id) {
        currentlyActive.active = false;
    }
    skill.active = !skill.active;
    if (skill.active) {
        state.lastActiveSkillId = skill.id;
    }
    updateSkillMeta();
    renderSkillContext();
}

function boostSkillLevels(skillId, amount) {
    if (!isModuleEnabled("skills")) return;
    const skill = state.skills.find((s) => s.id === skillId);
    if (!skill || amount <= 0) return;
    const previousLevel = skill.level;
    const nextLevel = clamp(skill.level + amount, 1, skill.maxLevel);
    skill.level = nextLevel;
    skill.xp = xpForLevel(nextLevel);
    const gained = nextLevel - previousLevel;
    if (gained > 0) {
        const holdUntil = performance.now() + 450;
        skillCompletionHold.set(skill.id, holdUntil);
        if (skill.id === selectedSkillId) {
            triggerContextShake();
            pushIconCombo(gained);
            pendingIconBurstAt = holdUntil - 220;
            pendingIconBurstSkillId = skill.id;
        } else {
            triggerSkillListLevelUp(skill.id);
        }
    }
    updateSkillMeta();
    renderSkillContext();
    updateLists();
    updateInspectors();
}

function applySkillXp(skill, amount, triggerEffects) {
    if (!isModuleEnabled("skills")) return;
    if (!skill || amount <= 0) return;
    const previousLevel = skill.level;
    skill.xp += amount;
    while (skill.level < skill.maxLevel && skill.xp >= xpForLevel(skill.level + 1)) {
        skill.level += 1;
    }
    const gained = skill.level - previousLevel;
    if (gained > 0 && triggerEffects) {
        const holdUntil = performance.now() + 450;
        skillCompletionHold.set(skill.id, holdUntil);
        if (skill.id === selectedSkillId) {
            triggerContextShake();
            pushIconCombo(gained);
            pendingIconBurstAt = holdUntil - 220;
            pendingIconBurstSkillId = skill.id;
            addIconEnergy(state.clickEnergyLevelUpBoost + gained * state.clickEnergyLevelUpPerLevel);
        } else {
            triggerSkillListLevelUp(skill.id);
        }
    }
}

function applySkillTick(skill, triggerEffects) {
    if (!skill) return;
    const xpGain = skill.id === "gambling" ? 18 : 12;
    const clickBonus = clamp(state.clickXpBonus, 0, state.clickXpBonusMax);
    const adjustedXp = Math.max(0, Math.round(xpGain * state.skillXpMultiplier * (1 + clickBonus)));
    applySkillXp(skill, adjustedXp, triggerEffects);
    if (skill.id === "gambling") {
        if (isModuleEnabled("inventory")) {
            if (skill.task === "scratchers") {
                const reward = Math.max(1, Math.round(randInt(1, 3) * state.rewardMultiplier));
                addItemToInventory("chip_green", reward);
            }
            if (skill.task === "keno") {
                const reward = Math.max(1, Math.round(randInt(1, 3) * state.rewardMultiplier));
                addItemToInventory("chip_blue", reward);
            }
        }
        if (isModuleEnabled("economy")) {
            state.wallet.cash += Math.round(2 * state.cashMultiplier);
        }
    } else {
        if (isModuleEnabled("economy")) {
            state.wallet.cash += Math.round(1 * state.cashMultiplier);
        }
    }
}

function addIconEnergy(amount) {
    const capped = clamp(amount, 0, state.clickEnergyMax);
    iconEnergy = Math.min(state.clickEnergyMax, iconEnergy + capped);
    iconEnergyVelocity += capped * 0.35;
}

function triggerIconClickBurst() {
    const icon = document.querySelector(".skill-context .skill-icon");
    if (!icon) return;
    icon.classList.remove("click-burst");
    void icon.offsetWidth;
    icon.classList.add("click-burst");
    icon.addEventListener("animationend", () => icon.classList.remove("click-burst"), { once: true });
}

function spawnClickPop(event) {
    const icon = event.currentTarget;
    if (!(icon instanceof HTMLElement)) return;
    const rect = icon.getBoundingClientRect();
    const jitterX = (Math.random() - 0.5) * 12;
    const jitterY = (Math.random() - 0.5) * 10;
    const driftX = (Math.random() - 0.5) * 140;
    const driftY = -(70 + Math.random() * 50);
    const driftRot = (Math.random() - 0.5) * 30;
    const midScale = 0.35;
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;
    const percentX = rect.width > 0 ? (rawX / rect.width) * 100 : 50;
    const percentY = rect.height > 0 ? (rawY / rect.height) * 100 : 50;
    const pop = document.createElement("span");
    const bonus = (state.clickXpBonusPerClick * 100).toFixed(2);
    pop.className = "click-pop";
    pop.textContent = `+${bonus}%`;
    pop.style.left = `${percentX}%`;
    pop.style.top = `${percentY}%`;
    pop.style.marginLeft = `${jitterX}px`;
    pop.style.marginTop = `${jitterY}px`;
    pop.style.setProperty("--pop-dx-mid", `${driftX * midScale}px`);
    pop.style.setProperty("--pop-dy-mid", `${driftY * midScale}px`);
    pop.style.setProperty("--pop-rot-mid", `${driftRot * midScale}deg`);
    pop.style.setProperty("--pop-dx-end", `${driftX}px`);
    pop.style.setProperty("--pop-dy-end", `${driftY}px`);
    pop.style.setProperty("--pop-rot-end", `${driftRot}deg`);
    icon.appendChild(pop);
    pop.addEventListener("animationend", () => pop.remove(), { once: true });
}

function applyActiveSkillClick() {
    if (state.isLocked || !isModuleEnabled("skills")) return;
    const skill = state.skills.find((entry) => entry.id === selectedSkillId);
    if (!skill) return;
    state.clickXpBonus = clamp(
        state.clickXpBonus + state.clickXpBonusPerClick,
        0,
        state.clickXpBonusMax
    );
    addIconEnergy(state.clickEnergyPerClick);
    triggerIconClickBurst();
    updateLists();
    updateInspectors();
}

function tickOnce(options = {}) {
    if (state.isLocked || !isModuleEnabled("simulation")) return;
    const { recordSample = true } = options;
    state.tick += 1;
    if (recordSample) {
        recordTickSample();
    }
    const active = state.skills.find((s) => s.active);
    if (active) {
        applySkillTick(active, true);
    }
    const combatLine = state.tick % 2 === 0 ? "player hits slime (3)" : "slime misses";
    state.combat.unshift(combatLine);
    state.combat = state.combat.slice(0, 5);
    updateDebugTelemetry();
    updateLists();
}

function runOffline(seconds) {
    lastOfflineSeconds = seconds;
    if (ui.debugOnline) {
        ui.debugOnline.textContent = "Offline (reconciling)";
    }
    if (ui.debugOffline) {
        ui.debugOffline.textContent = `Last offline: ${seconds}s`;
    }
    for (let i = 0; i < seconds; i++) {
        tickOnce({ recordSample: false });
    }
    if (ui.debugOnline) {
        ui.debugOnline.textContent = "Online";
    }
}

function saveSnapshot(silent = false, bypassDebugGuard = false) {
    if (!bypassDebugGuard && !state.debugControlsEnabled) return;
    const snapshot = {
        tick: state.tick,
        wallet: state.wallet,
        inventorySlots: state.inventorySlots,
        skills: state.skills.map((skill) => ({
            id: skill.id,
            level: skill.level,
            xp: skill.xp,
            active: skill.active,
            task: skill.task
        })),
        selectedSkillId,
        lastActiveSkillId: state.lastActiveSkillId,
        saveStatus: "Saved"
    };
    persistSnapshot(snapshot);
    lastSavedAt = Date.now();
    if (!silent) {
        state.saveStatus = "Saved";
        updateLists();
    }
}

function loadSnapshot(bypassDebugGuard = false) {
    if (!bypassDebugGuard && !state.debugControlsEnabled) return;
    const raw = loadSnapshotFromStorage();
    if (!raw) {
        state.saveStatus = "No snapshot";
        updateLists();
        return;
    }

    const snapshot = JSON.parse(raw);
    state.tick = snapshot.tick ?? 0;
    state.wallet = snapshot.wallet ?? state.wallet;
    if (Array.isArray(snapshot.inventorySlots)) {
        state.inventorySlots = snapshot.inventorySlots;
    } else if (snapshot.inventory && typeof snapshot.inventory === "object") {
        state.inventorySlots = Object.entries(snapshot.inventory)
            .filter(([, amount]) => amount > 0)
            .flatMap(([id, amount]) => {
                const def = getItemDef(id);
                const limit = getStackLimit(def);
                const slots = [];
                let remaining = amount;
                while (remaining > 0) {
                    const toAdd = def.stackable === false || def.unique ? 1 : Math.min(limit, remaining);
                    slots.push({ id, quantity: toAdd });
                    remaining -= toAdd;
                }
                return slots;
            });
    }
    if (Array.isArray(snapshot.skills)) {
        snapshot.skills.forEach((entry) => {
            const skill = state.skills.find((s) => s.id === entry.id);
            if (!skill) return;
            skill.level = entry.level ?? skill.level;
            skill.xp = entry.xp ?? skill.xp;
            skill.active = entry.active ?? false;
            skill.task = entry.task ?? entry.mode ?? skill.task;
        });
    }

    if (snapshot?.selectedSkillId) {
        selectedSkillId = snapshot.selectedSkillId;
    }
    if (snapshot?.lastActiveSkillId) {
        state.lastActiveSkillId = snapshot.lastActiveSkillId;
    }
    const activeSkill = state.skills.find((skill) => skill.active);
    if (activeSkill) {
        selectedSkillId = activeSkill.id;
        state.lastActiveSkillId = activeSkill.id;
    }
    state.saveStatus = "Loaded";
    applyZoom(state.zoom);
    applyTickRate(state.tickRate);
    persistModuleState();

    updateLists();
}

function resetDevAccount() {
    const locked = state.isLocked;
    const sandbox = state.sandboxEnabled;
    state.tick = 0;
    state.wallet = { cash: 0, credit: 0 };
    state.inventorySlots = [];
    state.inventoryHistory = {};
    state.skills.forEach((skill) => {
        skill.level = 1;
        skill.xp = 0;
        skill.active = false;
        if (skill.id === "gambling") {
            skill.task = "scratchers";
        } else if (skill.id === "idling") {
            skill.task = "idle";
        }
    });
    state.combat = ["player hits slime (3)", "slime misses"];
    state.quests = ["Win Scratchers (0/5)", "Play Keno (0/3)"];
    state.achievements = ["High Roller (0/10)", "Stack Chips (0/12)"];
    state.collections = ["Gambling Set: 0/3"];
    state.saveStatus = "Reset";
    state.lastActiveSkillId = null;
    selectedSkillId = state.skills[0]?.id ?? "gambling";
    resetModulePreferencesToDefaults();
    applyModelViewerSettings();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(THEME_STORAGE_KEY);
    ThemeManager.restore();
    state.isLocked = locked;
    state.sandboxEnabled = sandbox;
    refreshToggleButtons();
    updateLists();
}

function updateLists() {
    const totals = getInventoryTotals();
    const green = totals.chip_green ?? 0;
    const blue = totals.chip_blue ?? 0;
    state.quests = [
        `Win Scratchers (${Math.min(green, 5)}/5)`,
        `Play Keno (${Math.min(blue, 3)}/3)`
    ];
    state.achievements = [
        `High Roller (${Math.min(state.wallet.cash, 100)}/100)`,
        `Stack Chips (${Math.min(green + blue, 12)}/12)`
    ];
    const collectionCount = [green > 0, blue > 0, true].filter(Boolean).length;
    state.collections = [`Gambling Set: ${collectionCount}/3`];

    renderWallet();
    renderInventory();
    updateSkillMeta();
    renderSkillContext();
    renderList(ui.worldList, state.world);
    renderList(ui.equipmentList, state.equipment);
    renderList(ui.questList, state.quests);
    renderList(ui.achievementList, state.achievements);
    renderList(ui.collectionList, state.collections);
    renderList(ui.combatList, state.combat);
    renderList(ui.craftingList, state.crafting);
    renderList(ui.tradeList, state.trade);
    renderList(ui.generatorList, state.generator);
    renderList(ui.compendiumList, state.compendium);
    ui.saveStatus.textContent = state.saveStatus;
    updateInspectors();
    updatePinnedValues();
}

function updateInspectors() {
    ui.walletInspector.innerHTML = "";
    Object.entries(state.wallet).forEach(([name, value]) => {
        const currency = CURRENCY_DEFS[name] ?? { name, icon: null };
        const row = document.createElement("div");
        row.className = "inspector-row";
        const iconMarkup = currency.icon
            ? `<img src="${currency.icon}" alt="${currency.name}" class="item-icon" />`
            : `<span class="item-icon">${name.slice(0, 1).toUpperCase()}</span>`;
        row.innerHTML = `${iconMarkup}<span>${currency.name}</span><span class="subtle">${value}</span>`;
        const add = document.createElement("button");
        add.className = "button";
        add.textContent = "+10";
        add.onclick = () => {
            state.wallet[name] += 10;
            updateLists();
            updateInspectors();
        };
        const remove = document.createElement("button");
        remove.className = "button";
        remove.textContent = "-10";
        remove.onclick = () => {
            state.wallet[name] = Math.max(0, state.wallet[name] - 10);
            updateLists();
            updateInspectors();
        };
        row.appendChild(add);
        row.appendChild(remove);
        ui.walletInspector.appendChild(row);
    });

    ui.inventoryInspector.innerHTML = "";
    const totals = getInventoryTotals();
    Object.entries(totals).forEach(([name, value]) => {
        const item = getItemDef(name);
        const row = document.createElement("div");
        row.className = "inspector-row";
        const iconMarkup = item.icon
            ? `<img src="${item.icon}" alt="${item.name}" class="item-icon" />`
            : `<span class="item-icon">${name.slice(0, 1).toUpperCase()}</span>`;
        row.innerHTML = `${iconMarkup}<span>${item.name}</span><span class="subtle">${value}</span>`;
        const add = document.createElement("button");
        add.className = "button";
        add.textContent = "+1";
        add.onclick = () => {
            addItemToInventory(name, 1);
            updateLists();
            updateInspectors();
        };
        const remove = document.createElement("button");
        remove.className = "button";
        remove.textContent = "-1";
        remove.onclick = () => {
            removeItemFromInventory(name, 1);
            updateLists();
            updateInspectors();
        };
        row.appendChild(add);
        row.appendChild(remove);
        ui.inventoryInspector.appendChild(row);
    });

    ui.skillInspector.innerHTML = "";
    state.skills.forEach((skill) => {
        const row = document.createElement("div");
        row.className = "inspector-row";
        row.innerHTML = `<span>${skill.name}</span><span class="subtle">L${skill.level} • ${skill.xp} XP</span>`;
        const addSmall = document.createElement("button");
        addSmall.className = "button";
        addSmall.textContent = "+100 XP";
        addSmall.onclick = () => {
            applySkillXp(skill, 100, true);
            updateLists();
            updateInspectors();
        };
        const addLarge = document.createElement("button");
        addLarge.className = "button";
        addLarge.textContent = "+1000 XP";
        addLarge.onclick = () => {
            applySkillXp(skill, 1000, true);
            updateLists();
            updateInspectors();
        };
        row.appendChild(addSmall);
        row.appendChild(addLarge);
        ui.skillInspector.appendChild(row);
    });

    renderContentPacks();
    renderModules();
}

function renderContentPacks() {
    if (!ui.contentPackInspector) return;
    ui.contentPackInspector.innerHTML = "";
    const controlsDisabled = !state.debugControlsEnabled;
    state.contentPacks.forEach((pack) => {
        const card = document.createElement("div");
        card.className = "module-card";
        if (!pack.enabled) {
            card.classList.add("is-disabled");
        }

        const header = document.createElement("div");
        header.className = "module-header";
        header.innerHTML = `
            <div>
                <div class="module-title">${pack.name}</div>
                <div class="subtle">v${pack.version} • ${pack.id}</div>
                <div class="subtle">${pack.description ?? ""}</div>
            </div>
        `;
        const toggle = document.createElement("button");
        toggle.className = "button ghost";
        toggle.textContent = pack.enabled ? "Enabled" : "Disabled";
        toggle.onclick = () => {
            pack.enabled = !pack.enabled;
            renderContentPacks();
        };
        header.appendChild(toggle);
        card.appendChild(header);

        const props = [
            { label: "Skills", value: state.skills.length },
            { label: "Items", value: Object.keys(ITEM_DEFS).length },
            { label: "Modules", value: moduleDefinitions.length + externalModules.length }
        ];
        props.forEach((prop) => {
            const row = document.createElement("div");
            row.className = "module-prop";
            row.innerHTML = `<span>${prop.label}</span><span class="subtle">${prop.value}</span>`;
            card.appendChild(row);
        });

        (pack.properties ?? []).forEach((prop) => {
            if (!prop?.id) return;
            const row = document.createElement("div");
            row.className = "module-prop";
            const label = document.createElement("span");
            label.textContent = prop.label ?? prop.id;
            if (prop.type === "boolean") {
                const input = document.createElement("input");
                input.type = "checkbox";
                input.checked = Boolean(prop.get ? prop.get() : prop.value);
                input.disabled = controlsDisabled;
                input.onchange = () => {
                    if (controlsDisabled) return;
                    if (prop.set) {
                        prop.set(input.checked);
                    } else {
                        prop.value = input.checked;
                    }
                    renderContentPacks();
                };
                row.appendChild(label);
                row.appendChild(input);
            } else {
                const input = document.createElement("input");
                input.className = "text-input";
                input.type = "number";
                input.min = prop.min ?? 0;
                input.max = prop.max ?? 999;
                input.step = prop.step ?? 1;
                input.value = prop.get ? prop.get() : prop.value ?? 0;
                input.disabled = controlsDisabled;
                input.onchange = () => {
                    if (controlsDisabled) return;
                    const next = Number(input.value);
                    if (prop.set) {
                        prop.set(next);
                    } else {
                        prop.value = next;
                    }
                    renderContentPacks();
                };
                const value = document.createElement("span");
                value.className = "subtle";
                value.textContent = input.value;
                input.oninput = () => {
                    value.textContent = input.value;
                };
                row.appendChild(label);
                row.appendChild(input);
                row.appendChild(value);
            }
            row.appendChild(createPinButton(`pack:${pack.id}:${prop.id}`));
            card.appendChild(row);
        });
        ui.contentPackInspector.appendChild(card);
    });
}

function renderModules() {
    if (!ui.moduleInspector) return;
    ui.moduleInspector.innerHTML = "";
    const controlsDisabled = !state.debugControlsEnabled;

    const allModules = [...moduleDefinitions, ...externalModules];
    allModules.forEach((module) => {
        const isExternal = !moduleDefinitions.some((definition) => definition.id === module.id);
        const card = document.createElement("div");
        card.className = "module-card";

        const header = document.createElement("div");
        header.className = "module-header";
        header.innerHTML = `
            <div>
                <div class="module-title">${module.name}</div>
                <div class="subtle">v${module.version ?? "1.0.0"} • ${module.id}${isExternal ? " • external" : ""}</div>
                <div class="subtle">${module.description ?? ""}</div>
            </div>
        `;
        const toggle = document.createElement("button");
        toggle.className = "button ghost";
        const enabled = isExternal ? module.enabled !== false : isModuleEnabled(module.id);
        toggle.textContent = enabled ? "Enabled" : "Disabled";
        toggle.disabled = controlsDisabled;
        toggle.onclick = () => {
            if (controlsDisabled) return;
            if (isExternal) {
                module.enabled = !(module.enabled !== false);
            } else {
                moduleState[module.id] = { enabled: !enabled };
                if (module.id === "simulation") {
                    refreshTickLoop();
                }
            }
            persistModuleState();
            renderModules();
        };
        header.appendChild(toggle);
        card.appendChild(header);

        (module.properties ?? []).forEach((prop) => {
            if (!prop?.id) return;
            const row = document.createElement("div");
            row.className = "module-prop";
            const label = document.createElement("span");
            label.textContent = prop.label ?? prop.id;
            const value = document.createElement("span");
            value.className = "subtle";
            if (prop.type === "boolean") {
                const input = document.createElement("input");
                input.type = "checkbox";
                input.checked = Boolean(prop.get ? prop.get() : prop.value);
                input.disabled = controlsDisabled;
                input.onchange = () => {
                    if (controlsDisabled) return;
                    if (prop.set) {
                        prop.set(input.checked);
                    } else {
                        prop.value = input.checked;
                    }
                    persistModuleState();
                    renderModules();
                };
                row.appendChild(label);
                row.appendChild(input);
            } else {
                const input = document.createElement("input");
                input.className = "text-input";
                input.type = "number";
                input.min = prop.min ?? 0;
                input.max = prop.max ?? 999;
                input.step = prop.step ?? 1;
                input.value = prop.get ? prop.get() : prop.value ?? 0;
                input.disabled = controlsDisabled;
                input.onchange = () => {
                    if (controlsDisabled) return;
                    const next = Number(input.value);
                    if (prop.set) {
                        prop.set(next);
                    } else {
                        prop.value = next;
                    }
                    persistModuleState();
                    renderModules();
                };
                value.textContent = input.value;
                input.oninput = () => {
                    value.textContent = input.value;
                };
                row.appendChild(label);
                row.appendChild(input);
                row.appendChild(value);
            }
            row.appendChild(createPinButton(`module:${module.id}:${prop.id}`));
            card.appendChild(row);
        });

        ui.moduleInspector.appendChild(card);
    });
}

function normalizeExternalModule(module) {
    if (!module || typeof module !== "object") return null;
    const id = String(module.id ?? "").trim();
    if (!id) return null;
    const properties = Array.isArray(module.properties) ? module.properties : [];
    return {
        id,
        name: String(module.name ?? id),
        version: String(module.version ?? "1.0.0"),
        enabled: module.enabled !== false,
        description: String(module.description ?? ""),
        properties: properties
            .map((prop) => ({
                id: String(prop.id ?? ""),
                label: String(prop.label ?? prop.id ?? "Property"),
                type: prop.type === "boolean" ? "boolean" : "number",
                value: prop.type === "boolean" ? Boolean(prop.value) : Number(prop.value ?? 0),
                min: Number.isFinite(prop.min) ? prop.min : 0,
                max: Number.isFinite(prop.max) ? prop.max : 999,
                step: Number.isFinite(prop.step) ? prop.step : 1
            }))
            .filter((prop) => prop.id)
    };
}

function loadExternalModulesFromInput() {
    if (!ui.externalModuleInput) return;
    const raw = ui.externalModuleInput.value.trim();
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw);
        const modules = Array.isArray(parsed) ? parsed : [parsed];
        externalModules.length = 0;
        modules.forEach((module) => {
            const normalized = normalizeExternalModule(module);
            if (normalized) {
                externalModules.push(normalized);
            }
        });
        persistModuleState();
        renderModules();
    } catch (error) {
        console.warn("Failed to load external modules", error);
    }
}

function clearExternalModules() {
    externalModules.length = 0;
    if (ui.externalModuleInput) {
        ui.externalModuleInput.value = "";
    }
    persistModuleState();
    renderModules();
}

function animate(now) {
    if (!running) return;
    const frameCap = Number(state.renderFpsCap) || 0;
    if (frameCap > 0) {
        const minFrame = 1000 / frameCap;
        if (now - lastTick < minFrame) {
            requestAnimationFrame(animate);
            return;
        }
    }
    const delta = (now - lastTick) / 1000;
    if (!Number.isFinite(delta) || delta <= 0) {
        requestAnimationFrame(animate);
        return;
    }
    lastTick = now;
    fpsFrames += 1;
    fpsElapsed += delta;
    if (fpsElapsed >= 1) {
        currentFps = fpsFrames / fpsElapsed;
        updateDebugTelemetry();
        recordRuntimeFpsSample();
        fpsFrames = 0;
        fpsElapsed = 0;
    }
    telemetryElapsed += delta;
    if (telemetryElapsed >= 0.5) {
        telemetryElapsed = 0;
        updateDebugTelemetry();
        recordRuntimeFpsSample();
    }
    updateSkillBars(delta);
    if (modelRenderer && isModuleEnabled("renderer3d")) {
        modelRenderer.render(now / 1000);
    }
    lastUiUpdateCount = uiUpdates;
    requestAnimationFrame(animate);
}

function initializeModelPreviews() {
    const containers = document.querySelectorAll(".model-preview");
    if (!containers.length) return;
    if (!isModuleEnabled("renderer3d")) {
        containers.forEach((container) => {
            renderModelMessage(container, "3D preview disabled", container.dataset.fallback);
        });
        return;
    }
    if (!window.THREE) {
        containers.forEach((container) => {
            renderModelMessage(container, "Loading Three.js...", container.dataset.fallback);
        });
        ensureThreeJs().then((ready) => {
            if (ready) {
                initializeModelPreviews();
            } else {
                containers.forEach((container) => {
                    renderModelMessage(container, "Three.js not loaded", container.dataset.fallback);
                });
            }
        });
        return;
    }
    if (!modelRenderer) {
        modelRenderer = new ModelRenderer();
    }
    containers.forEach((container) => {
        const url = container.dataset.model;
        const fallback = container.dataset.fallback;
        const wobble = container.dataset.wobble !== "false";
        const spin = container.dataset.spin === "true";
        const spinSpeed = Number(container.dataset.spinSpeed || 0.6);
        if (!url) {
            renderModelMessage(container, "Select a model to preview", fallback);
            return;
        }
        modelRenderer.register(container, {
            url,
            fallback,
            wobble,
            spin,
            spinSpeed
        });
    });
    modelRenderer.refreshSizes();
}

function renderModelMessage(container, message, fallback) {
    container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "model-fallback";
    if (fallback) {
        const img = document.createElement("img");
        img.src = fallback;
        img.alt = "";
        img.className = "item-icon";
        wrapper.appendChild(img);
    }
    const label = document.createElement("span");
    label.textContent = message;
    wrapper.appendChild(label);
    container.appendChild(wrapper);
}

function refreshModelPreviews() {
    if (!modelRenderer || !isModuleEnabled("renderer3d")) return;
    modelRenderer.refreshSizes();
}

class ExpandedModelViewerDialog {
    constructor(renderer) {
        this.rendererHost = renderer;
        this.dialog = ui.modelViewerDialog;
        this.viewport = ui.modelViewerViewport;
        this.status = ui.modelViewerStatus;
        this.title = ui.modelViewerTitle;
        this.closeBtn = ui.modelViewerCloseBtn;
        this.resetBtn = ui.modelViewerResetBtn;
        this.rotateLeftBtn = ui.modelViewerRotateLeft;
        this.rotateRightBtn = ui.modelViewerRotateRight;
        this.autoRotateBtn = ui.modelViewerAutoRotate;
        this.zoomSlider = ui.modelViewerZoom;
        this.zoomInBtn = ui.modelViewerZoomIn;
        this.zoomOutBtn = ui.modelViewerZoomOut;
        this.zoomValue = ui.modelViewerZoomValue;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.root = null;
        this.resizeObserver = null;
        this.active = false;
        this.requestId = 0;
        this.zoomBaseDistance = null;
        this.zoomFactor = 1;
        this.autoRotateEnabled = state.modelViewer.autoRotate;
        this.renderLoopId = 0;
        this.manualControls = false;
        this.dragActive = false;
        this.dragPointerId = null;
        this.lastDragPosition = null;
        this.onPointerMove = null;
        this.onPointerUp = null;

        if (this.closeBtn) {
            this.closeBtn.addEventListener("click", () => this.close());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener("click", () => this.resetView());
        }
        if (this.rotateLeftBtn) {
            this.rotateLeftBtn.addEventListener("click", () => this.rotateBy(-0.2));
        }
        if (this.rotateRightBtn) {
            this.rotateRightBtn.addEventListener("click", () => this.rotateBy(0.2));
        }
        if (this.autoRotateBtn) {
            this.autoRotateBtn.addEventListener("click", () => this.toggleAutoRotate());
        }
        if (this.zoomSlider) {
            this.zoomSlider.addEventListener("input", () => {
                this.setZoomFactor(Number(this.zoomSlider.value || 1));
            });
        }
        if (this.zoomInBtn) {
            this.zoomInBtn.addEventListener("click", () => this.nudgeZoom(0.1));
        }
        if (this.zoomOutBtn) {
            this.zoomOutBtn.addEventListener("click", () => this.nudgeZoom(-0.1));
        }
    }

    async open(options) {
        if (!this.dialog || !this.viewport) return;
        this.dialog.classList.remove("hidden");
        this.dialog.setAttribute("aria-hidden", "false");
        this.active = true;
        if (this.title) {
            this.title.textContent = options?.label || "3D Model Viewer";
        }

        const requestId = ++this.requestId;
        const ready = await ensureThreeJs();
        if (!ready || !window.THREE) {
            this.setStatus("Three.js not loaded.", options?.fallback);
            return;
        }
        const OrbitControlsCtor = orbitControlsCtor ?? window.THREE?.OrbitControls ?? window.OrbitControls;
        if (!OrbitControlsCtor) {
            this.manualControls = true;
            this.setStatus("Orbit controls unavailable. Basic controls enabled.", options?.fallback);
        }
        this.ensureRenderer(OrbitControlsCtor ?? null);
        this.applySettings(state.modelViewer);
        this.startRenderLoop();
        const url = options?.url;
        if (!url) {
            this.setStatus("Load a model to use the expanded viewer.", options?.fallback);
            return;
        }
        await this.loadModel(options, requestId);
    }

    ensureRenderer(OrbitControlsCtor) {
        if (!this.viewport || this.renderer) return;
        this.renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        if (window.THREE.SRGBColorSpace) {
            this.renderer.outputColorSpace = window.THREE.SRGBColorSpace;
        }
        this.renderer.toneMapping = window.THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;
        this.scene = new window.THREE.Scene();
        this.camera = new window.THREE.PerspectiveCamera(45, 1, 0.1, 200);
        this.camera.position.set(0, 0.4, 7);

        const ambient = new window.THREE.AmbientLight(0xffffff, 0.85);
        const hemi = new window.THREE.HemisphereLight(0xffffff, 0x223344, 0.6);
        const key = new window.THREE.DirectionalLight(0xffffff, 0.95);
        key.position.set(4, 5, 7);
        this.scene.add(ambient, hemi, key);

        this.viewport.innerHTML = "";
        this.viewport.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.touchAction = "none";
        if (this.status) {
            this.viewport.appendChild(this.status);
        }

        if (OrbitControlsCtor) {
            this.controls = new OrbitControlsCtor(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.08;
            this.controls.enablePan = true;
            this.controls.enableZoom = true;
            this.controls.enableRotate = true;
            this.controls.autoRotate = this.autoRotateEnabled;
            if (window.THREE.MOUSE) {
                this.controls.mouseButtons = {
                    LEFT: window.THREE.MOUSE.ROTATE,
                    MIDDLE: window.THREE.MOUSE.DOLLY,
                    RIGHT: window.THREE.MOUSE.PAN
                };
            }
            if (window.THREE.TOUCH) {
                this.controls.touches = {
                    ONE: window.THREE.TOUCH.ROTATE,
                    TWO: window.THREE.TOUCH.DOLLY_PAN
                };
            }
        } else {
            this.controls = null;
            this.attachManualControls();
        }

        this.applySize();
        this.resizeObserver = new ResizeObserver(() => this.applySize());
        this.resizeObserver.observe(this.viewport);
    }

    async loadModel(options, requestId) {
        if (!options?.url || !this.scene) return;
        this.setStatus("Loading model...", options.fallback);
        try {
            const object = await this.rendererHost.loadModel(options.url);
            if (this.requestId !== requestId) return;
            if (this.root) {
                this.scene.remove(this.root);
                this.root = null;
            }
            const clone = object.clone(true);
            const bounds = this.rendererHost.prepareModel(clone);
            this.root = clone;
            this.scene.add(clone);
            if (bounds) {
                this.rendererHost.fitCamera({ camera: this.camera }, bounds);
                this.controls?.target?.set?.(0, 0, 0);
                this.controls?.saveState?.();
                this.setZoomBase();
            }
            this.clearStatus();
        } catch (error) {
            if (this.requestId !== requestId) return;
            this.setStatus("Model preview unavailable.", options.fallback);
            console.warn("Expanded viewer failed", error);
        }
    }

    applySize() {
        if (!this.renderer || !this.camera || !this.viewport) return;
        const rect = this.viewport.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    render() {
        if (!this.active || !this.renderer || !this.scene || !this.camera) return;
        this.controls?.update?.();
        if (!this.controls && this.root && this.autoRotateEnabled) {
            this.root.rotation.y += state.modelViewer.rotateSensitivity;
        }
        this.renderer.render(this.scene, this.camera);
    }

    startRenderLoop() {
        if (this.renderLoopId) return;
        const tick = () => {
            if (!this.active) {
                this.renderLoopId = 0;
                return;
            }
            this.render();
            this.renderLoopId = requestAnimationFrame(tick);
        };
        this.renderLoopId = requestAnimationFrame(tick);
    }

    stopRenderLoop() {
        if (!this.renderLoopId) return;
        cancelAnimationFrame(this.renderLoopId);
        this.renderLoopId = 0;
    }

    attachManualControls() {
        if (!this.renderer || !this.renderer.domElement || this.onPointerMove || this.onPointerUp) return;
        const canvas = this.renderer.domElement;
        canvas.addEventListener("pointerdown", (event) => {
            this.dragActive = true;
            this.dragPointerId = event.pointerId;
            this.lastDragPosition = { x: event.clientX, y: event.clientY };
            canvas.setPointerCapture?.(event.pointerId);
        });

        this.onPointerMove = (event) => {
            if (!this.dragActive || this.dragPointerId !== event.pointerId || !this.lastDragPosition) return;
            const dx = event.clientX - this.lastDragPosition.x;
            const dy = event.clientY - this.lastDragPosition.y;
            this.lastDragPosition = { x: event.clientX, y: event.clientY };
            if (this.root) {
                const sensitivity = state.modelViewer.rotateSensitivity;
                this.root.rotation.y += dx * sensitivity;
                this.root.rotation.x = Math.max(-1.2, Math.min(1.2, this.root.rotation.x + dy * sensitivity));
            }
            this.render();
        };

        this.onPointerUp = (event) => {
            if (this.dragPointerId !== event.pointerId) return;
            this.dragActive = false;
            this.dragPointerId = null;
            this.lastDragPosition = null;
            canvas.releasePointerCapture?.(event.pointerId);
        };

        canvas.addEventListener("pointermove", this.onPointerMove);
        canvas.addEventListener("pointerup", this.onPointerUp);
        canvas.addEventListener("pointercancel", this.onPointerUp);
        canvas.addEventListener("pointerleave", this.onPointerUp);
    }

    resetView() {
        if (this.controls?.reset) {
            this.controls.reset();
        } else if (this.root) {
            this.root.rotation.set(0, 0, 0);
        }
        this.setZoomBase();
        this.setZoomFactor(1);
        this.render();
    }

    close() {
        if (!this.dialog) return;
        this.active = false;
        this.stopRenderLoop();
        this.dialog.classList.add("hidden");
        this.dialog.setAttribute("aria-hidden", "true");
    }

    setZoomBase() {
        if (!this.camera) return;
        const target = this.controls?.target ?? new window.THREE.Vector3(0, 0, 0);
        this.zoomBaseDistance = this.camera.position.distanceTo(target);
        this.zoomFactor = 1;
        this.updateZoomConstraints();
        this.syncZoomUI();
    }

    setZoomFactor(factor) {
        if (!this.camera) return;
        const range = this.getZoomRange();
        const next = Math.min(range.max, Math.max(range.min, Number(factor) || 1));
        const target = this.controls?.target ?? new window.THREE.Vector3(0, 0, 0);
        const base = this.zoomBaseDistance ?? this.camera.position.distanceTo(target);
        const direction = this.camera.position.clone().sub(target);
        if (direction.lengthSq() > 0.0001) {
            direction.normalize();
        } else {
            direction.set(0, 0, 1);
        }
        const distance = base / next;
        this.camera.position.copy(target).add(direction.multiplyScalar(distance));
        this.camera.updateProjectionMatrix();
        this.controls?.update?.();
        this.zoomFactor = next;
        this.syncZoomUI();
        this.render();
    }

    nudgeZoom(delta) {
        this.setZoomFactor(this.zoomFactor + delta);
    }

    syncZoomUI() {
        if (this.zoomSlider) {
            this.zoomSlider.value = String(this.zoomFactor);
        }
        if (this.zoomValue) {
            this.zoomValue.textContent = `${Math.round(this.zoomFactor * 100)}%`;
        }
    }

    rotateBy(delta) {
        if (this.controls?.rotateLeft) {
            const speed = this.getRotateSpeed();
            this.controls.rotateLeft(delta * speed);
            this.controls.update?.();
        } else if (this.root) {
            this.root.rotation.y += delta * this.getRotateSpeed();
        }
        this.render();
    }

    toggleAutoRotate() {
        this.autoRotateEnabled = !this.autoRotateEnabled;
        if (this.controls) {
            this.controls.autoRotate = this.autoRotateEnabled;
        }
        if (this.autoRotateBtn) {
            this.autoRotateBtn.classList.toggle("is-active", this.autoRotateEnabled);
            this.autoRotateBtn.textContent = this.autoRotateEnabled ? "Auto Rotate: On" : "Auto Rotate";
        }
        this.render();
    }

    getZoomRange() {
        const min = clamp(Number(state.modelViewer.zoomMin) || 0.7, 0.4, 1);
        const max = clamp(Number(state.modelViewer.zoomMax) || 1.6, 1, 3);
        if (min >= max) {
            return { min: 0.7, max: 1.6 };
        }
        return { min, max };
    }

    getRotateSpeed() {
        return clamp(Number(state.modelViewer.rotateSensitivity) || 0.01, 0.002, 0.05) * 10;
    }

    updateZoomConstraints() {
        if (!this.zoomBaseDistance) return;
        const range = this.getZoomRange();
        const minDistance = this.zoomBaseDistance / range.max;
        const maxDistance = this.zoomBaseDistance / range.min;
        if (this.controls) {
            this.controls.minDistance = minDistance;
            this.controls.maxDistance = maxDistance;
            this.controls.zoomSpeed = clamp(Number(state.modelViewer.zoomSpeed) || 0.9, 0.2, 2);
            this.controls.rotateSpeed = this.getRotateSpeed();
        }
        if (this.zoomSlider) {
            this.zoomSlider.min = String(range.min);
            this.zoomSlider.max = String(range.max);
        }
        this.setZoomFactor(this.zoomFactor);
    }

    applySettings(settings) {
        if (!settings) return;
        this.autoRotateEnabled = Boolean(settings.autoRotate);
        if (this.controls) {
            this.controls.autoRotate = this.autoRotateEnabled;
        }
        if (this.autoRotateBtn) {
            this.autoRotateBtn.classList.toggle("is-active", this.autoRotateEnabled);
            this.autoRotateBtn.textContent = this.autoRotateEnabled ? "Auto Rotate: On" : "Auto Rotate";
        }
        this.updateZoomConstraints();
        this.syncZoomUI();
    }

    setStatus(message, fallback) {
        if (!this.status) return;
        this.status.innerHTML = "";
        this.status.classList.remove("hidden");
        if (fallback) {
            const img = document.createElement("img");
            img.src = fallback;
            img.alt = "";
            img.className = "item-icon";
            this.status.appendChild(img);
        }
        const label = document.createElement("span");
        label.textContent = message;
        this.status.appendChild(label);
    }

    clearStatus() {
        if (!this.status) return;
        this.status.classList.add("hidden");
        this.status.innerHTML = "";
    }
}

class ModelRenderer {
    constructor() {
        this.sprites = new Set();
        this.viewer = null;
        const objCtor = objLoaderCtor ?? window.THREE?.OBJLoader ?? window.OBJLoader;
        const gltfCtor = gltfLoaderCtor ?? window.THREE?.GLTFLoader ?? window.GLTFLoader;
        this.objLoader = objCtor ? new objCtor() : null;
        this.gltfLoader = gltfCtor ? new gltfCtor() : null;
        if (this.objLoader?.setCrossOrigin) {
            this.objLoader.setCrossOrigin("anonymous");
        }
        if (this.gltfLoader?.setCrossOrigin) {
            this.gltfLoader.setCrossOrigin("anonymous");
        }
        this.cache = new Map();
    }

    register(container, options) {
        if (!(container instanceof HTMLElement) || container.dataset.modelReady === "true") return;
        container.dataset.modelReady = "loading";
        const { url, fallback, wobble, spin, spinSpeed } = options;
        if (!window.THREE) {
            this.renderFallback(container, fallback);
            return;
        }
        const renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        if (window.THREE.SRGBColorSpace) {
            renderer.outputColorSpace = window.THREE.SRGBColorSpace;
        }
        renderer.toneMapping = window.THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        const scene = new window.THREE.Scene();
        const camera = new window.THREE.PerspectiveCamera(35, 1, 0.1, 100);
        camera.position.set(0, 0, 6);

        const ambient = new window.THREE.AmbientLight(0xffffff, 0.8);
        const hemi = new window.THREE.HemisphereLight(0xffffff, 0x223344, 0.55);
        const key = new window.THREE.DirectionalLight(0xffffff, 0.9);
        key.position.set(3, 4, 6);
        scene.add(ambient, hemi, key);

        container.innerHTML = "";
        container.appendChild(renderer.domElement);
        const status = this.renderStatus(container, "Loading model...");

        const sprite = {
            container,
            renderer,
            scene,
            camera,
            root: null,
            wobble: Boolean(wobble),
            spin: Boolean(spin),
            spinSpeed: Number.isFinite(spinSpeed) ? spinSpeed : 0.6,
            wobbleOffset: Math.random() * 10,
            resizeObserver: null,
            statusEl: status
        };

        this.applySize(sprite);
        sprite.resizeObserver = new ResizeObserver(() => this.applySize(sprite));
        sprite.resizeObserver.observe(container);

        this.loadModel(url)
            .then((object) => {
                const clone = object.clone(true);
                const bounds = this.prepareModel(clone);
                sprite.root = clone;
                sprite.scene.add(clone);
                if (bounds) {
                    this.fitCamera(sprite, bounds);
                }
                container.dataset.modelReady = "true";
                sprite.statusEl?.remove();
            })
            .catch((error) => {
                this.renderFallback(container, fallback, error);
                delete container.dataset.modelReady;
                this.dispose(sprite);
                this.sprites.delete(sprite);
            });

        this.sprites.add(sprite);
    }

    render(time) {
        for (const sprite of Array.from(this.sprites)) {
            if (!sprite.container.isConnected) {
                this.dispose(sprite);
                this.sprites.delete(sprite);
                continue;
            }
            if (sprite.root) {
                const t = time + sprite.wobbleOffset;
                if (sprite.wobble) {
                    sprite.root.rotation.y = t * 0.6;
                    sprite.root.rotation.x = Math.sin(t * 1.4) * 0.2;
                    sprite.root.position.y = Math.sin(t * 1.1) * 0.12;
                } else if (sprite.spin) {
                    sprite.root.rotation.y = t * sprite.spinSpeed;
                }
            }
            sprite.renderer.render(sprite.scene, sprite.camera);
        }
        this.viewer?.render();
    }

    applySize(sprite) {
        const size = sprite.container.getBoundingClientRect();
        const width = Math.max(1, Math.floor(size.width));
        const height = Math.max(1, Math.floor(size.height));
        sprite.renderer.setSize(width, height, false);
        sprite.camera.aspect = width / height;
        sprite.camera.updateProjectionMatrix();
    }

    refreshSizes() {
        for (const sprite of Array.from(this.sprites)) {
            if (!sprite.container.isConnected) continue;
            this.applySize(sprite);
        }
    }

    ensureViewer() {
        if (!this.viewer) {
            this.viewer = new ExpandedModelViewerDialog(this);
        }
        return this.viewer;
    }

    openExpandedViewerFromContainer(container) {
        if (!(container instanceof HTMLElement)) return;
        const viewer = this.ensureViewer();
        viewer.open({
            url: container.dataset.model,
            fallback: container.dataset.fallback,
            label: container.dataset.label || "3D Model Viewer"
        });
    }

    prepareModel(object) {
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = this.normalizeMaterial(child.material);
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });
        const box = new window.THREE.Box3().setFromObject(object);
        const size = new window.THREE.Vector3();
        box.getSize(size);
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.6 / maxAxis;
        object.scale.setScalar(scale);
        box.setFromObject(object);
        const center = new window.THREE.Vector3();
        box.getCenter(center);
        object.position.sub(center);
        const sphere = new window.THREE.Sphere();
        box.getBoundingSphere(sphere);
        return {
            radius: sphere.radius || 1
        };
    }

    normalizeMaterial(material) {
        if (Array.isArray(material)) {
            return material.map((entry) => this.normalizeMaterial(entry));
        }
        const baseColor = material?.color?.getHex?.() ?? 0xffffff;
        const map = material?.map ?? null;
        const normalized = material instanceof window.THREE.MeshStandardMaterial
            ? material.clone()
            : new window.THREE.MeshStandardMaterial({ color: baseColor });
        if (map) {
            normalized.map = map;
        }
        normalized.roughness = Number.isFinite(material?.roughness) ? material.roughness : 0.55;
        normalized.metalness = Number.isFinite(material?.metalness) ? material.metalness : 0.15;
        normalized.emissive = normalized.emissive?.clone?.() ?? new window.THREE.Color(baseColor);
        normalized.emissiveIntensity = 0.18;
        if (material?.isSkinnedMesh || material?.skinning) {
            normalized.skinning = true;
        }
        normalized.side = window.THREE.DoubleSide;
        normalized.needsUpdate = true;
        return normalized;
    }

    fitCamera(sprite, bounds) {
        if (!bounds?.radius || !sprite?.camera) return;
        const radius = Math.max(0.5, bounds.radius);
        const fov = (sprite.camera.fov * Math.PI) / 180;
        const distance = (radius / Math.tan(fov / 2)) * 1.2;
        sprite.camera.position.set(0, radius * 0.2, distance);
        sprite.camera.near = Math.max(0.01, distance - radius * 4);
        sprite.camera.far = distance + radius * 4;
        sprite.camera.lookAt(0, 0, 0);
        sprite.camera.updateProjectionMatrix();
    }

    loadModel(url) {
        if (!url) return Promise.reject(new Error("Missing model URL"));
        if (this.cache.has(url)) return this.cache.get(url);
        const promise = this.loadModelInternal(url);
        this.cache.set(url, promise);
        return promise;
    }

    async loadModelInternal(url) {
        const loader = await this.ensureLoader(url);
        if (!loader) throw new Error("No loader available for model");
        const isGltf = this.isGltf(url);
        return new Promise((resolve, reject) => {
            loader.load(url, (loaded) => {
                resolve(isGltf ? loaded.scene : loaded);
            }, undefined, reject);
        });
    }

    async ensureLoader(url) {
        if (this.isGltf(url)) {
            if (!this.gltfLoader) {
                await ensureThreeJs();
                const ctor = window.THREE?.GLTFLoader ?? window.GLTFLoader;
                this.gltfLoader = ctor ? new ctor() : null;
                if (this.gltfLoader?.setCrossOrigin) {
                    this.gltfLoader.setCrossOrigin("anonymous");
                }
            }
            return this.gltfLoader;
        }
        if (!this.objLoader) {
            await ensureThreeJs();
            const ctor = window.THREE?.OBJLoader ?? window.OBJLoader;
            this.objLoader = ctor ? new ctor() : null;
            if (this.objLoader?.setCrossOrigin) {
                this.objLoader.setCrossOrigin("anonymous");
            }
        }
        return this.objLoader;
    }

    isGltf(url) {
        const clean = url.split("?")[0].toLowerCase();
        if (clean.endsWith(".glb") || clean.endsWith(".gltf")) return true;
        const override = modelTypeOverrides.get(url);
        if (!override) return false;
        if (override.ext) {
            return override.ext === "glb" || override.ext === "gltf";
        }
        if (override.type) {
            return override.type === "model/gltf-binary" || override.type === "model/gltf+json";
        }
        return false;
    }

    getLoader(url) {
        return this.isGltf(url) ? this.gltfLoader : this.objLoader;
    }

    renderFallback(container, fallback, error) {
        container.innerHTML = "";
        const wrapper = document.createElement("div");
        wrapper.className = "model-fallback";
        if (fallback) {
            const img = document.createElement("img");
            img.src = fallback;
            img.alt = "";
            img.className = "item-icon";
            wrapper.appendChild(img);
        }
        const label = document.createElement("span");
        label.textContent = error ? "Model preview unavailable" : "Model preview";
        wrapper.appendChild(label);
        container.appendChild(wrapper);
        if (error) {
            console.warn("Model preview failed", error);
        }
    }

    renderStatus(container, message) {
        const status = document.createElement("div");
        status.className = "model-status";
        status.textContent = message;
        container.appendChild(status);
        return status;
    }

    dispose(sprite) {
        sprite.resizeObserver?.disconnect();
        sprite.renderer?.dispose();
    }
}

function initializeModelIcons() {
    if (!isModuleEnabled("renderer3d")) return;
    if (!window.THREE) return;
    if (!modelRenderer) {
        modelRenderer = new ModelRenderer();
    }
    document.querySelectorAll(".model-icon").forEach((container) => {
        const url = container.dataset.model;
        const fallback = container.dataset.fallback;
        modelRenderer.register(container, { url, fallback, wobble: true });
    });
}

function setupTabs() {
    document.querySelectorAll(".tabs .tab-button").forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.tab;
            const container = button.closest(".tabs");
            container.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
            container.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
            button.classList.add("active");
            container.querySelector(`.tab-panel[data-panel='${target}']`).classList.add("active");
        });
    });

    document.querySelectorAll(".overlay .tab-button").forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.tab;
            const container = button.closest(".overlay-panel");
            container.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
            container.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
            button.classList.add("active");
            container.querySelector(`.tab-panel[data-panel='${target}']`).classList.add("active");
            refreshModelPreviews();
        });
    });

    initializeModelPreviews();
}

function setupSplitters() {
    const layout = document.querySelector(".layout");
    const right = document.getElementById("rightPanel");
    const splitter = document.getElementById("splitterVertical");
    const splitterHorizontal = document.getElementById("splitterHorizontal");
    const gameView = document.getElementById("gameView");
    let draggingVertical = false;
    let draggingHorizontal = false;

    if (!layout || !right || !splitter) {
        return;
    }

    splitter.addEventListener("pointerdown", (event) => {
        draggingVertical = true;
        splitter.setPointerCapture(event.pointerId);
    });

    if (splitterHorizontal && gameView) {
        splitterHorizontal.addEventListener("pointerdown", (event) => {
            draggingHorizontal = true;
            splitterHorizontal.setPointerCapture(event.pointerId);
        });
    }

    window.addEventListener("pointermove", (event) => {
        if (draggingVertical) {
            const rect = layout.getBoundingClientRect();
            const width = clamp(event.clientX - rect.left, 220, 520);
            layout.style.gridTemplateColumns = `${width}px 8px minmax(420px, 1fr)`;
        }

        if (draggingHorizontal && splitterHorizontal && gameView) {
            const rect = right.getBoundingClientRect();
            const height = clamp(event.clientY - rect.top, 180, 420);
            gameView.style.height = `${height}px`;
        }
    });

    window.addEventListener("pointerup", () => {
        draggingVertical = false;
        draggingHorizontal = false;
    });
}

function setupControls() {
    if (DEV_MODE) {
        const openDebug = document.getElementById("openDebug");
        const closeDebug = document.getElementById("closeDebug");
        if (openDebug && ui.debugOverlay) {
            openDebug.onclick = () => {
                ui.debugOverlay.classList.remove("hidden");
                initializeModelPreviews();
                requestAnimationFrame(() => refreshModelPreviews());
            };
        }
        if (closeDebug && ui.debugOverlay) {
            closeDebug.onclick = () => ui.debugOverlay.classList.add("hidden");
        }
    }
    if (ui.debugControlsToggle) {
        ui.debugControlsToggle.onclick = () => {
            setDebugControlsEnabled(!state.debugControlsEnabled);
        };
    }
    if (ui.freezeTicksToggle) {
        ui.freezeTicksToggle.onclick = () => {
            if (!state.debugControlsEnabled) return;
            state.isLocked = !state.isLocked;
            refreshToggleButtons();
        };
    }
    if (ui.openErrorsBtn && ui.errorDialog) {
        ui.openErrorsBtn.onclick = () => {
            ui.errorDialog.classList.remove("hidden");
            renderErrorList();
        };
    }
    if (ui.closeErrorsBtn && ui.errorDialog) {
        ui.closeErrorsBtn.onclick = () => ui.errorDialog.classList.add("hidden");
    }
    if (ui.copyErrorsBtn) {
        ui.copyErrorsBtn.onclick = async () => {
            const payload = errorLog.map((entry) => {
                return [
                    `[${entry.time}] ${entry.level.toUpperCase()}: ${entry.message}`,
                    entry.details
                ].join("\n");
            }).join("\n\n");
            if (!payload) return;
            try {
                await navigator.clipboard.writeText(payload);
            } catch {
                if (ui.errorDetails) {
                    ui.errorDetails.value = payload;
                    ui.errorDetails.focus();
                    ui.errorDetails.select();
                }
            }
        };
    }
    if (ui.clearErrorsBtn) {
        ui.clearErrorsBtn.onclick = () => {
            errorLog.length = 0;
            if (ui.errorDetails) {
                ui.errorDetails.value = "";
            }
            renderErrorList();
            updateErrorButton();
        };
    }
    setupModelUpload();
    ui.taskAction.onclick = toggleSkillAction;
    document.getElementById("tickBtn").onclick = () => {
        if (!state.debugControlsEnabled) return;
        tickOnce();
    };
    document.getElementById("offlineBtn").onclick = () => {
        if (!state.debugControlsEnabled) return;
        runOffline(10);
    };
    document.getElementById("saveBtn").onclick = () => saveSnapshot(false, false);
    document.getElementById("loadBtn").onclick = () => loadSnapshot(false);
    const resetBtn = document.getElementById("resetDevBtn");
    if (resetBtn && DEV_MODE) {
        resetBtn.onclick = resetDevAccount;
    }
    document.getElementById("toggleSandbox").onclick = () => {
        if (!state.debugControlsEnabled) return;
        state.sandboxEnabled = !state.sandboxEnabled;
        refreshToggleButtons();
    };
    document.getElementById("toggleLock").onclick = () => {
        if (!state.debugControlsEnabled) return;
        state.isLocked = !state.isLocked;
        refreshToggleButtons();
    };

    if (ui.debugSizeToggle && ui.debugOverlay && ui.debugOverlayPanel) {
        ui.debugSizeToggle.onclick = () => {
            const expanded = ui.debugOverlayPanel.classList.toggle("expanded");
            ui.debugOverlay.classList.toggle("expanded", expanded);
            ui.debugSizeToggle.textContent = expanded ? "⤡" : "⤢";
            ui.debugSizeToggle.title = expanded ? "Contract debug panel" : "Expand debug panel";
            requestAnimationFrame(() => refreshModelPreviews());
        };
    }

    if (ui.tickBatchInput) {
        ui.tickBatchInput.addEventListener("input", () => updateTickBatchPreview());
        updateTickBatchPreview();
    }
    if (ui.tickBatchBtn) {
        ui.tickBatchBtn.onclick = () => {
            if (!state.debugControlsEnabled) return;
            const amount = Math.max(1, Math.floor(Number(ui.tickBatchInput?.value || 0)));
            for (let i = 0; i < amount; i += 1) {
                tickOnce({ recordSample: false });
            }
            updateTickBatchPreview();
        };
    }

    ui.zoomSlider.oninput = (event) => {
        applyZoom(event.target.value);
    };

    if (ui.loadModulesBtn) {
        ui.loadModulesBtn.onclick = () => {
            if (!state.debugControlsEnabled) return;
            loadExternalModulesFromInput();
        };
    }
    if (ui.clearModulesBtn) {
        ui.clearModulesBtn.onclick = () => {
            if (!state.debugControlsEnabled) return;
            clearExternalModules();
        };
    }

    if (ui.modelExpandBtn) {
        ui.modelExpandBtn.addEventListener("click", () => {
            const preview = document.querySelector(".model-preview.model-viewport");
            if (!preview) return;
            if (!modelRenderer) {
                modelRenderer = new ModelRenderer();
            }
            if (!modelRenderer) return;
            modelRenderer.openExpandedViewerFromContainer(preview);
        });
    }

    if (ui.openThemeBtn && ui.themeDialog) {
        ui.openThemeBtn.onclick = () => {
            ui.themeDialog.classList.remove("hidden");
            renderThemeList();
        };
    }
    if (ui.closeThemeBtn && ui.themeDialog) {
        ui.closeThemeBtn.onclick = () => ui.themeDialog.classList.add("hidden");
    }
    if (ui.applyThemeJson && ui.themeJson) {
        ui.applyThemeJson.onclick = () => {
            try {
                const payload = JSON.parse(ui.themeJson.value);
                ThemeManager.updateFromJson(payload);
            } catch (error) {
                console.warn("Invalid theme JSON", error);
            }
        };
    }
    if (ui.reloadThemesBtn) {
        ui.reloadThemesBtn.onclick = () => {
            ThemeManager.loadBuiltIns();
            ThemeManager.restore();
        };
    }

    const skillIcon = document.querySelector(".skill-context .skill-icon");
    if (skillIcon) {
        skillIcon.addEventListener("click", (event) => {
            spawnClickPop(event);
            applyActiveSkillClick();
        });
    }
}

function setupModelUpload() {
    const input = ui.modelUploadInput;
    const clearBtn = ui.modelClearBtn;
    const nameLabel = ui.modelUploadName;
    const preview = document.querySelector(".model-preview.model-viewport");
    if (!input || !preview) return;

    const setLabel = (text) => {
        if (nameLabel) {
            nameLabel.textContent = text;
        }
    };

    const setPreviewUrl = (url) => {
        preview.dataset.model = url || "";
        delete preview.dataset.modelReady;
        initializeModelPreviews();
    };

    input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return;
        if (modelUploadUrl) {
            URL.revokeObjectURL(modelUploadUrl);
            modelTypeOverrides.delete(modelUploadUrl);
        }
        modelUploadUrl = URL.createObjectURL(file);
        const ext = file.name?.split(".").pop()?.toLowerCase() ?? "";
        modelTypeOverrides.set(modelUploadUrl, {
            ext,
            type: file.type
        });
        setLabel(file.name);
        setPreviewUrl(modelUploadUrl);
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (modelUploadUrl) {
                URL.revokeObjectURL(modelUploadUrl);
                modelTypeOverrides.delete(modelUploadUrl);
                modelUploadUrl = null;
            }
            if (input) {
                input.value = "";
            }
            setLabel("No file selected.");
            setPreviewUrl("");
        });
    }
}

function refreshToggleButtons() {
    const sandboxBtn = document.getElementById("toggleSandbox");
    const lockBtn = document.getElementById("toggleLock");
    sandboxBtn.textContent = state.sandboxEnabled ? "🧪 Sandbox On" : "🧪 Sandbox Off";
    lockBtn.textContent = state.isLocked ? "🔒 Locked" : "🔓 Unlocked";
    if (ui.debugControlsToggle) {
        ui.debugControlsToggle.textContent = state.debugControlsEnabled ? "Debug Controls: On" : "Debug Controls: Off";
    }
    if (ui.freezeTicksToggle) {
        ui.freezeTicksToggle.textContent = state.isLocked ? "Freeze Ticks: On" : "Freeze Ticks: Off";
        ui.freezeTicksToggle.disabled = !state.debugControlsEnabled;
    }
    if (sandboxBtn) {
        sandboxBtn.disabled = !state.debugControlsEnabled;
    }
    if (lockBtn) {
        lockBtn.disabled = !state.debugControlsEnabled;
    }
    if (ui.tickBtn) {
        ui.tickBtn.disabled = !state.debugControlsEnabled;
    }
    if (ui.offlineBtn) {
        ui.offlineBtn.disabled = !state.debugControlsEnabled;
    }
    if (ui.saveBtn) {
        ui.saveBtn.disabled = !state.debugControlsEnabled;
    }
    if (ui.loadBtn) {
        ui.loadBtn.disabled = !state.debugControlsEnabled;
    }
    if (ui.tickBatchInput) {
        ui.tickBatchInput.disabled = !state.debugControlsEnabled;
    }
    if (ui.tickBatchBtn) {
        ui.tickBatchBtn.disabled = !state.debugControlsEnabled;
    }
    if (ui.externalModuleInput) {
        ui.externalModuleInput.disabled = !state.debugControlsEnabled;
    }
    if (ui.loadModulesBtn) {
        ui.loadModulesBtn.disabled = !state.debugControlsEnabled;
    }
    if (ui.clearModulesBtn) {
        ui.clearModulesBtn.disabled = !state.debugControlsEnabled;
    }
}

async function setupPixi() {
    if (!isModuleEnabled("renderer")) {
        return;
    }
    if (!window.PIXI) {
        console.warn("PIXI not loaded - skipping renderer init.");
        return;
    }

    const canvas = document.getElementById("pixiCanvas");
    if (!canvas) {
        return;
    }

    try {
        const app = new PIXI.Application();
        await app.init({
            backgroundColor: 0x0c111b,
            resizeTo: canvas.parentElement ?? window,
            antialias: true,
            canvas
        });

        const bg = new PIXI.Graphics();
        bg.beginFill(0x111827);
        bg.drawRoundedRect(0, 0, 600, 280, 16);
        bg.endFill();
        app.stage.addChild(bg);

        const player = new PIXI.Graphics();
        player.beginFill(0x60a5fa);
        player.drawCircle(0, 0, 14);
        player.endFill();
        player.x = 80;
        player.y = 120;
        app.stage.addChild(player);

        const tree = new PIXI.Graphics();
        tree.beginFill(0x22c55e);
        tree.drawRoundedRect(-10, -40, 20, 40, 6);
        tree.endFill();
        tree.x = 250;
        tree.y = 140;
        app.stage.addChild(tree);

        app.ticker.add(() => {
            player.x = 80 + Math.sin(performance.now() / 600) * 20;
            player.y = 120 + Math.cos(performance.now() / 700) * 10;
        });
    } catch (error) {
        console.error("PIXI init failed", error);
    }
}

function setupPwa() {
    if ("serviceWorker" in navigator) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.unregister()));
            return;
        }
        navigator.serviceWorker.register("service-worker.js");
    }
}

async function main() {
    setupErrorLogging();
    restoreModuleState();
    loadPinnedProperties();
    if (DEV_MODE && localStorage.getItem(STORAGE_KEY)) {
        loadSnapshot(true);
    }
    applyModelViewerSettings();
    ensureSelectedSkill();
    ThemeManager.loadBuiltIns();
    ThemeManager.restore();
    applyDevModeUI();
    updateErrorButton();

    if (ui.debugOnline) {
        ui.debugOnline.textContent = "Online";
    }
    if (ui.debugOffline) {
        ui.debugOffline.textContent = `Last offline: ${lastOfflineSeconds}s`;
    }
    if (ui.debugUiUpdates) {
        ui.debugUiUpdates.textContent = "UI updates/frame: --";
    }
    applyZoom(state.zoom);
    applyTickRate(state.tickRate);
    renderSkills();
    updateLists();
    updateInspectors();
    renderPinnedProperties();
    setupRuntimeGraph();
    updateDebugTelemetry();
    refreshToggleButtons();
    renderSkillContext();
    setupTabs();
    setupSplitters();
    setupControls();
    setDebugControlsEnabled(state.debugControlsEnabled);
    await setupPixi();
    setupPwa();
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            saveSnapshot(true, true);
        }
    });
    window.addEventListener("beforeunload", () => saveSnapshot(true, true));
    document.addEventListener("click", () => {
        if (popoverPinned) {
            popoverPinned = false;
            hideInventoryPopover();
        }
    });
    lastTick = performance.now();
    requestAnimationFrame(animate);
    refreshTickLoop();
}

main().catch((error) => {
    console.error("Web demo failed to start", error);
});
