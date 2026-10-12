# STATUS

*Updated 2026-10-12. Single source of truth for where the build is.*

## Estado real (2026-10-12)

*Auditado contra el código y los comandos, no contra la tabla de la Fase 1 que viene después.
La parte de Supabase quedó bloqueada: ver «Pendiente del conector de Supabase».*

### Git
- Rama `main`, árbol limpio, en sync con `origin/main`.
- Último commit antes de esta sesión: `2bcaac2` (2026-09-22), *«Phase 1: move the gradient note
  out of "Accepted (not defects)"»*.
- El commit **«Phase 1: close-out» sí aterrizó**: `60694d3`, 2026-09-22.

### Restos del close-out — todos cerrados
| Comprobación | Resultado |
|---|---|
| El doc de dirección era canónico (contenía «Cache what the provider lets you cache») | ✅ — ese `VADDI_V4.md` está ahora en `legacy/`, superado por `VADDI.md` (v5) |
| `CLAUDE.md` tiene la sección `## Secrets` | ✅ |
| `C:\Users\juanv\coplannr` | ✅ borrado |
| `reg query HKCU\Environment /v GH_TOKEN` | ✅ no existe |
| Valor de token en el repo o en su historia | ✅ ninguno — ver nota |

**Nota sobre el grep de `ghp_`.** `git grep ghp_ HEAD` **sí** devuelve una coincidencia: está en
`DECISIONS.md:144`, dentro de la frase que documenta los comandos de verificación del incidente.
No hay ningún valor de token en ninguna versión del repo. El chequeo que no se autodispara es:
```
git grep -nE "ghp_[A-Za-z0-9]{20,}"
```

### Checks — todos verdes (tras arreglar el drift)
| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ 0 |
| `npx expo lint` | ✅ 0 |
| `npx expo-doctor` | ✅ 21/21 |
| `npx tsx scripts/check-contrast.ts` | ✅ 18/18 pares ≥ 4.5:1 |
| `npx expo install --check` | ✅ *después* de arreglarlo (antes fallaba) |

**Drift arreglado dentro de SDK 57** con `npx expo install --fix` — solo parches `57.0.x`, sin
subir de SDK: `expo` .24→.28, `expo-router` .22→.26, `expo-constants` .19→.21,
`expo-dev-client` .19→.20, `expo-splash-screen` .9→.10, `expo-linking` .10→.12,
`@expo/ui` .19→.23, `expo-glass-effect` .3→.4.

**`npm audit`: 30 avisos (1 critical, 18 high, 11 moderate), no accionables.** Todos caen en la
cadena de build (Metro, `@expo/cli`, `@react-native/*`); la `critical` es `shell-quote`, que entra
por el bundler. Nada de eso viaja dentro de la app. `npm audit fix --force` rompería SDK 57, que
no se toca. Se revisa de nuevo cuando haya subida de SDK.

### Variables de EAS — fallo real, arreglado hoy
Los tres entornos de EAS (`preview`, `production`, `development`) estaban **vacíos**. Importa
porque un build `preview` compila el JS en los servidores de EAS y `.env` está gitignored: la app
habría arrancado sin URL de Supabase. Subidas `EXPO_PUBLIC_SUPABASE_URL` y
`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` a los tres entornos, visibilidad *plaintext* (ambas son
públicas por diseño). Verificado con `eas env:list` en los tres.

