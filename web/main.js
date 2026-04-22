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
  var TRANSFORMERS_JS_CDN_CANDIDATES = [
    "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1",
    "https://esm.sh/@huggingface/transformers@3.8.1"
  ];
  var LOCAL_WHISPER_MODEL = "Xenova/whisper-tiny";
  var LOCAL_WHISPER_SAMPLE_RATE = 16e3;
  var LOCAL_CHUNK_DURATION_MS_DEFAULT = 3500;
  var LOCAL_CHUNK_DURATION_MS_SAFARI = 6e3;
  var LOCAL_RECORDER_MIME_TYPES = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/mpeg"
  ];
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
    mediaRecorder: null,
    mediaStream: null,
    audioDecodeContext: null,
    localTranscriber: null,
    localTranscriberPromise: null,
    recorderMimeType: "",
    transcribeQueue: Promise.resolve(),
    transcribeInFlight: false,
    pendingChunkBlob: null,
    localChunkErrorStreak: 0,
    shouldRun: false,
    isListening: false,
    activeEngine: "none",
    runningEngine: "none",
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
  function getAudioContextConstructor() {
    return window.AudioContext || window.webkitAudioContext || null;
  }
  function hasBrowserRecognitionSupport() {
    return !!getSpeechRecognitionConstructor();
  }
  function hasLocalTranscriptionSupport() {
    return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function" && typeof window.MediaRecorder === "function" && !!getAudioContextConstructor());
  }
  function resolvePreferredEngine() {
    const hasBrowser = hasBrowserRecognitionSupport();
    const hasLocal = hasLocalTranscriptionSupport();
    if (state.browserLabel === "Safari") {
      if (hasBrowser) {
        return "browser";
      }
      if (hasLocal) {
        return "local";
      }
      return "none";
    }
    if (hasBrowser) {
      return "browser";
    }
    if (hasLocal) {
      return "local";
    }
    return "none";
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
    if (state.activeEngine === "local") {
      if (state.browserLabel === "Safari") {
        return "Safari \u306F\u30ED\u30FC\u30AB\u30EB\u8A8D\u8B58\u30E2\u30FC\u30C9\u3067\u52D5\u4F5C\u3057\u307E\u3059\u3002";
      }
      return "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306F\u30ED\u30FC\u30AB\u30EB\u8A8D\u8B58\u30E2\u30FC\u30C9\u3067\u52D5\u4F5C\u3057\u307E\u3059\u3002";
    }
    if (state.activeEngine === "none") {
      return "\u97F3\u58F0\u8A8D\u8B58\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002Chrome / Edge / Safari (\u6700\u65B0\u7248) \u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002";
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
    const sentences = (normalized.match(/[^。！？.!?]+[。！？.!?]?/g) || []).map((part) => part.trim()).filter(Boolean);
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
      startTranscription();
    }, delayMs);
  }
  function stopRecognition(options = {}) {
    const restart = !!options.restart;
    state.restartOnEnd = restart;
    clearRestartTimer();
    if (Object.prototype.hasOwnProperty.call(options, "message")) {
      updateMessage(options.message || "");
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
  function stopMediaStream() {
    if (!state.mediaStream) {
      return;
    }
    state.mediaStream.getTracks().forEach((track) => track.stop());
    state.mediaStream = null;
  }
  function resetLocalRecorderState() {
    state.mediaRecorder = null;
    state.recorderMimeType = "";
    state.pendingChunkBlob = null;
    state.transcribeInFlight = false;
    state.localChunkErrorStreak = 0;
    stopMediaStream();
    if (state.runningEngine === "local") {
      state.runningEngine = "none";
    }
  }
  function stopLocalTranscription(options = {}) {
    const restart = !!options.restart;
    state.restartOnEnd = restart;
    clearRestartTimer();
    if (Object.prototype.hasOwnProperty.call(options, "message")) {
      updateMessage(options.message || "");
    }
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      try {
        state.mediaRecorder.requestData();
      } catch (error) {
        log("media recorder requestData failed: " + error);
      }
      try {
        state.mediaRecorder.stop();
      } catch (error) {
        log("media recorder stop failed: " + error);
        resetLocalRecorderState();
        state.isListening = false;
        updateMetrics();
        if (restart) {
          scheduleRecognitionStart(200);
        }
      }
      return;
    }
    resetLocalRecorderState();
    state.isListening = false;
    updateMetrics();
    if (restart) {
      scheduleRecognitionStart(200);
    }
  }
  function stopActiveTranscription(options = {}) {
    if (state.runningEngine === "local" || state.mediaRecorder) {
      stopLocalTranscription(options);
      return;
    }
    stopRecognition(options);
  }
  function pickRecorderMimeType() {
    if (!window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== "function") {
      return "";
    }
    const supported = LOCAL_RECORDER_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
    return supported || "";
  }
  function getLocalChunkDurationMs() {
    if (state.browserLabel === "Safari") {
      return LOCAL_CHUNK_DURATION_MS_SAFARI;
    }
    return LOCAL_CHUNK_DURATION_MS_DEFAULT;
  }
  function getOrCreateAudioDecodeContext() {
    if (state.audioDecodeContext) {
      return state.audioDecodeContext;
    }
    const AudioContextConstructor = getAudioContextConstructor();
    if (!AudioContextConstructor) {
      return null;
    }
    state.audioDecodeContext = new AudioContextConstructor();
    return state.audioDecodeContext;
  }
  function decodeAudioDataCompat(context, arrayBuffer) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const onSuccess = (buffer) => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(buffer);
      };
      const onError = (error) => {
        if (settled) {
          return;
        }
        settled = true;
        reject(error);
      };
      try {
        const maybePromise = context.decodeAudioData(arrayBuffer, onSuccess, onError);
        if (maybePromise && typeof maybePromise.then === "function") {
          maybePromise.then(onSuccess).catch(onError);
        }
      } catch (error) {
        onError(error);
      }
    });
  }
  function downmixToMono(audioBuffer) {
    if (audioBuffer.numberOfChannels <= 1) {
      return new Float32Array(audioBuffer.getChannelData(0));
    }
    const mono = new Float32Array(audioBuffer.length);
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
      const data = audioBuffer.getChannelData(channel);
      for (let i = 0; i < data.length; i += 1) {
        mono[i] += data[i];
      }
    }
    const scale = 1 / audioBuffer.numberOfChannels;
    for (let i = 0; i < mono.length; i += 1) {
      mono[i] *= scale;
    }
    return mono;
  }
  function resampleLinear(input, inputRate, outputRate) {
    if (!input.length || inputRate === outputRate) {
      return input;
    }
    const ratio = inputRate / outputRate;
    const outputLength = Math.max(1, Math.round(input.length / ratio));
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i += 1) {
      const position = i * ratio;
      const left = Math.floor(position);
      const right = Math.min(left + 1, input.length - 1);
      const blend = position - left;
      output[i] = input[left] + (input[right] - input[left]) * blend;
    }
    return output;
  }
  async function convertBlobToWhisperInput(blob) {
    const context = getOrCreateAudioDecodeContext();
    if (!context) {
      throw new Error("AudioContext \u304C\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002");
    }
    const arrayBuffer = await blob.arrayBuffer();
    const decoded = await decodeAudioDataCompat(context, arrayBuffer.slice(0));
    const mono = downmixToMono(decoded);
    return resampleLinear(mono, decoded.sampleRate, LOCAL_WHISPER_SAMPLE_RATE);
  }
  async function ensureLocalTranscriber() {
    if (state.localTranscriber) {
      return state.localTranscriber;
    }
    if (!state.localTranscriberPromise) {
      state.localTranscriberPromise = (async () => {
        updateMessage("\u30ED\u30FC\u30AB\u30EB\u97F3\u58F0\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u3044\u307E\u3059\uFF08\u521D\u56DE\u306F\u6642\u9593\u304C\u304B\u304B\u308A\u307E\u3059\uFF09\u3002");
        let dynamicImport = null;
        try {
          dynamicImport = new Function("source", "return import(source);");
        } catch (error) {
          throw new Error("\u3053\u306E Safari \u306F\u30ED\u30FC\u30AB\u30EB\u97F3\u58F0\u30E2\u30C7\u30EB\u306E\u8AAD\u307F\u8FBC\u307F\u65B9\u5F0F\u306B\u672A\u5BFE\u5FDC\u3067\u3059\u3002Safari \u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
        }
        let moduleRef = null;
        let lastError = null;
        for (const source of TRANSFORMERS_JS_CDN_CANDIDATES) {
          try {
            moduleRef = await dynamicImport(source);
            break;
          } catch (error) {
            lastError = error;
          }
        }
        if (!moduleRef) {
          const importError = new Error("\u30ED\u30FC\u30AB\u30EB\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002Safari \u3092\u6700\u65B0\u306B\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
          importError.cause = lastError;
          throw importError;
        }
        const { env, pipeline } = moduleRef;
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        let transcriber = null;
        let transcriberError = null;
        const dtypes = ["q4", "q8"];
        for (const dtype of dtypes) {
          try {
            transcriber = await pipeline("automatic-speech-recognition", LOCAL_WHISPER_MODEL, { dtype });
            break;
          } catch (error) {
            transcriberError = error;
          }
        }
        if (!transcriber) {
          const initError = new Error("\u30ED\u30FC\u30AB\u30EB\u97F3\u58F0\u30E2\u30C7\u30EB\u306E\u521D\u671F\u5316\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");
          initError.cause = transcriberError;
          throw initError;
        }
        state.localTranscriber = transcriber;
        return transcriber;
      })().finally(() => {
        state.localTranscriberPromise = null;
      });
    }
    return state.localTranscriberPromise;
  }
  function extractTranscribeText(output) {
    if (typeof output === "string") {
      return output;
    }
    if (output && typeof output.text === "string") {
      return output.text;
    }
    return "";
  }
  async function transcribeAudioChunk(blob) {
    const transcriber = await ensureLocalTranscriber();
    const audioData = await convertBlobToWhisperInput(blob);
    const output = await transcriber(audioData);
    const finalized = finalizeTranscript(extractTranscribeText(output));
    if (!finalized) {
      return;
    }
    state.lastFinalText = finalized;
    state.interimText = "";
    appendLogEntry(finalized);
    renderCaption();
    scheduleAutoClear();
  }
  function shouldTreatChunkErrorAsFatal(errorMessage, errorStreak) {
    if (errorStreak >= 3) {
      return true;
    }
    const normalized = String(errorMessage || "").toLowerCase();
    return normalized.includes("out of memory") || normalized.includes("insufficient memory") || normalized.includes("webassembly");
  }
  function stopFromLocalChunkError(error) {
    const errorMessage = error && error.message ? error.message : "";
    state.shouldRun = false;
    state.restartOnEnd = false;
    setStatus("\u30A8\u30E9\u30FC", "error");
    updateMessage(errorMessage || "\u30ED\u30FC\u30AB\u30EB\u6587\u5B57\u8D77\u3053\u3057\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");
    stopLocalTranscription({ restart: false });
    updateActionState();
  }
  function processLocalChunk(blob) {
    state.transcribeInFlight = true;
    state.transcribeQueue = transcribeAudioChunk(blob).then(() => {
      state.localChunkErrorStreak = 0;
    }).catch((error) => {
      log("transcribe chunk failed: " + error);
      state.localChunkErrorStreak += 1;
      const errorMessage = error && error.message ? error.message : "";
      if (shouldTreatChunkErrorAsFatal(errorMessage, state.localChunkErrorStreak)) {
        stopFromLocalChunkError(error);
        return;
      }
      if (state.shouldRun) {
        updateMessage("\u4E00\u90E8\u306E\u97F3\u58F0\u30C1\u30E3\u30F3\u30AF\u3092\u51E6\u7406\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u7D99\u7D9A\u3057\u3066\u3044\u307E\u3059...");
      }
    }).finally(() => {
      if (!state.shouldRun) {
        state.pendingChunkBlob = null;
        state.transcribeInFlight = false;
        return;
      }
      if (state.pendingChunkBlob) {
        const pendingBlob = state.pendingChunkBlob;
        state.pendingChunkBlob = null;
        processLocalChunk(pendingBlob);
        return;
      }
      state.transcribeInFlight = false;
    });
  }
  function queueTranscriptionChunk(blob) {
    if (!blob || blob.size === 0) {
      return;
    }
    if (state.transcribeInFlight) {
      state.pendingChunkBlob = blob;
      return;
    }
    processLocalChunk(blob);
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
      if (state.runningEngine === "browser") {
        state.runningEngine = "none";
      }
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
    state.runningEngine = "browser";
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
      if (state.runningEngine === "browser") {
        state.runningEngine = "none";
      }
      setStatus("\u30A8\u30E9\u30FC", "error");
      updateMessage("\u958B\u59CB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
      if (state.shouldRun) {
        scheduleRecognitionStart(800);
      }
    }
  }
  async function startLocalTranscription() {
    if (!hasLocalTranscriptionSupport()) {
      setStatus("\u672A\u5BFE\u5FDC", "error");
      updateMessage(defaultHelpMessage());
      updateActionState();
      return;
    }
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      return;
    }
    if (!state.sessionStartedAt) {
      state.sessionStartedAt = /* @__PURE__ */ new Date();
    }
    state.sessionEndedAt = null;
    setStatus("\u6E96\u5099\u4E2D", "warn");
    updateMessage("\u30DE\u30A4\u30AF\u3078\u306E\u30A2\u30AF\u30BB\u30B9\u3092\u8A31\u53EF\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
    updateActionState();
    ensureLocalTranscriber().catch((error) => {
      log("local model load failed: " + error);
      if (!state.shouldRun || state.runningEngine !== "local") {
        return;
      }
      state.shouldRun = false;
      state.restartOnEnd = false;
      setStatus("\u30A8\u30E9\u30FC", "error");
      updateMessage(error.message || "\u30ED\u30FC\u30AB\u30EB\u97F3\u58F0\u30E2\u30C7\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
      stopLocalTranscription({ restart: false });
      updateActionState();
    });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      if (!state.shouldRun) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const mimeType = pickRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      state.mediaStream = stream;
      state.mediaRecorder = recorder;
      state.recorderMimeType = recorder.mimeType || mimeType || "";
      state.runningEngine = "local";
      state.transcribeQueue = Promise.resolve();
      state.transcribeInFlight = false;
      state.pendingChunkBlob = null;
      state.localChunkErrorStreak = 0;
      recorder.onstart = () => {
        state.isListening = true;
        setStatus("\u8A8D\u8B58\u4E2D", "active");
        if (state.localTranscriber) {
          updateMessage("");
        } else {
          updateMessage("\u30ED\u30FC\u30AB\u30EB\u97F3\u58F0\u30E2\u30C7\u30EB\u3092\u6E96\u5099\u4E2D\u3067\u3059\uFF08\u521D\u56DE\u306F\u6642\u9593\u304C\u304B\u304B\u308A\u307E\u3059\uFF09\u3002");
        }
        updateMetrics();
      };
      recorder.onerror = (event) => {
        const errorName = event && event.error && event.error.name ? event.error.name : "unknown";
        log("media recorder error: " + errorName);
        state.isListening = false;
        updateMetrics();
        if (state.shouldRun) {
          setStatus("\u518D\u63A5\u7D9A", "warn");
          updateMessage("\u518D\u63A5\u7D9A\u3057\u3066\u3044\u307E\u3059...");
          stopLocalTranscription({ restart: true, message: "\u518D\u63A5\u7D9A\u3057\u3066\u3044\u307E\u3059..." });
        }
      };
      recorder.ondataavailable = (event) => {
        if (!event.data || event.data.size === 0) {
          return;
        }
        queueTranscriptionChunk(event.data);
      };
      recorder.onstop = () => {
        const pending = state.transcribeQueue;
        resetLocalRecorderState();
        state.isListening = false;
        updateMetrics();
        pending.finally(() => {
          if (state.shouldRun) {
            setStatus("\u5F85\u6A5F\u4E2D", "ready");
            scheduleRecognitionStart(state.restartOnEnd ? 120 : 260);
          } else {
            setStatus("\u5F85\u6A5F\u4E2D", "ready");
            updateMessage(defaultHelpMessage());
          }
          state.restartOnEnd = false;
          updateActionState();
        });
      };
      recorder.start(getLocalChunkDurationMs());
    } catch (error) {
      log("local transcription start failed: " + error);
      resetLocalRecorderState();
      state.isListening = false;
      updateMetrics();
      const isPermissionError = error && (error.name === "NotAllowedError" || error.name === "SecurityError");
      if (isPermissionError) {
        state.shouldRun = false;
        state.restartOnEnd = false;
        setStatus("\u30DE\u30A4\u30AF\u4E0D\u53EF", "error");
        updateMessage("\u30DE\u30A4\u30AF\u3078\u306E\u30A2\u30AF\u30BB\u30B9\u304C\u30D6\u30ED\u30C3\u30AF\u3055\u308C\u3066\u3044\u307E\u3059\u3002");
        updateActionState();
        return;
      }
      setStatus("\u30A8\u30E9\u30FC", "error");
      updateMessage("\u958B\u59CB\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
      if (state.shouldRun) {
        scheduleRecognitionStart(800);
      }
    }
  }
  function startTranscription() {
    state.activeEngine = resolvePreferredEngine();
    if (state.activeEngine === "browser") {
      startRecognition();
      return;
    }
    if (state.activeEngine === "local") {
      startLocalTranscription();
      return;
    }
    state.shouldRun = false;
    setStatus("\u672A\u5BFE\u5FDC", "error");
    updateMessage(defaultHelpMessage());
    updateActionState();
  }
  function toggleRecognition() {
    if (state.shouldRun) {
      state.shouldRun = false;
      state.sessionEndedAt = /* @__PURE__ */ new Date();
      stopActiveTranscription({ restart: false, message: "" });
      updateActionState();
      return;
    }
    state.browserLabel = detectBrowser();
    state.activeEngine = resolvePreferredEngine();
    updateMetrics();
    state.shouldRun = true;
    if (state.activeEngine === "none") {
      state.shouldRun = false;
      setStatus("\u672A\u5BFE\u5FDC", "error");
      updateMessage(defaultHelpMessage());
      updateActionState();
      return;
    }
    startTranscription();
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
      stopActiveTranscription({ restart: true, message: "\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u3066\u3044\u307E\u3059..." });
    } else {
      updateMessage(defaultHelpMessage());
    }
  }
  function handleDialectChange() {
    state.config.dialect = elements.selectDialect.value;
    saveConfig();
    updateMetrics();
    if (state.shouldRun) {
      stopActiveTranscription({ restart: true, message: "\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u3066\u3044\u307E\u3059..." });
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
    state.activeEngine = resolvePreferredEngine();
    updateMetrics();
    if (state.shouldRun) {
      updateActionState();
      return;
    }
    if (state.activeEngine === "none") {
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
      if (event.key !== "Enter" || !state.shouldRun || state.runningEngine === "none") {
        return;
      }
      event.preventDefault();
      stopActiveTranscription({ restart: true, message: "" });
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
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      try {
        state.mediaRecorder.stop();
      } catch (error) {
        log("media recorder stop on unload failed: " + error);
      }
    }
    stopMediaStream();
    if (state.audioDecodeContext && typeof state.audioDecodeContext.close === "function") {
      state.audioDecodeContext.close().catch(() => {
      });
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
