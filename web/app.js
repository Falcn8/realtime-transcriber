const SETTINGS_KEY = 'speech_to_text_overlay_settings';
const SETTINGS_VERSION = 2;
const PLACEHOLDER_TEXT = '開始するとここに表示されます。';
const WINDOWED_CAPTION_CHAR_LIMIT = 90;
const TRANSFORMERS_JS_CDN_CANDIDATES = [
    'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1',
    'https://esm.sh/@huggingface/transformers@3.8.1',
];
const LOCAL_WHISPER_MODEL = 'Xenova/whisper-tiny';
const LOCAL_WHISPER_SAMPLE_RATE = 16000;
const LOCAL_RECORDER_MIME_TYPES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/mpeg',
];

const LANGUAGE_GROUPS = [
    {
        label: '日本語',
        dialects: [{ value: 'ja-JP', label: '日本' }],
    },
    {
        label: '英語',
        dialects: [
            { value: 'en-US', label: 'アメリカ合衆国' },
            { value: 'en-GB', label: 'イギリス' },
            { value: 'en-AU', label: 'オーストラリア' },
            { value: 'en-CA', label: 'カナダ' },
            { value: 'en-IN', label: 'インド' },
        ],
    },
    {
        label: '中国語',
        dialects: [
            { value: 'cmn-Hans-CN', label: '標準中国語（中国本土）' },
            { value: 'cmn-Hant-TW', label: '標準中国語（台湾）' },
            { value: 'yue-Hant-HK', label: '広東語（香港）' },
        ],
    },
    {
        label: '韓国語',
        dialects: [{ value: 'ko-KR', label: '韓国' }],
    },
    {
        label: 'フランス語',
        dialects: [
            { value: 'fr-FR', label: 'フランス' },
            { value: 'fr-CA', label: 'カナダ' },
        ],
    },
    {
        label: 'ドイツ語',
        dialects: [
            { value: 'de-DE', label: 'ドイツ' },
            { value: 'de-AT', label: 'オーストリア' },
        ],
    },
    {
        label: 'スペイン語',
        dialects: [
            { value: 'es-ES', label: 'スペイン' },
            { value: 'es-MX', label: 'メキシコ' },
            { value: 'es-US', label: 'アメリカ合衆国' },
        ],
    },
    {
        label: 'ポルトガル語',
        dialects: [
            { value: 'pt-BR', label: 'ブラジル' },
            { value: 'pt-PT', label: 'ポルトガル' },
        ],
    },
    {
        label: 'イタリア語',
        dialects: [{ value: 'it-IT', label: 'イタリア' }],
    },
    {
        label: 'ロシア語',
        dialects: [{ value: 'ru-RU', label: 'ロシア' }],
    },
    {
        label: 'ヒンディー語',
        dialects: [{ value: 'hi-IN', label: 'インド' }],
    },
];

const elements = {
    statusBadge: document.getElementById('status-badge'),
    metricBrowser: document.getElementById('metric-browser'),
    metricLanguage: document.getElementById('metric-language'),
    metricListening: document.getElementById('metric-listening'),
    metricLogCount: document.getElementById('metric-log-count'),
    metricAutoclear: document.getElementById('metric-autoclear'),
    captionStage: document.getElementById('caption-stage'),
    lectureTitle: document.getElementById('lecture-title'),
    resultText: document.getElementById('result-text'),
    sessionMessage: document.getElementById('session-message'),
    toggleRecognition: document.getElementById('toggle-recognition'),
    downloadLog: document.getElementById('download-log'),
    selectLanguage: document.getElementById('select-language'),
    selectDialect: document.getElementById('select-dialect'),
    selectAutoclear: document.getElementById('select-autoclear'),
    sliderFontSize: document.getElementById('slider-font-size'),
    sliderLineHeight: document.getElementById('slider-line-height'),
    valueFontSize: document.getElementById('value-font-size'),
    valueLineHeight: document.getElementById('value-line-height'),
    checkboxTimestamps: document.getElementById('checkbox-timestamps'),
    checkboxShowLog: document.getElementById('checkbox-show-log'),
    logPanel: document.getElementById('log-panel'),
    resultLog: document.getElementById('result-log'),
    output: document.getElementById('output'),
};