### Fase 1, punto por punto contra el código
| Punto | Verificado en | Resultado |
|---|---|---|
| 3 tabs `Discover · Trip · Profile` | `src/app/(tabs)/_layout.tsx` | ✅ los tres |
| Tema claro + oscuro por un solo `useTheme()` | `src/theme/ThemeProvider.tsx` | ✅ |
| ESLint prohíbe hex fuera de `src/theme` | `eslint.config.js` (`no-restricted-syntax`) | ✅ |
| Inter 400/500/600/700, splash retenido hasta cargar | `src/app/_layout.tsx` | ✅ (`preventAutoHideAsync` + `hideAsync`) |
| Brand kit: mark, gradient, loader, empty state | `src/components/brand/` | ✅ 4 componentes |
| `BrandGradient` | mismo fichero | ⚠️ relleno coral **sólido**; `LinearGradient` aparece solo en el comentario — no hay import roto |
| `IdeaCard`: 2 variantes, expo-image, 44pt, haptics, optimista | `src/components/IdeaCard.tsx` | ✅ |
| Fixtures de Madrid | `src/data/fixtures.ts` | ✅ 8 ideas (3 eat / 3 drink / 2 do) |
| Cuatro estados + control dev para forzarlos | `src/components/ScreenState.tsx`, `src/dev/` | ✅ |
| Discover: pick + 3 compactas, sin buscador/filtros/mapa | `src/app/(tabs)/discover.tsx` | ✅ 0 coincidencias de `TextInput`/`filter`/`MapView` |
| Trip: «No trip yet» → `create-trip` | `src/app/(tabs)/trip.tsx` | ✅ |
| Profile: nombre, estado de invitado, control dev | `src/app/(tabs)/profile.tsx` | ✅ |
| Auth anónima al arrancar y persistida | `src/lib/session.tsx`, `src/lib/supabase.ts` | ✅ `signInAnonymously` + AsyncStorage + `persistSession` + `autoRefreshToken` |
| `profiles` + RLS **en el servidor** | — | ⏸ no verificable sin conector |
| Advisors de seguridad | — | ⏸ no verificable sin conector |
| Build Android | EAS | ✅ existe uno `development` (21-sep). **Ninguno `preview`.** |
| Build iOS | — | ⛔ no existe |

### Pendiente del conector de Supabase
El conector MCP de Supabase **no está disponible en esta sesión**. Sin él no se puede:
- listar en vivo tablas, migraciones y políticas del proyecto `vaddi` (`mryoyzqkvinykehrwmri`);
- crear un usuario anónimo por el endpoint de signup y confirmar que aparece su fila en
  `profiles` — **esto importa: la pestaña Perfil no puede guardar un nombre sin esa fila**;
- correr `get_advisors(security)`;
- regenerar los tipos en `src/types/database.ts`.

En disco solo hay `supabase/migrations/0001_profiles.sql`, `0002_profiles_harden.sql` y el test
`supabase/tests/0001_profiles_rls.sql`. **No existe nada de `events / members / ideas /
reactions / booking_clicks`.**

## Fase 2 — empezada el 2026-10-12, a medias

Juan decidió seguir sin haber visto la Fase 1 en un móvil (su llamada, registrada en
`DECISIONS.md`). El primer tramo se hizo sin `VADDI.md` (v5) y sin el conector MCP de Supabase,
así que se limitó a lo que no dependía de ninguna de las dos cosas. **v5 ya está adoptado**; el
conector es lo único que sigue bloqueando.

### Hecho
| Paso | Qué | Commit |
|---|---|---|
| A1 | **v5 adoptado.** `VADDI.md` en la raíz, `VADDI_V4.md` movido a `legacy/`, referencias actualizadas en `CLAUDE.md`, `README.md` y `.env.example`, y las reglas §10.6 (nada de cobrar ni reservar en nombre de nadie) y §10.10 (los secretos no viajan) en `CLAUDE.md`. | `Direction: v5` |
| idioma | **La interfaz va en español** desde ahora, con un único `src/i18n/es.ts` y sin librería de i18n. Las pantallas de Fase 1 se traducen en B3 al tocarlas. | `Direction: v5` |
| deps | `expo-linear-gradient`, `expo-clipboard`, `expo-sharing` instaladas (las tres aprobadas). `expo-sharing` añadió su config plugin a `app.json`. | `a088b14` |
| gradiente | `BrandGradient` ya es el gradiente real coral→teal, colores desde el tema. **Cierra el punto más viejo del repo.** | `a088b14` |
| drift | `expo install --fix`, solo parches `57.0.x`. `expo install --check` fallaba antes. | `6339531` |
| fixtures | `src/data/fixtures/` como carpeta: `madrid.ts` y `salou.ts`, 8 ideas cada una (3 eat / 3 drink / 2 do), con la forma de las columnas de `ideas`. Los `do` llevan página de listado de Civitatis **comprobada en vivo**. | `bd8bfb3` |
| enlaces | `src/config/links.ts` con `SHARE_HOST` como única constante del host y `eventUrl(code)` → `https://<host>/e/<code>`. HTTPS siempre, nunca `vaddi://`. | `0bf920e` |
| mensajes | `src/lib/messages.ts`: invitación, recordatorio de pago y decisión, en español. Verificados ejecutándolos (rangos de fecha dentro y entre meses, singular/plural, moneda es-ES, cero `vaddi://`). | `0bf920e` |

