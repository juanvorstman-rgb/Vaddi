// src/config/links.ts
// The one place the share host is decided. C2 swaps SHARE_HOST when the guest
// page goes live; nothing else in the app knows the host.
//
// Hard rule (AUDIT §5 lesson 2): a share message carries an HTTPS universal
// link, never the `vaddi://` scheme. A friend without the app must still land
// on the guest web page. `vaddi://` exists only for auth redirects.
//
// NOTE: as of this commit neither host serves anything — the domain is not
// bought yet and the Cloudflare Pages deploy has not happened. Links built
// here are well-formed but dead until then.

/**
 * The host the guest page is served from. `app.json` already declares
 * `applinks:vaddi.app` and the `/e` intent filter, so this is the intended
 * home; point it at the *.pages.dev host instead while DNS is pending.
 */
export const SHARE_HOST = 'vaddi.app';

/** Path of one event's guest page. */
export const eventPath = (code: string) => `/e/${code}`;

/** The link that goes into a share message. HTTPS, always. */
export const eventUrl = (code: string) => `https://${SHARE_HOST}${eventPath(code)}`;
