/**
 * Nav template global
 */
const marked = require("marked");

module.exports = {
  name: "nav",
  func: function(name, classes = "omw-nav") {
    let gin = this.env.getGlobal("gin");
    let navs = gin.getContentTypeInstances("navigation");

    if (!navs) return "?navs";

    let nav = false;

    for (var i = 0; i < navs.length; i++) {
      if (navs[i].name === name) {
        nav = navs[i];
        break;
      }
    }

    if (!nav) return "?nav";

    /**
     * Because we want to be able to customise the classes,
     * we need to put the render here, can't see a way to pass
     * arguments right now.
     */

    let renderer = new marked.Renderer();
    
    renderer.link = (href, title, text) => {
      title = title || text;
      let current = href === this.ctx.content.url
        ? " nav__link--is-current"
        : "";
      return `
        <a href="${href}" title="${title}" class="nav__link${current}">
          ${text}
        </a>`;
    } 

    renderer.listitem = (str) => {
      return `<li class="nav-item">${str}</li>`; 
    };

    renderer.list = (body, ordered) => {
      let o = ordered ? "o" : "u";
      return `
      <${o}l class="nav-center ${classes}">
        ${body}
      </ul>`;
    }
    
    return marked(nav.structure, {renderer: renderer});
  }
}
