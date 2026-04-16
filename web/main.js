(() => {
  // node_modules/@vercel/analytics/dist/index.mjs
  var initQueue = () => {
    if (window.va) return;
    window.va = function a(...params) {
      if (!window.vaq) window.vaq = [];
      window.vaq.push(params);
    };
  };
  var name = "@vercel/analytics";
  var version = "2.0.1";
  function isBrowser() {
    return typeof window !== "undefined";
  }
  function detectEnvironment() {
    try {
      const env = "development";
      if (env === "development" || env === "test") {
        return "development";
      }
    } catch {
    }
    return "production";
  }
  function setMode(mode = "auto") {
    if (mode === "auto") {
      window.vam = detectEnvironment();
      return;
    }
    window.vam = mode;
  }
  function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
  }
  function isDevelopment() {
    return getMode() === "development";
  }
  function getScriptSrc(props) {
    if (props.scriptSrc) {
      return makeAbsolute(props.scriptSrc);
    }
    if (isDevelopment()) {
      return "https://va.vercel-scripts.com/v1/script.debug.js";
    }
    if (props.basePath) {
      return makeAbsolute(`${props.basePath}/insights/script.js`);
    }
    return "/_vercel/insights/script.js";
  }
  function loadProps(explicitProps, confString) {
    var _a;
    let props = explicitProps;
    if (confString) {
      try {
        props = {
          ...(_a = JSON.parse(confString)) == null ? void 0 : _a.analytics,
          ...explicitProps
        };
      } catch {
      }
    }
    setMode(props.mode);
    const dataset = {
      sdkn: name + (props.framework ? `/${props.framework}` : ""),
      sdkv: version
    };
    if (props.disableAutoTrack) {
      dataset.disableAutoTrack = "1";
    }
    if (props.viewEndpoint) {
      dataset.viewEndpoint = makeAbsolute(props.viewEndpoint);
    }
    if (props.eventEndpoint) {
      dataset.eventEndpoint = makeAbsolute(props.eventEndpoint);
    }
    if (props.sessionEndpoint) {
      dataset.sessionEndpoint = makeAbsolute(props.sessionEndpoint);
    }
    if (isDevelopment() && props.debug === false) {
      dataset.debug = "false";
    }
    if (props.dsn) {
      dataset.dsn = props.dsn;
    }
    if (props.endpoint) {
      dataset.endpoint = props.endpoint;
    } else if (props.basePath) {
      dataset.endpoint = makeAbsolute(`${props.basePath}/insights`);
    }
    return {
      beforeSend: props.beforeSend,
      src: getScriptSrc(props),
      dataset
    };
  }
  function makeAbsolute(url) {
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") ? url : `/${url}`;
  }
  function inject(props = {
    debug: true
  }, confString) {
    var _a;
    if (!isBrowser()) return;
    const { beforeSend, src, dataset } = loadProps(props, confString);
    initQueue();
    if (beforeSend) {
      (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", beforeSend);
    }
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    for (const [key, value] of Object.entries(dataset)) {
      script.dataset[key] = value;
    }
    script.defer = true;
    script.onerror = () => {
      const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
      console.log(
        `[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`
      );
    };
    document.head.appendChild(script);
  }

  // web/app.js
  var SETTINGS_KEY = "speech_to_text_overlay_settings";
  var SETTINGS_VERSION = 2;
  var PLACEHOLDER_TEXT = "\u958B\u59CB\u3059\u308B\u3068\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002";
  var WINDOWED_CAPTION_CHAR_LIMIT = 90;
  var LANGUAGE_GROUPS = [
    {
      label: "\u65E5\u672C\u8A9E",
      dialects: [{ value: "ja-JP", label: "\u65E5\u672C" }]
    },
    {
      label: "\u82F1\u8A9E",
      dialects: [
        { value: "en-US", label: "\u30A2\u30E1\u30EA\u30AB\u5408\u8846\u56FD" },
        { value: "en-GB", label: "\u30A4\u30AE\u30EA\u30B9" },
        { value: "en-AU", label: "\u30AA\u30FC\u30B9\u30C8\u30E9\u30EA\u30A2" },
        { value: "en-CA", label: "\u30AB\u30CA\u30C0" },
        { value: "en-IN", label: "\u30A4\u30F3\u30C9" }
      ]
    },
    {
      label: "\u4E2D\u56FD\u8A9E",
      dialects: [
        { value: "cmn-Hans-CN", label: "\u6A19\u6E96\u4E2D\u56FD\u8A9E\uFF08\u4E2D\u56FD\u672C\u571F\uFF09" },
        { value: "cmn-Hant-TW", label: "\u6A19\u6E96\u4E2D\u56FD\u8A9E\uFF08\u53F0\u6E7E\uFF09" },
        { value: "yue-Hant-HK", label: "\u5E83\u6771\u8A9E\uFF08\u9999\u6E2F\uFF09" }
      ]
    },
    {
      label: "\u97D3\u56FD\u8A9E",
      dialects: [{ value: "ko-KR", label: "\u97D3\u56FD" }]
    },
    {
      label: "\u30D5\u30E9\u30F3\u30B9\u8A9E",
      dialects: [
        { value: "fr-FR", label: "\u30D5\u30E9\u30F3\u30B9" },
        { value: "fr-CA", label: "\u30AB\u30CA\u30C0" }
      ]
    },
    {
      label: "\u30C9\u30A4\u30C4\u8A9E",
      dialects: [
        { value: "de-DE", label: "\u30C9\u30A4\u30C4" },
        { value: "de-AT", label: "\u30AA\u30FC\u30B9\u30C8\u30EA\u30A2" }
      ]
    },
    {
      label: "\u30B9\u30DA\u30A4\u30F3\u8A9E",
      dialects: [
        { value: "es-ES", label: "\u30B9\u30DA\u30A4\u30F3" },
        { value: "es-MX", label: "\u30E1\u30AD\u30B7\u30B3" },
        { value: "es-US", label: "\u30A2\u30E1\u30EA\u30AB\u5408\u8846\u56FD" }
      ]
    },
    {
      label: "\u30DD\u30EB\u30C8\u30AC\u30EB\u8A9E",
      dialects: [
        { value: "pt-BR", label: "\u30D6\u30E9\u30B8\u30EB" },
        { value: "pt-PT", label: "\u30DD\u30EB\u30C8\u30AC\u30EB" }
      ]
    },
    {
      label: "\u30A4\u30BF\u30EA\u30A2\u8A9E",
      dialects: [{ value: "it-IT", label: "\u30A4\u30BF\u30EA\u30A2" }]
    },
    {
      label: "\u30ED\u30B7\u30A2\u8A9E",
      dialects: [{ value: "ru-RU", label: "\u30ED\u30B7\u30A2" }]
    },
    {
      label: "\u30D2\u30F3\u30C7\u30A3\u30FC\u8A9E",
      dialects: [{ value: "hi-IN", label: "\u30A4\u30F3\u30C9" }]
    }
  ];
  var elements = {
    statusBadge: document.getElementById("status-badge"),
    metricBrowser: document.getElementById("metric-browser"),
    metricLanguage: document.getElementById("metric-language"),
    metricListening: document.getElementById("metric-listening"),
    metricLogCount: document.getElementById("metric-log-count"),
    metricAutoclear: document.getElementById("metric-autoclear"),
    captionStage: document.getElementById("caption-stage"),
    lectureTitle: document.getElementById("lecture-title"),
    resultText: document.getElementById("result-text"),
    sessionMessage: document.getElementById("session-message"),
    toggleRecognition: document.getElementById("toggle-recognition"),
    downloadLog: document.getElementById("download-log"),
    selectLanguage: document.getElementById("select-language"),
    selectDialect: document.getElementById("select-dialect"),
    selectAutoclear: document.getElementById("select-autoclear"),
    sliderFontSize: document.getElementById("slider-font-size"),
    sliderLineHeight: document.getElementById("slider-line-height"),
    valueFontSize: document.getElementById("value-font-size"),
    valueLineHeight: document.getElementById("value-line-height"),
    checkboxTimestamps: document.getElementById("checkbox-timestamps"),
    checkboxShowLog: document.getElementById("checkbox-show-log"),
    logPanel: document.getElementById("log-panel"),
    resultLog: document.getElementById("result-log"),
    output: document.getElementById("output")
  };
  var state = {
    recognition: null,
    shouldRun: false,
    isListening: false,
    browserLabel: "",
    lastFinalText: "",
    interimText: "",
    clearTimerId: 0,
    restartTimerId: 0,
    restartOnEnd: false,
    sessionStartedAt: null,
    sessionEndedAt: null,
    config: loadConfig()
  };
  function log(message) {
    console.log(message);
    if (elements.output) {
      elements.output.value += message + "\n";
      elements.output.scrollTop = elements.output.scrollHeight;
    }
  }
  function getSpeechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }
  function detectBrowser() {
    const userAgent = navigator.userAgent;
    if (/Edg\//.test(userAgent)) {
      return "Microsoft Edge";
    }
    if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) {
      return "Google Chrome";
    }
    if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
      return "Safari";
    }
    if (/Firefox\//.test(userAgent)) {
      return "Firefox";
    }
    return "Unknown browser";
  }
  function loadConfig() {
    const defaults = {
      version: SETTINGS_VERSION,
      languageGroup: 0,
      dialect: "ja-JP",
      autoClearSeconds: 30,
      fontSize: 38,
      lineHeight: 1.45,
      timestamps: false,
      showLog: true
    };
    try {
      const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      if (parsed.version == null && parsed.fontSize === 56) {
        parsed.fontSize = defaults.fontSize;
      }
      return {
        ...defaults,
        ...parsed,
        version: SETTINGS_VERSION
      };
    } catch (error) {
      log("settings load failed: " + error);
      return defaults;
    }
  }
  function saveConfig() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.config));
  }
  function setStatus(text, tone) {
    elements.statusBadge.textContent = text;
    elements.statusBadge.className = "pill " + tone;
  }
  function updateMessage(text) {
    elements.sessionMessage.textContent = text || "";
    elements.sessionMessage.hidden = !text;
  }
  function clearRestartTimer() {
    if (state.restartTimerId) {
      window.clearTimeout(state.restartTimerId);
      state.restartTimerId = 0;
    }
  }
  function clearAutoClearTimer() {
    if (state.clearTimerId) {
      window.clearTimeout(state.clearTimerId);
      state.clearTimerId = 0;
    }
  }
  function getSelectedLanguageGroup() {
    const index = Number(elements.selectLanguage.value);
    return LANGUAGE_GROUPS[index] || LANGUAGE_GROUPS[0];
  }
  function defaultHelpMessage() {
    if (!getSpeechRecognitionConstructor()) {
      return "Chrome \u307E\u305F\u306F Edge \u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002";
    }
    if (state.browserLabel === "Safari") {
      return "Safari \u3067\u306F\u52D5\u4F5C\u304C\u4E0D\u5B89\u5B9A\u306A\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002";
    }
    return "";
  }
  function countLogLines() {
    const value = elements.resultLog.value.trim();
    if (!value) {
      return 0;
    }
    return value.split(/\n+/).filter(Boolean).length;
  }
  function formatAutoClearValue(seconds) {
    if (seconds <= 0) {
      return "\u30AA\u30D5";
    }
    return seconds + " \u79D2";
  }
  function languageCodeFromDialect(dialect) {
    return String(dialect || "ja").split("-")[0];
  }
  function updateMetrics() {
    elements.metricBrowser.textContent = state.browserLabel;
    elements.metricLanguage.textContent = languageCodeFromDialect(state.config.dialect);
    elements.metricListening.textContent = state.isListening ? "\u30AA\u30F3" : "\u30AA\u30D5";
    elements.metricLogCount.textContent = String(countLogLines());
    elements.metricAutoclear.textContent = formatAutoClearValue(state.config.autoClearSeconds);
  }
  function updateActionState() {
    elements.toggleRecognition.textContent = state.shouldRun ? "\u505C\u6B62" : "\u958B\u59CB";
    elements.downloadLog.disabled = !elements.resultLog.value.trim();
  }
  function isCaptionFullscreen() {
    return document.fullscreenElement === elements.captionStage || document.webkitFullscreenElement === elements.captionStage;
  }
  function extractLatestSentence(text) {
    const normalized = (text || "").replace(/\s+/g, " ").trim();
    if (!normalized) {
      return "";
    }
    const sentences = normalized.split(/(?<=[。！？.!?])\s*/).map((part) => part.trim()).filter(Boolean);
    const latest = sentences.length ? sentences[sentences.length - 1] : normalized;
    if (latest.length <= WINDOWED_CAPTION_CHAR_LIMIT) {
      return latest;
    }
    return latest.slice(0, WINDOWED_CAPTION_CHAR_LIMIT).trimEnd() + "\u2026";
  }
  function buildCaptionText() {
    const lastFinal = state.lastFinalText || "";
    const interim = state.interimText || "";
    if (isCaptionFullscreen()) {
      const lines = [];
      if (lastFinal) {
        lines.push(lastFinal);
      }
      if (interim) {
        lines.push(interim);
      }
      return lines.join("\n");
    }
    return extractLatestSentence(interim || lastFinal);
  }
  function renderCaption() {
    const text = buildCaptionText();
    elements.resultText.textContent = text || PLACEHOLDER_TEXT;
  }
  function autosizeLogArea() {
    elements.resultLog.style.height = "10px";
    const scrollHeight = Math.max(elements.resultLog.scrollHeight, 140);
    elements.resultLog.style.height = scrollHeight + "px";
  }
  function renderLogVisibility() {
    elements.logPanel.hidden = !state.config.showLog;
  }
  function applyCaptionStyle() {
    elements.resultText.style.fontSize = state.config.fontSize + "px";
    elements.resultText.style.lineHeight = String(state.config.lineHeight);
    elements.valueFontSize.textContent = state.config.fontSize + " px";
    elements.valueLineHeight.textContent = state.config.lineHeight.toFixed(2);
  }
  function formatTimestamp(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  }
  function getLectureTitle() {
    const value = (elements.lectureTitle.value || "").trim();
    return value || "\u7121\u984C\u306E\u30BB\u30C3\u30B7\u30E7\u30F3";
  }
  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1e3));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }
  function buildExportText() {
    const startedAt = state.sessionStartedAt || /* @__PURE__ */ new Date();
    const endedAt = state.sessionEndedAt || /* @__PURE__ */ new Date();
    const transcript = elements.resultLog.value.split(/\n+/).map((line) => line.trim()).filter(Boolean).join("\n\n");
    return [
      "\u30BF\u30A4\u30C8\u30EB: " + getLectureTitle(),
      "\u958B\u59CB: " + startedAt.toLocaleString(),
      "\u7D42\u4E86: " + endedAt.toLocaleString(),
      "\u6240\u8981\u6642\u9593: " + formatDuration(endedAt.getTime() - startedAt.getTime()),
      "",
      transcript,
      ""
    ].join("\n");
  }
  function buildDownloadFilename() {
    const now = state.sessionEndedAt || /* @__PURE__ */ new Date();
    const safeTitle = getLectureTitle().normalize("NFKC").replace(/[\\/:*?"<>|]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "\u6587\u5B57\u8D77\u3053\u3057";
    const timestamp = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") + "_" + String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0") + String(now.getSeconds()).padStart(2, "0");
    return safeTitle + "_" + timestamp + ".txt";
  }
  function finalizeTranscript(text) {
    const collapsed = (text || "").replace(/\s+/g, " ").trim();
    if (!collapsed) {
      return "";
    }
    if (state.config.dialect === "ja-JP" && !/[。！？!?]$/.test(collapsed)) {
      return collapsed + "\u3002";
    }
    return collapsed;
  }
  function appendLogEntry(text) {
    const line = state.config.timestamps ? formatTimestamp(/* @__PURE__ */ new Date()) + "	" + text : text;
    elements.resultLog.value = elements.resultLog.value.trim() ? elements.resultLog.value.trimEnd() + "\n" + line : line;
    autosizeLogArea();
    updateActionState();
    updateMetrics();
  }
  function scheduleAutoClear() {
    clearAutoClearTimer();
    if (state.config.autoClearSeconds <= 0) {
      return;
    }
    state.clearTimerId = window.setTimeout(() => {
      state.lastFinalText = "";
      state.interimText = "";
      state.clearTimerId = 0;
      renderCaption();
    }, state.config.autoClearSeconds * 1e3);
  }
  function scheduleRecognitionStart(delayMs) {
    clearRestartTimer();
    if (!state.shouldRun) {
      return;
    }
    state.restartTimerId = window.setTimeout(() => {
      state.restartTimerId = 0;
      startRecognition();
    }, delayMs);
  }
  function stopRecognition(options = {}) {
    const restart = !!options.restart;
    state.restartOnEnd = restart;
    clearRestartTimer();
    if (options.message) {
      updateMessage(options.message);
    }
    if (state.recognition) {
      try {
        state.recognition.stop();
      } catch (error) {
        log("recognition stop failed: " + error);
        state.recognition = null;
        if (restart) {
          scheduleRecognitionStart(200);
        }
      }
    } else if (restart) {
      scheduleRecognitionStart(200);
    }
  }
  function bindRecognitionHandlers(recognition) {
    recognition.lang = state.config.dialect;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.onsoundstart = () => {
      state.isListening = true;
      setStatus("\u8A8D\u8B58\u4E2D", "active");
      updateMessage("");
      updateMetrics();
    };
    recognition.onsoundend = () => {
      state.isListening = false;
      setStatus("\u5F85\u6A5F\u4E2D", "warn");
      updateMessage("");
      updateMetrics();
    };
    recognition.onnomatch = () => {
      setStatus("\u97F3\u58F0\u306A\u3057", "warn");
      updateMessage("\u97F3\u58F0\u3092\u8A8D\u8B58\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
    };
    recognition.onerror = (event) => {
      const errorCode = event && event.error ? event.error : "unknown";
      log("recognition error: " + errorCode);
      state.isListening = false;
      updateMetrics();
      if (!state.shouldRun && errorCode === "aborted") {
        return;
      }
      if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
        state.shouldRun = false;
        state.restartOnEnd = false;
        setStatus("\u30DE\u30A4\u30AF\u4E0D\u53EF", "error");
        updateMessage("\u30DE\u30A4\u30AF\u3078\u306E\u30A2\u30AF\u30BB\u30B9\u304C\u30D6\u30ED\u30C3\u30AF\u3055\u308C\u3066\u3044\u307E\u3059\u3002");
        updateActionState();
        return;
      }
      setStatus("\u518D\u63A5\u7D9A", "warn");
      updateMessage("\u518D\u63A5\u7D9A\u3057\u3066\u3044\u307E\u3059...");
      if (state.shouldRun) {
        scheduleRecognitionStart(500);
      }
    };
    recognition.onresult = (event) => {
      let interimBuffer = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = (result[0] && result[0].transcript || "").trim();
        if (!transcript) {
          continue;
        }
        if (result.isFinal) {
          const finalized = finalizeTranscript(transcript);
          if (!finalized) {
            continue;
          }
          state.lastFinalText = finalized;
          state.interimText = "";
          appendLogEntry(finalized);
        } else {
          interimBuffer = (interimBuffer + " " + transcript).trim();
        }
      }
      state.interimText = interimBuffer;
      renderCaption();
      scheduleAutoClear();
    };
    recognition.onend = () => {
      state.recognition = null;
      state.isListening = false;
      updateMetrics();
      if (state.shouldRun) {
        setStatus("\u5F85\u6A5F\u4E2D", "ready");
        scheduleRecognitionStart(state.restartOnEnd ? 120 : 260);
      } else {
        setStatus("\u5F85\u6A5F\u4E2D", "ready");
        updateMessage(defaultHelpMessage());
      }
      state.restartOnEnd = false;
      updateActionState();
    };
  }
  function startRecognition() {
    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionConstructor) {
      setStatus("\u672A\u5BFE\u5FDC", "error");
      updateMessage(defaultHelpMessage());
      updateActionState();
      return;
    }
    if (state.recognition) {
      return;
    }
    const recognition = new SpeechRecognitionConstructor();
    state.recognition = recognition;
    bindRecognitionHandlers(recognition);
    if (!state.sessionStartedAt) {
      state.sessionStartedAt = /* @__PURE__ */ new Date();
    }
    state.sessionEndedAt = null;
    try {
      recognition.start();
      setStatus("\u6E96\u5099\u4E2D", "warn");
      updateMessage("\u30DE\u30A4\u30AF\u3078\u306E\u30A2\u30AF\u30BB\u30B9\u3092\u8A31\u53EF\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      updateActionState();
    } catch (error) {
      log("recognition start failed: " + error);
      state.recognition = null;
      setStatus("\u30A8\u30E9\u30FC", "error");
      updateMessage("\u958B\u59CB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
      if (state.shouldRun) {
        scheduleRecognitionStart(800);
      }
    }
  }
  function toggleRecognition() {
    if (state.shouldRun) {
      state.shouldRun = false;
      state.sessionEndedAt = /* @__PURE__ */ new Date();
      stopRecognition({ restart: false, message: "" });
      updateActionState();
      return;
    }
    state.shouldRun = true;
    refreshSupportState();
    if (!getSpeechRecognitionConstructor()) {
      state.shouldRun = false;
      updateActionState();
      return;
    }
    startRecognition();
    updateActionState();
  }
  function populateLanguageGroups() {
    elements.selectLanguage.innerHTML = "";
    LANGUAGE_GROUPS.forEach((group, index) => {
      elements.selectLanguage.add(new Option(group.label, String(index)));
    });
    const boundedIndex = Math.max(0, Math.min(LANGUAGE_GROUPS.length - 1, Number(state.config.languageGroup) || 0));
    elements.selectLanguage.value = String(boundedIndex);
  }
  function populateDialects(preferredDialect) {
    const group = getSelectedLanguageGroup();
    elements.selectDialect.innerHTML = "";
    group.dialects.forEach((dialect) => {
      elements.selectDialect.add(new Option(dialect.label, dialect.value));
    });
    const hasPreferred = group.dialects.some((dialect) => dialect.value === preferredDialect);
    elements.selectDialect.value = hasPreferred ? preferredDialect : group.dialects[0].value;
    state.config.languageGroup = Number(elements.selectLanguage.value);
    state.config.dialect = elements.selectDialect.value;
    saveConfig();
    updateMetrics();
  }
  function handleLanguageGroupChange() {
    populateDialects(state.config.dialect);
    if (state.shouldRun) {
      stopRecognition({ restart: true, message: "\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u3066\u3044\u307E\u3059..." });
    } else {
      updateMessage(defaultHelpMessage());
    }
  }
  function handleDialectChange() {
    state.config.dialect = elements.selectDialect.value;
    saveConfig();
    updateMetrics();
    if (state.shouldRun) {
      stopRecognition({ restart: true, message: "\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u3066\u3044\u307E\u3059..." });
    }
  }
  function handleAutoClearChange() {
    state.config.autoClearSeconds = Number(elements.selectAutoclear.value) || 0;
    saveConfig();
    updateMetrics();
    scheduleAutoClear();
  }
  function handleFontSizeChange() {
    state.config.fontSize = Number(elements.sliderFontSize.value) || 38;
    saveConfig();
    applyCaptionStyle();
  }
  function handleLineHeightChange() {
    state.config.lineHeight = Number(elements.sliderLineHeight.value) || 1.45;
    saveConfig();
    applyCaptionStyle();
  }
  function handleTimestampToggle() {
    state.config.timestamps = elements.checkboxTimestamps.checked;
    saveConfig();
  }
  function handleShowLogToggle() {
    state.config.showLog = elements.checkboxShowLog.checked;
    saveConfig();
    renderLogVisibility();
  }
  function handleLogInput() {
    autosizeLogArea();
    updateActionState();
    updateMetrics();
  }
  function clearAll() {
    clearAutoClearTimer();
    state.lastFinalText = "";
    state.interimText = "";
    state.sessionStartedAt = null;
    state.sessionEndedAt = null;
    elements.resultLog.value = "";
    renderCaption();
    autosizeLogArea();
    updateMetrics();
    updateActionState();
    updateMessage(state.shouldRun ? "\u8868\u793A\u3092\u30AF\u30EA\u30A2\u3057\u307E\u3057\u305F\u3002" : defaultHelpMessage());
  }
  function downloadLog() {
    const text = elements.resultLog.value.trim();
    if (!text) {
      return;
    }
    const blob = new Blob([buildExportText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildDownloadFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  function resetSettings() {
    localStorage.removeItem(SETTINGS_KEY);
    window.location.reload();
  }
  async function toggleFullscreen() {
    if (document.fullscreenElement === elements.captionStage) {
      await document.exitFullscreen();
      return;
    }
    if (elements.captionStage.requestFullscreen) {
      await elements.captionStage.requestFullscreen();
    }
  }
  function refreshSupportState() {
    state.browserLabel = detectBrowser();
    updateMetrics();
    if (state.shouldRun) {
      updateActionState();
      return;
    }
    if (!getSpeechRecognitionConstructor()) {
      setStatus("\u672A\u5BFE\u5FDC", "error");
      updateMessage(defaultHelpMessage());
    } else {
      setStatus("\u5F85\u6A5F\u4E2D", "ready");
      updateMessage(defaultHelpMessage());
    }
    updateActionState();
  }
  function initializeControls() {
    populateLanguageGroups();
    populateDialects(state.config.dialect);
    elements.selectAutoclear.value = String(state.config.autoClearSeconds);
    elements.sliderFontSize.value = String(state.config.fontSize);
    elements.sliderLineHeight.value = String(state.config.lineHeight);
    elements.checkboxTimestamps.checked = !!state.config.timestamps;
    elements.checkboxShowLog.checked = !!state.config.showLog;
    applyCaptionStyle();
    renderLogVisibility();
    autosizeLogArea();
    updateMetrics();
    updateActionState();
    renderCaption();
  }
  function registerEventHandlers() {
    elements.selectLanguage.addEventListener("change", handleLanguageGroupChange);
    elements.selectDialect.addEventListener("change", handleDialectChange);
    elements.selectAutoclear.addEventListener("change", handleAutoClearChange);
    elements.sliderFontSize.addEventListener("input", handleFontSizeChange);
    elements.sliderLineHeight.addEventListener("input", handleLineHeightChange);
    elements.checkboxTimestamps.addEventListener("input", handleTimestampToggle);
    elements.checkboxShowLog.addEventListener("input", handleShowLogToggle);
    elements.resultLog.addEventListener("input", handleLogInput);
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || !state.shouldRun || !state.recognition) {
        return;
      }
      event.preventDefault();
      stopRecognition({ restart: true, message: "" });
    });
    document.addEventListener("fullscreenchange", renderCaption);
  }
  function initialize() {
    initializeControls();
    registerEventHandlers();
    refreshSupportState();
  }
  window.speechApp = {
    clearAll,
    downloadLog,
    refreshSupportState,
    resetSettings,
    toggleFullscreen,
    toggleRecognition
  };
  window.addEventListener("beforeunload", () => {
    clearAutoClearTimer();
    clearRestartTimer();
    if (state.recognition) {
      try {
        state.recognition.stop();
      } catch (error) {
        log("recognition stop on unload failed: " + error);
      }
    }
  });
  initialize();

  // src/main.js
  var LOCAL_HOSTNAMES = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);
  function isFilePreview() {
    return window.location.protocol === "file:";
  }
  function isLocalHost() {
    return LOCAL_HOSTNAMES.has(window.location.hostname);
  }
  if (!isFilePreview()) {
    inject({
      mode: isLocalHost() ? "development" : "production",
      debug: isLocalHost()
    });
  }
})();
