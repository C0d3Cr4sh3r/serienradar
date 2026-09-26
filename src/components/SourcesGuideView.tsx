import React, { useState } from 'react';
import { Database, Code2, Check, ExternalLink, Search, RefreshCw, AlertCircle, Sparkles, Key, ShieldCheck, Lock, Smartphone, Download, Box, Terminal, Copy } from 'lucide-react';
import { API_SOURCES_DATA, ANDROID_DEV_GUIDE, BYOK_GUIDE } from '../data/sourcesGuide';

export const SourcesGuideView: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<string>('tmdb');
  const [activeGuideTab, setActiveGuideTab] = useState<'byok' | 'apk_guide' | 'sources' | 'android_code'>('byok');
  
  // Simulated Settings Key State
  const [simulatedUserKey, setSimulatedUserKey] = useState('tmdb_demo_user_key_8f3a1');
  const [keySavedMessage, setKeySavedMessage] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentApiDoc = API_SOURCES_DATA.find((a) => a.id === selectedApi) || API_SOURCES_DATA[0];

  const handleSaveDemoKey = (e: React.FormEvent) => {
    e.preventDefault();
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 2500);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const capacitorCommands = `npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init SeriesRadar com.seriesradar.app --web-dir dist
npm run build
npx cap add android
npx cap open android`;

  return (
    <div className="space-y-3.5 w-full min-w-0 overflow-hidden">
      {/* Intro Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 sm:p-4 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
          <Key className="w-3.5 h-3.5" />
          <span>Architektur & APK-Bauplan</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
          Quellen, Eigener Key & APK-Erstellung
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">
          Schritt-für-Schritt: Vom Code zur fertigen Android-Installationsdatei (.apk).
        </p>

        {/* 2x2 Segmented Navigation (Mobile-First, 100% visible) */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => setActiveGuideTab('byok')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors truncate ${
              activeGuideTab === 'byok'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Key className="w-3 h-3 shrink-0" />
            <span className="truncate">1. Eigener Key (BYOK)</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('apk_guide')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors truncate ${
              activeGuideTab === 'apk_guide'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Box className="w-3 h-3 shrink-0" />
            <span className="truncate">2. APK erstellen</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('sources')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors truncate ${
              activeGuideTab === 'sources'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Database className="w-3 h-3 shrink-0" />
            <span className="truncate">3. APIs im Vergleich</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('android_code')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors truncate ${
              activeGuideTab === 'android_code'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-3 h-3 shrink-0" />
            <span className="truncate">4. Kotlin Code-Vorlage</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BYOK (BRING YOUR OWN KEY) ARCHITECTURE */}
      {activeGuideTab === 'byok' && (
        <div className="space-y-3 w-full min-w-0">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3 text-xs w-full min-w-0">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Die BYOK-Strategie: 0 € Kosten für dich!</span>
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px]">
              Genau die richtige Entscheidung: Bei tausenden App-Nutzern würdest du mit einem zentralen Firmen-Account monatlich hunderte Euro für API-Limits zahlen. Mit <strong>"Bring Your Own Key"</strong> fragt jedes Smartphone mit dem persönlichen Gratis-Kontingent des Nutzers an:
            </p>

            <div className="space-y-2 pt-1">
              {BYOK_GUIDE.reasons.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1 min-w-0">
                  <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Android Settings Preview Box */}
            <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Vorschau: So sieht die App-Einstellung für User aus</span>
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  Android Screen
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <p className="text-slate-400">
                  Der User öffnet in deiner Android-App die Einstellungen und hinterlegt dort seinen persönlichen TMDb-Schlüssel:
                </p>

                <form onSubmit={handleSaveDemoKey} className="space-y-1.5">
                  <label className="block text-slate-300 text-[10px] font-medium">
                    Persönlicher TMDb API-Key (kostenlos bei themoviedb.org):
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={simulatedUserKey}
                      onChange={(e) => setSimulatedUserKey(e.target.value)}
                      placeholder="User Key hier eingeben..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg text-xs shrink-0 transition-colors"
                    >
                      Speichern
                    </button>
                  </div>
                </form>

                {keySavedMessage && (
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium animate-fade-in">
                    <Check className="w-3 h-3" />
                    <span>In EncryptedSharedPreferences auf dem Smartphone gespeichert!</span>
                  </div>
                )}

                <div className="pt-1 flex flex-wrap gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Verschlüsselt auf dem Handy</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-300">
                    Fallback: TVMaze aktiv (falls kein Key eingetragen)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WIE ERSTELLE ICH DIE APK? (STEP BY STEP) */}
      {activeGuideTab === 'apk_guide' && (
        <div className="space-y-3 w-full min-w-0">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3.5 text-xs w-full min-w-0">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Box className="w-4 h-4 text-amber-400" />
                <span>Wie erstelle ich jetzt die Android .apk?</span>
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Es gibt <strong>3 bewährte Wege</strong>, um aus diesem Projekt eine echte, installierbare Android `.apk` oder `.aab` für den Google Play Store zu generieren:
              </p>
            </div>

            {/* Methode 1: PWABuilder (Online ohne Tool-Installation) */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-[10px]">1</span>
                  <span>Weg 1: 1-Klick APK via PWABuilder (Kostenlos & Online)</span>
                </span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                  Am einfachsten
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Google und Microsoft stellen das offizielle Tool <strong>PWABuilder</strong> bereit, das aus Web-Apps automatisch signierte Android-APKs und Google Play Store Pakete schnürt:
              </p>

              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                <li>Öffne <strong>pwabuilder.com</strong> im Browser.</li>
                <li>Füge die URL deiner App ein und klicke auf <strong>Start</strong>.</li>
                <li>Wähle <strong>Android Package</strong> und lade die fertige <code>.apk</code> oder <code>.aab</code> herunter. Fertig!</li>
              </ol>

              <div className="pt-1">
                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                >
                  <span>PWABuilder öffnen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Methode 2: Capacitor & Android Studio (Der Entwickler-Standard) */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-[10px]">2</span>
                  <span>Weg 2: Mit Capacitor & Android Studio (Natives APK)</span>
                </span>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-medium">
                  Standard
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Mit <strong>Capacitor</strong> wandelst du dieses React-Projekt mit 5 Terminal-Befehlen in ein vollständiges Android-Studio-Projekt um:
              </p>

              <div className="relative">
                <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-200 overflow-x-auto leading-relaxed">
                  {capacitorCommands}
                </pre>
                <button
                  onClick={() => handleCopyCode(capacitorCommands, 'cap')}
                  className="absolute right-2 top-2 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1"
                >
                  {copiedCode === 'cap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode === 'cap' ? 'Kopiert!' : 'Kopieren'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Anschließend öffnet sich Android Studio automatisch. Klicke dort einfach auf <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>!
              </p>
            </div>

            {/* Methode 3: PWA Direktinstallation (Ohne APK-Download) */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[10px]">3</span>
                  <span>Weg 3: Direkt-Installation auf dem Android-Handy (PWA)</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Wenn du die App sofort ohne Build-Tools auf deinem Smartphone testen möchtest:
                Öffne die App im mobilen Chrome-Browser, tippe oben rechts auf die 3 Punkte und wähle <strong>„Zum Startbildschirm hinzufügen“</strong>. Sie installiert sich sofort wie eine native App mit eigenem App-Icon und Vollbildmodus!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API SOURCES COMPARISON */}
      {activeGuideTab === 'sources' && (
        <div className="space-y-3 w-full min-w-0">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-medium block">
              Wähle eine Datenbank zur Detailansicht:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {API_SOURCES_DATA.map((api) => {
                const isSelected = selectedApi === api.id;
                return (
                  <button
                    key={api.id}
                    onClick={() => setSelectedApi(api.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{api.name.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-500 truncate">{api.requiresKey ? 'User-Key' : 'Gratis ohne Key'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected API Details Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3 text-xs w-full min-w-0">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800 min-w-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {currentApiDoc.name}
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                  Anbieter: {currentApiDoc.provider}
                </p>
                <div className="mt-1 text-[11px] text-amber-300 font-medium">
                  Ideal für: {currentApiDoc.bestFor}
                </div>
              </div>

              <a
                href={currentApiDoc.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors"
              >
                <span>Doku</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Fact rows */}
            <div className="space-y-1.5">
              <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800 flex justify-between gap-2">
                <span className="text-slate-400 text-[11px]">Kosten:</span>
                <span className="text-slate-200 font-medium text-[11px] text-right truncate">{currentApiDoc.price}</span>
              </div>
              <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800 flex justify-between gap-2">
                <span className="text-slate-400 text-[11px]">API-Key:</span>
                <span className="text-slate-200 font-medium text-[11px] text-right">
                  {currentApiDoc.requiresKey ? 'User trägt eigenen Key ein' : 'Öffentlich (kein Key nötig)'}
                </span>
              </div>
              <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800 flex justify-between gap-2">
                <span className="text-slate-400 text-[11px]">Rate Limit:</span>
                <span className="text-slate-200 font-medium text-[11px] text-right truncate">{currentApiDoc.rateLimit}</span>
              </div>
            </div>

            {/* Pros & Cons (Stacked) */}
            <div className="space-y-2 pt-0.5">
              <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">
                  <Check className="w-3 h-3 shrink-0" />
                  <span>Vorteile:</span>
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px] pl-1">
                  {currentApiDoc.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-1">
                <span className="font-semibold text-rose-400 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Zu beachten:</span>
                </span>
                <ul className="space-y-1 text-slate-300 text-[11px] pl-1">
                  {currentApiDoc.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANDROID KOTLIN CODE MIT DYNAMISCHEM USER-KEY */}
      {activeGuideTab === 'android_code' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3 text-xs w-full min-w-0 overflow-hidden">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>Android Code: User-Key Interceptor</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              So bindest du den privaten Key des Nutzers dynamisch in OkHttp & Retrofit ein:
            </p>
          </div>

          <div className="space-y-1 w-full min-w-0 overflow-hidden">
            <span className="font-semibold text-slate-300 text-[11px] block">1. ApiKeyInterceptor (Hängt User-Key an jeden Request):</span>
            <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <pre className="font-mono text-[10px] text-slate-200 leading-relaxed whitespace-pre">
{`class UserApiKeyInterceptor(private val prefs: SharedPreferences) : Interceptor {
  override fun intercept(chain: Interceptor.Chain): Response {
    val original = chain.request()
    // Liest den vom User in den Settings eingetragenen Key
    val userKey = prefs.getString("tmdb_user_key", null) ?: "FALLBACK_KEY"
    
    val url = original.url.newBuilder()
      .addQueryParameter("api_key", userKey)
      .build()
      
    return chain.proceed(original.newBuilder().url(url).build())
  }
}`}
              </pre>
            </div>
          </div>

          <div className="space-y-1 w-full min-w-0 overflow-hidden pt-1">
            <span className="font-semibold text-slate-300 text-[11px] block">2. Sicheres Speichern (EncryptedSharedPreferences):</span>
            <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-2.5">
              <pre className="font-mono text-[10px] text-slate-200 leading-relaxed whitespace-pre">
{`val sharedPreferences = EncryptedSharedPreferences.create(
  context,
  "secure_user_prefs",
  MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
  EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
  EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

// Speichern des Keys, wenn der User ihn einträgt:
sharedPreferences.edit().putString("tmdb_user_key", inputKey).apply()`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
