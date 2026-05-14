/**
 * 301 redirect Worker — marblism.app → offthegridsolutions.app
 *
 * Every request to marblism.app (or www.marblism.app) is permanently
 * redirected to the same path on offthegridsolutions.app. Preserves the
 * pathname, query string, and hash so existing links keep working:
 *
 *   marblism.app/industries                → offthegridsolutions.app/industries
 *   marblism.app/spa?utm_source=email      → offthegridsolutions.app/spa?utm_source=email
 *
 * Why a Worker (vs. a dashboard Redirect Rule): version-controlled, easy
 * to evolve later (e.g. swap to a 302 if you ever need to test something,
 * or add path-specific exceptions).
 */

const NEW_HOST = "offthegridsolutions.app";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.host = NEW_HOST;
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  },
};