### No hecho, y por qué
| Paso | Bloqueado por |
|---|---|
| B1 — migración `0003_events`, RLS, RPCs, advisors, tipos | El conector MCP de Supabase. El brief prohíbe `execute_sql` para DDL, así que no hay atajo. |
| B3 — pantallas de organizador | Dependen de las tablas de B1. |
| B4 — página web de invitado | Depende del RPC `get_event_preview` de B1. |
| B5 — realtime | Depende de B1. |
| B6 — build `preview` | Se puede lanzar, pero sin B3 mostraría la Fase 1 con gradiente nuevo. Pendiente de decidir si merece la pena. |
| Parte C — publicar en Cloudflare Pages | Depende de B4. |

### Ojo
- **`SHARE_HOST` apunta a `vaddi.app`, que todavía no resuelve.** Juan no compra el dominio hasta
  que la app funcione. Los enlaces están bien formados pero muertos hasta la Parte C.
- **Idioma:** las tres plantillas de WhatsApp están en español; la UI de la app sigue en inglés.
  Decidir el idioma del producto ahora es barato; después de la Fase 3, caro.

## Phase 0 — Audit and reset — COMPLETE
See `AUDIT.md` and `DECISIONS.md` (2026-09-21 reset). Fresh repo, SDK 57 skeleton, new Supabase
project `vaddi` (`mryoyzqkvinykehrwmri`), state files, icons, EAS/bundle IDs reused.

## Phase 1 — Skeleton — COMPLETE (pending device verification)

| Item (v4 §11 / §12) | Status |
|---|---|
| 3 tabs `Discover · Trip · Profile` (expo-router) | ✅ |
| Theme tokens, light + dark, `useTheme()` only; no hex outside `src/theme` (ESLint-enforced) | ✅ |
| WCAG AA contrast gate (`scripts/check-contrast.ts`, 18 pairs) | ✅ |
| Inter font (expo-font), splash held until loaded | ✅ |
| Brand kit ported (mark, gradient*, loader, empty state) | ✅ (*solid coral fill; real gradient lands at the start of Phase 2) |
| One card `IdeaCard` — primary + compact variants, expo-image, 44pt reactions, haptics, optimistic | ✅ |
| Madrid fixtures (8 ideas: eat/drink/do) | ✅ |
| Four states on every screen + dev control to force any state | ✅ |
| Discover: Vaddi's pick + 3 compact, detail route, no search/filters/map | ✅ |
| Trip: "No trip yet" → Create-a-trip (Phase-2 placeholder) | ✅ |
| Profile: guest status, display-name field, dev control | ✅ |
| Anonymous auth on launch, persisted; `useSession()`; no account wall | ✅ |
| `profiles` table + RLS (owner-only; no insert/delete via API; signup trigger) | ✅ (migrations 0001, 0002) |
| RLS proven by query; saved `supabase/tests/0001_profiles_rls.sql` | ✅ |
| Security advisors run + fixable ones fixed | ✅ (1 accepted — see below) |
| `tsc`, `expo lint`, `expo-doctor` (21/21), contrast gate all green | ✅ |
| GitHub auth through gh's credential store, no token anywhere | ✅ |
| Android dev build | ✅ FINISHED — links below |
| iOS dev build | ⛔ needs Juan + the iPhone — task 1 |