const state = {
    recognition: null,
    mediaRecorder: null,
    mediaStream: null,
    audioDecodeContext: null,
    localTranscriber: null,
    localTranscriberPromise: null,
    recorderMimeType: '',
    transcribeQueue: Promise.resolve(),
    shouldRun: false,
    isListening: false,
    activeEngine: 'none',
    runningEngine: 'none',
    browserLabel: '',
    lastFinalText: '',
    interimText: '',
    clearTimerId: 0,
    restartTimerId: 0,
    restartOnEnd: false,
    sessionStartedAt: null,
    sessionEndedAt: null,
    config: loadConfig(),
};

function log(message) {
    console.log(message);
    if (elements.output) {
        elements.output.value += message + '\n';
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
    return !!(
        navigator.mediaDevices
        && typeof navigator.mediaDevices.getUserMedia === 'function'
        && typeof window.MediaRecorder === 'function'
        && !!getAudioContextConstructor()
    );
}

function resolvePreferredEngine() {
    const hasBrowser = hasBrowserRecognitionSupport();
    const hasLocal = hasLocalTranscriptionSupport();

    if (state.browserLabel === 'Safari' && hasLocal) {
        return 'local';
    }

    if (hasBrowser) {
        return 'browser';
    }

    if (hasLocal) {
        return 'local';
    }

    return 'none';
}

function detectBrowser() {
    const userAgent = navigator.userAgent;

    if (/Edg\//.test(userAgent)) {
        return 'Microsoft Edge';
    }
    if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) {
        return 'Google Chrome';
    }
    if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
        return 'Safari';
    }
    if (/Firefox\//.test(userAgent)) {
        return 'Firefox';
    }

    return 'Unknown browser';
}

function loadConfig() {
    const defaults = {
        version: SETTINGS_VERSION,
        languageGroup: 0,
        dialect: 'ja-JP',
        autoClearSeconds: 30,
        fontSize: 38,
        lineHeight: 1.45,
        timestamps: false,
        showLog: true,
    };

    try {
        const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        if (parsed.version == null && parsed.fontSize === 56) {
            parsed.fontSize = defaults.fontSize;
        }
        return {
            ...defaults,
            ...parsed,
            version: SETTINGS_VERSION,
        };
    } catch (error) {
        log('settings load failed: ' + error);
        return defaults;
    }
}

function saveConfig() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.config));
}

function setStatus(text, tone) {
    elements.statusBadge.textContent = text;
    elements.statusBadge.className = 'pill ' + tone;
}

function updateMessage(text) {
    elements.sessionMessage.textContent = text || '';
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
    if (state.activeEngine === 'local') {
        if (state.browserLabel === 'Safari') {
            return 'Safari はローカル認識モードで動作します。';
        }
        return 'このブラウザはローカル認識モードで動作します。';
    }

    if (state.activeEngine === 'none') {
        return '音声認識に対応していません。Chrome / Edge / Safari (最新版) をご利用ください。';
    }

    return '';
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
        return 'オフ';
    }
    return seconds + ' 秒';
}

function languageCodeFromDialect(dialect) {
    return String(dialect || 'ja').split('-')[0];
}

function updateMetrics() {
    elements.metricBrowser.textContent = state.browserLabel;

    elements.metricLanguage.textContent = languageCodeFromDialect(state.config.dialect);

    elements.metricListening.textContent = state.isListening ? 'オン' : 'オフ';
    elements.metricLogCount.textContent = String(countLogLines());
    elements.metricAutoclear.textContent = formatAutoClearValue(state.config.autoClearSeconds);
}

function updateActionState() {
    elements.toggleRecognition.textContent = state.shouldRun ? '停止' : '開始';
    elements.downloadLog.disabled = !elements.resultLog.value.trim();
}

function isCaptionFullscreen() {
    return document.fullscreenElement === elements.captionStage
        || document.webkitFullscreenElement === elements.captionStage;
}

function extractLatestSentence(text) {
    const normalized = (text || '').replace(/\s+/g, ' ').trim();
    if (!normalized) {
        return '';
    }

    const sentences = (normalized.match(/[^。！？.!?]+[。！？.!?]?/g) || [])
        .map((part) => part.trim())
        .filter(Boolean);

    const latest = sentences.length ? sentences[sentences.length - 1] : normalized;
    if (latest.length <= WINDOWED_CAPTION_CHAR_LIMIT) {
        return latest;
    }

    return latest.slice(0, WINDOWED_CAPTION_CHAR_LIMIT).trimEnd() + '…';
}

function buildCaptionText() {
    const lastFinal = state.lastFinalText || '';
    const interim = state.interimText || '';

    if (isCaptionFullscreen()) {
        const lines = [];
        if (lastFinal) {
            lines.push(lastFinal);
        }
        if (interim) {
            lines.push(interim);
        }
        return lines.join('\n');
    }

    return extractLatestSentence(interim || lastFinal);
}

function renderCaption() {
    const text = buildCaptionText();
    elements.resultText.textContent = text || PLACEHOLDER_TEXT;
}

function autosizeLogArea() {
    elements.resultLog.style.height = '10px';
    const scrollHeight = Math.max(elements.resultLog.scrollHeight, 140);
    elements.resultLog.style.height = scrollHeight + 'px';
}

function renderLogVisibility() {
    elements.logPanel.hidden = !state.config.showLog;
}

function applyCaptionStyle() {
    elements.resultText.style.fontSize = state.config.fontSize + 'px';
    elements.resultText.style.lineHeight = String(state.config.lineHeight);
    elements.valueFontSize.textContent = state.config.fontSize + ' px';
    elements.valueLineHeight.textContent = state.config.lineHeight.toFixed(2);
}

function formatTimestamp(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function getLectureTitle() {
    const value = (elements.lectureTitle.value || '').trim();
    return value || '無題のセッション';
}

function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

function buildExportText() {
    const startedAt = state.sessionStartedAt || new Date();
    const endedAt = state.sessionEndedAt || new Date();
    const transcript = elements.resultLog.value
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n\n');

    return [
        'タイトル: ' + getLectureTitle(),
        '開始: ' + startedAt.toLocaleString(),
        '終了: ' + endedAt.toLocaleString(),
        '所要時間: ' + formatDuration(endedAt.getTime() - startedAt.getTime()),
        '',
        transcript,
        '',
    ].join('\n');
}

function buildDownloadFilename() {
    const now = state.sessionEndedAt || new Date();
    const safeTitle = getLectureTitle()
        .normalize('NFKC')
        .replace(/[\\/:*?"<>|]/g, ' ')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48) || '文字起こし';

    const timestamp = String(now.getFullYear())
        + String(now.getMonth() + 1).padStart(2, '0')
        + String(now.getDate()).padStart(2, '0')
        + '_'
        + String(now.getHours()).padStart(2, '0')
        + String(now.getMinutes()).padStart(2, '0')
        + String(now.getSeconds()).padStart(2, '0');

    return safeTitle + '_' + timestamp + '.txt';
}

function finalizeTranscript(text) {
    const collapsed = (text || '').replace(/\s+/g, ' ').trim();
    if (!collapsed) {
        return '';
    }
    if (state.config.dialect === 'ja-JP' && !/[。！？!?]$/.test(collapsed)) {
        return collapsed + '。';
    }
    return collapsed;
}

function appendLogEntry(text) {
    const line = state.config.timestamps ? (formatTimestamp(new Date()) + '\t' + text) : text;
    elements.resultLog.value = elements.resultLog.value.trim()
        ? (elements.resultLog.value.trimEnd() + '\n' + line)
        : line;
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
        state.lastFinalText = '';
        state.interimText = '';
        state.clearTimerId = 0;
        renderCaption();
    }, state.config.autoClearSeconds * 1000);
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

    if (Object.prototype.hasOwnProperty.call(options, 'message')) {
        updateMessage(options.message || '');
    }

    if (state.recognition) {
        try {
            state.recognition.stop();
        } catch (error) {
            log('recognition stop failed: ' + error);
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
    state.recorderMimeType = '';
    stopMediaStream();
    if (state.runningEngine === 'local') {
        state.runningEngine = 'none';
    }
}

function stopLocalTranscription(options = {}) {
    const restart = !!options.restart;
    state.restartOnEnd = restart;
    clearRestartTimer();

    if (Object.prototype.hasOwnProperty.call(options, 'message')) {
        updateMessage(options.message || '');
    }

    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
        try {
            state.mediaRecorder.requestData();
        } catch (error) {
            log('media recorder requestData failed: ' + error);
        }

        try {
            state.mediaRecorder.stop();
        } catch (error) {
            log('media recorder stop failed: ' + error);
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
    if (state.runningEngine === 'local' || state.mediaRecorder) {
        stopLocalTranscription(options);
        return;
    }
    stopRecognition(options);
}

function pickRecorderMimeType() {
    if (!window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== 'function') {
        return '';
    }

    const supported = LOCAL_RECORDER_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
    return supported || '';
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
            if (maybePromise && typeof maybePromise.then === 'function') {
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
        output[i] = input[left] + ((input[right] - input[left]) * blend);
    }

    return output;
}

async function convertBlobToWhisperInput(blob) {
    const context = getOrCreateAudioDecodeContext();
    if (!context) {
        throw new Error('AudioContext が利用できません。');
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
            updateMessage('ローカル音声モデルを読み込んでいます（初回は時間がかかります）。');
            let dynamicImport = null;
            try {
                dynamicImport = new Function('source', 'return import(source);');
            } catch (error) {
                throw new Error('この Safari はローカル音声モデルの読み込み方式に未対応です。Safari を更新してください。');
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
                const importError = new Error('ローカルモデルを読み込めませんでした。Safari を最新に更新してください。');
                importError.cause = lastError;
                throw importError;
            }

            const { env, pipeline } = moduleRef;
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            let transcriber = null;
            let transcriberError = null;
            const dtypes = ['q4', 'q8'];

            for (const dtype of dtypes) {
                try {
                    transcriber = await pipeline('automatic-speech-recognition', LOCAL_WHISPER_MODEL, { dtype });
                    break;
                } catch (error) {
                    transcriberError = error;
                }
            }

            if (!transcriber) {
                const initError = new Error('ローカル音声モデルの初期化に失敗しました。');
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
    if (typeof output === 'string') {
        return output;
    }
    if (output && typeof output.text === 'string') {
        return output.text;
    }
    return '';
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
    state.interimText = '';
    appendLogEntry(finalized);
    renderCaption();
    scheduleAutoClear();
}

function queueTranscriptionChunk(blob) {
    if (!blob || blob.size === 0) {
        return;
    }

    state.transcribeQueue = state.transcribeQueue
        .then(() => transcribeAudioChunk(blob))
        .catch((error) => {
            log('transcribe chunk failed: ' + error);
            state.shouldRun = false;
            state.restartOnEnd = false;
            setStatus('エラー', 'error');
            updateMessage(error.message || 'ローカル文字起こしに失敗しました。');
            stopLocalTranscription({ restart: false });
            updateActionState();
        });
}

function bindRecognitionHandlers(recognition) {
    recognition.lang = state.config.dialect;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onsoundstart = () => {
        state.isListening = true;
        setStatus('認識中', 'active');
        updateMessage('');
        updateMetrics();
    };

    recognition.onsoundend = () => {
        state.isListening = false;
        setStatus('待機中', 'warn');
        updateMessage('');
        updateMetrics();
    };

    recognition.onnomatch = () => {
        setStatus('音声なし', 'warn');
        updateMessage('音声を認識できませんでした。');
    };

    recognition.onerror = (event) => {
        const errorCode = event && event.error ? event.error : 'unknown';
        log('recognition error: ' + errorCode);
        state.isListening = false;
        updateMetrics();

        if (!state.shouldRun && errorCode === 'aborted') {
            return;
        }

        if (errorCode === 'not-allowed' || errorCode === 'service-not-allowed') {
            state.shouldRun = false;
            state.restartOnEnd = false;
            setStatus('マイク不可', 'error');
            updateMessage('マイクへのアクセスがブロックされています。');
            updateActionState();
            return;
        }

        setStatus('再接続', 'warn');
        updateMessage('再接続しています...');
        if (state.shouldRun) {
            scheduleRecognitionStart(500);
        }
    };

    recognition.onresult = (event) => {
        let interimBuffer = '';

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const result = event.results[index];
            const transcript = ((result[0] && result[0].transcript) || '').trim();

            if (!transcript) {
                continue;
            }

            if (result.isFinal) {
                const finalized = finalizeTranscript(transcript);
                if (!finalized) {
                    continue;
                }
                state.lastFinalText = finalized;
                state.interimText = '';
                appendLogEntry(finalized);
            } else {
                interimBuffer = (interimBuffer + ' ' + transcript).trim();
            }
        }

        state.interimText = interimBuffer;
        renderCaption();
        scheduleAutoClear();
    };

    recognition.onend = () => {
        state.recognition = null;
        if (state.runningEngine === 'browser') {
            state.runningEngine = 'none';
        }
        state.isListening = false;
        updateMetrics();

        if (state.shouldRun) {
            setStatus('待機中', 'ready');
            scheduleRecognitionStart(state.restartOnEnd ? 120 : 260);
        } else {
            setStatus('待機中', 'ready');
            updateMessage(defaultHelpMessage());
        }

        state.restartOnEnd = false;
        updateActionState();
    };
}

function startRecognition() {
    const SpeechRecognitionConstructor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionConstructor) {
        setStatus('未対応', 'error');
        updateMessage(defaultHelpMessage());
        updateActionState();
        return;
    }

    if (state.recognition) {
        return;
    }

    const recognition = new SpeechRecognitionConstructor();
    state.recognition = recognition;
    state.runningEngine = 'browser';
    bindRecognitionHandlers(recognition);

    if (!state.sessionStartedAt) {
        state.sessionStartedAt = new Date();
    }
    state.sessionEndedAt = null;

    try {
        recognition.start();
        setStatus('準備中', 'warn');
        updateMessage('マイクへのアクセスを許可してください。');
        updateActionState();
    } catch (error) {
        log('recognition start failed: ' + error);
        state.recognition = null;
        if (state.runningEngine === 'browser') {
            state.runningEngine = 'none';
        }
        setStatus('エラー', 'error');
        updateMessage('開始できませんでした。');
        if (state.shouldRun) {
            scheduleRecognitionStart(800);
        }
    }
}

async function startLocalTranscription() {
    if (!hasLocalTranscriptionSupport()) {
        setStatus('未対応', 'error');
        updateMessage(defaultHelpMessage());
        updateActionState();
        return;
    }

    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
        return;
    }

    if (!state.sessionStartedAt) {
        state.sessionStartedAt = new Date();
    }
    state.sessionEndedAt = null;

    setStatus('準備中', 'warn');
    updateMessage('マイクへのアクセスを許可してください。');
    updateActionState();

    ensureLocalTranscriber().catch((error) => {
        log('local model load failed: ' + error);
        if (!state.shouldRun || state.runningEngine !== 'local') {
            return;
        }

        state.shouldRun = false;
        state.restartOnEnd = false;
        setStatus('エラー', 'error');
        updateMessage(error.message || 'ローカル音声モデルを読み込めませんでした。');
        stopLocalTranscription({ restart: false });
        updateActionState();
    });

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
        });

        if (!state.shouldRun) {
            stream.getTracks().forEach((track) => track.stop());
            return;
        }

        const mimeType = pickRecorderMimeType();
        const recorder = mimeType
            ? new MediaRecorder(stream, { mimeType })
            : new MediaRecorder(stream);

        state.mediaStream = stream;
        state.mediaRecorder = recorder;
        state.recorderMimeType = recorder.mimeType || mimeType || '';
        state.runningEngine = 'local';
        state.transcribeQueue = Promise.resolve();

        recorder.onstart = () => {
            state.isListening = true;
            setStatus('認識中', 'active');
            if (state.localTranscriber) {
                updateMessage('');
            } else {
                updateMessage('ローカル音声モデルを準備中です（初回は時間がかかります）。');
            }
            updateMetrics();
        };

        recorder.onerror = (event) => {
            const errorName = event && event.error && event.error.name ? event.error.name : 'unknown';
            log('media recorder error: ' + errorName);
            state.isListening = false;
            updateMetrics();

            if (state.shouldRun) {
                setStatus('再接続', 'warn');
                updateMessage('再接続しています...');
                stopLocalTranscription({ restart: true, message: '再接続しています...' });
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
                    setStatus('待機中', 'ready');
                    scheduleRecognitionStart(state.restartOnEnd ? 120 : 260);
                } else {
                    setStatus('待機中', 'ready');
                    updateMessage(defaultHelpMessage());
                }

                state.restartOnEnd = false;
                updateActionState();
            });
        };

        recorder.start(2200);
    } catch (error) {
        log('local transcription start failed: ' + error);
        resetLocalRecorderState();
        state.isListening = false;
        updateMetrics();

        const isPermissionError = error && (error.name === 'NotAllowedError' || error.name === 'SecurityError');
        if (isPermissionError) {
            state.shouldRun = false;
            state.restartOnEnd = false;
            setStatus('マイク不可', 'error');
            updateMessage('マイクへのアクセスがブロックされています。');
            updateActionState();
            return;
        }

        setStatus('エラー', 'error');
        updateMessage('開始できませんでした。');
        if (state.shouldRun) {
            scheduleRecognitionStart(800);
        }
    }
}