**Build links**
- Android (**development**, EAS) — **FINISHED**, 2026-09-21. El único build utilizable hoy.
  - Página del build: https://expo.dev/accounts/juanvman/projects/vaddi/builds/855afebe-1622-4159-bf9e-11bcc015fd9d
  - APK directa: https://expo.dev/artifacts/eas/mnnRWrvG2YV6r4vjlsxEYO3hfdh7ytdL8m10oKq7RTM.apk
  - Carga el JS desde este PC: hace falta `npx expo start` corriendo. Para una app que funcione
    sola hace falta un build `preview`.
- Android (**preview**) — **no existe.** El run del 2026-10-12 se interrumpió en A1 antes de B1,
  así que nunca se lanzó. La única `preview` en EAS es `ef56cff9` del **2026-01-26**: de la época
  de v3, nueve meses vieja, anterior a toda la reconstrucción. **No sirve.**
- iOS — no hay ningún build de esta reconstrucción (tarea 3).

## Verify on device

### How to install
**Android.** Open the **build page** (or the direct APK link) on an Android phone, download the
`.apk`, tap it, allow "install from this source" if prompted, install. If Juan has no Android
phone, send that link to a friend who does — it is a normal download, nothing else is needed on
their side.

**iOS.** Not available until task 1 produces a build.

### How to run it
A development build does **not** contain the app's JavaScript — it loads it from this computer.
So the app shows a "no bundler" screen until a dev server is running.

1. In the VS Code terminal, in `C:\Users\juanv\vaddi`:
   ```
   npx expo start
   ```
2. Keep the phone on the **same Wi-Fi** as this computer.
3. Open the **Vaddi** dev build on the phone. It lists the running server — tap it. (Or scan the
   QR code the terminal prints.)
4. If the phone and computer can't see each other (guest Wi-Fi, client isolation, VPN, firewall):
   ```
   npx expo start --tunnel
   ```
   Slower, but it routes around the network entirely.

Stop the server with `Ctrl+C`. The app reloads on save while it's running.

### Checklist
- [ ] All three tabs render in **light and dark** (toggle system theme).
- [ ] In Profile, use **DEV · FORCE SCREEN STATE** to see each of **loading / empty / error / offline**
      on Discover, Trip and Profile — each offers a next step.
- [ ] Bump **system font size** up — text scales, nothing clips.
- [ ] Set a **display name**, force-quit, reopen — the name is still there (survives restart).
- [ ] Discover: tap the pick → detail opens with the same data + primary action; react yes/no (haptic).

## Tareas de Juan

**Lo que desbloquea la Fase 2, por orden de impacto:**

1. **Autorizar el conector de Supabase.** `.mcp.json` ya está en el repo apuntando solo al
   proyecto `mryoyzqkvinykehrwmri`; falta escribir `/mcp` en el chat de Claude Code, elegir
   **supabase**, pulsar **Authenticate** y autorizar en el navegador. Bloquea B1 entero (migración
   `0003_events`, RLS, los RPCs `get_event_preview` / `join_event`, advisors, tipos en
   `src/types/database.ts`) y por arrastre B3, B4, B5 y la Parte C. El brief prohíbe
   `execute_sql` para DDL, así que no hay atajo.
2. **Ver la Fase 1 en un móvil.** No hace falta instalar nada: `npx expo start` en la terminal,
   pulsar `s` para cambiar a Expo Go, misma Wi-Fi, escanear el QR con Expo Go (Android) o con la
   cámara (iPhone). Es lo único que puede destapar fallos que no se ven en el PC: tipografía,
   haptics, auth real en el dispositivo. **La Parte C espera a que Juan confirme esto.**

**Cuando quieras:**

3. **Registrar el iPhone y hacer el build de iOS** (requiere el iPhone en mano; el login de Apple
   no se puede automatizar). En la terminal, por orden:
   1. `npx eas device:create` — login de Apple (ID, contraseña, código 2FA en el iPhone), elegir
      el equipo, método **Website**. Abrir la URL/QR en el iPhone **con Safari**, permitir la
      descarga del perfil, y luego **Ajustes → Perfil descargado → Instalar**.
   2. `npx eas build --profile preview --platform ios` — login de Apple otra vez; certificado de
      distribución (reutilizar si lo ofrece, si no generar); perfil de aprovisionamiento
      (generar); lista de dispositivos — **espacio** para marcar el iPhone, **Enter**;
      notificaciones push **No**.

   Pégame la URL del build y la pongo en *Build links*.
4. **Poner v5 en las instrucciones del proyecto de claude.ai.** Las tres ediciones §7 que había
   pendientes aquí **ya no aplican**: v5 las incorpora y sustituye al documento entero. Abre el
   proyecto **Vaddi** → **Instructions** y pega `VADDI.md` tal cual, reemplazando lo que hubiera.

5. *(Opcional, más adelante)* Activar **leaked-password protection** en Supabase Auth — solo
   importa cuando exista login por email/contraseña (v4 lo aplaza; v1 es anónimo). Ignorable.
6. *(Opcional, limpieza)* `C:\Users\juanv\vaddi-archive-2026-09-21.zip` es ya la única copia de la
   app v3. Guárdalo o bórralo, da igual — nada depende de él.

## Accepted (not defects)
- **Anonymous-access advisor warning** on `profiles` is **intentional** — anonymous sign-in is v4's
  entry model (§5.1); those users must reach their own row.

## Open questions
- **Places cost model** (Phase 3 entry): with no cross-user cache of display fields, is per-session
  Google Places cost acceptable, or do we evaluate Foursquare / OSM? Decide before the places layer.
- **Idioma del producto.** Las plantillas de WhatsApp están en español, la UI en inglés. Decidirlo
  antes de la Fase 3.
- **Dominio `vaddi.app`.** Sin comprar por decisión de Juan hasta que la app funcione. La página de
  invitado sale primero en un host `*.pages.dev` y `SHARE_HOST` se mueve en una línea.

## Lo que queda de la Fase 2
El avance está arriba, en **«Fase 2 — empezada el 2026-10-12, a medias»**. Lo que falta, por orden:

1. **B1 — el backend.** Migración `0003_events`: `events`, `members`, `ideas`, `reactions`,
   `booking_clicks`; RLS (los miembros leen todo lo de su evento; el organizador actualiza el
   evento, el flag de pago y las ideas; el invitado solo su propia fila; nadie borra por API);
   RPCs `get_event_preview(code)` para anónimos y `join_event(code, name)`; realtime en
   `reactions` y `members`. Probado con `execute_sql` y guardado en `supabase/tests/`.
2. **B3 — pantallas del organizador.** Crear evento (tipo, destino Madrid o Salou, fechas, nombre
   generado y editable). Pestaña del evento, de arriba abajo y sin scroll: quién viene, qué está
   decidido, quién falta por pagar, la lista de miembros con el toggle de pago que solo ve el
   organizador, y la acción de compartir. Las tres plantillas de mensaje ya están hechas.
3. **B4 — página web de invitado.** `src/app/e/[code].tsx` en web: preview por `get_event_preview`,
   entrar con un nombre, y las mismas ideas, reacciones, plan y estado propio que la app.
   Mobile-first, probada a 360 px. `expo export -p web` debe dar un sitio estático desplegable.
4. **B5 — realtime** en reacciones y estado de miembros, en app y web.
5. **B6 — build `preview`** de Android, y de iOS cuando el iPhone esté registrado.
6. **Parte C — publicar** la página de invitado en Cloudflare Pages.