function startTranscription() {
    state.activeEngine = resolvePreferredEngine();

    if (state.activeEngine === 'browser') {
        startRecognition();
        return;
    }

    if (state.activeEngine === 'local') {
        startLocalTranscription();
        return;
    }

    state.shouldRun = false;
    setStatus('未対応', 'error');
    updateMessage(defaultHelpMessage());
    updateActionState();
}

function toggleRecognition() {
    if (state.shouldRun) {
        state.shouldRun = false;
        state.sessionEndedAt = new Date();
        stopActiveTranscription({ restart: false, message: '' });
        updateActionState();
        return;
    }

    state.browserLabel = detectBrowser();
    state.activeEngine = resolvePreferredEngine();
    updateMetrics();

    state.shouldRun = true;
    if (state.activeEngine === 'none') {
        state.shouldRun = false;
        setStatus('未対応', 'error');
        updateMessage(defaultHelpMessage());
        updateActionState();
        return;
    }

    startTranscription();
    updateActionState();
}

function populateLanguageGroups() {
    elements.selectLanguage.innerHTML = '';
    LANGUAGE_GROUPS.forEach((group, index) => {
        elements.selectLanguage.add(new Option(group.label, String(index)));
    });

    const boundedIndex = Math.max(0, Math.min(LANGUAGE_GROUPS.length - 1, Number(state.config.languageGroup) || 0));
    elements.selectLanguage.value = String(boundedIndex);
}

function populateDialects(preferredDialect) {
    const group = getSelectedLanguageGroup();
    elements.selectDialect.innerHTML = '';

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
        stopActiveTranscription({ restart: true, message: '設定を更新しています...' });
    } else {
        updateMessage(defaultHelpMessage());
    }
}

function handleDialectChange() {
    state.config.dialect = elements.selectDialect.value;
    saveConfig();
    updateMetrics();

    if (state.shouldRun) {
        stopActiveTranscription({ restart: true, message: '設定を更新しています...' });
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
    state.lastFinalText = '';
    state.interimText = '';
    state.sessionStartedAt = null;
    state.sessionEndedAt = null;
    elements.resultLog.value = '';
    renderCaption();
    autosizeLogArea();
    updateMetrics();
    updateActionState();
    updateMessage(state.shouldRun ? '表示をクリアしました。' : defaultHelpMessage());
}

function downloadLog() {
    const text = elements.resultLog.value.trim();
    if (!text) {
        return;
    }

    const blob = new Blob([buildExportText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = buildDownloadFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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

    if (state.activeEngine === 'none') {
        setStatus('未対応', 'error');
        updateMessage(defaultHelpMessage());
    } else {
        setStatus('待機中', 'ready');
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
    elements.selectLanguage.addEventListener('change', handleLanguageGroupChange);
    elements.selectDialect.addEventListener('change', handleDialectChange);
    elements.selectAutoclear.addEventListener('change', handleAutoClearChange);
    elements.sliderFontSize.addEventListener('input', handleFontSizeChange);
    elements.sliderLineHeight.addEventListener('input', handleLineHeightChange);
    elements.checkboxTimestamps.addEventListener('input', handleTimestampToggle);
    elements.checkboxShowLog.addEventListener('input', handleShowLogToggle);
    elements.resultLog.addEventListener('input', handleLogInput);

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' || !state.shouldRun || state.runningEngine === 'none') {
            return;
        }

        event.preventDefault();
        stopActiveTranscription({ restart: true, message: '' });
    });

    document.addEventListener('fullscreenchange', renderCaption);
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
    toggleRecognition,
};

window.addEventListener('beforeunload', () => {
    clearAutoClearTimer();
    clearRestartTimer();
    if (state.recognition) {
        try {
            state.recognition.stop();
        } catch (error) {
            log('recognition stop on unload failed: ' + error);
        }
    }
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
        try {
            state.mediaRecorder.stop();
        } catch (error) {
            log('media recorder stop on unload failed: ' + error);
        }
    }
    stopMediaStream();
    if (state.audioDecodeContext && typeof state.audioDecodeContext.close === 'function') {
        state.audioDecodeContext.close().catch(() => {});
    }
});

initialize();
