export function createView(t: string, doc: Document = document): View {
  return new View(doc.createElement(t));
}

/**
 * View interface for all tomato templates.
 * Thin wrapper around an HTMLElement with some sugar around standard DOM apis.
 */
export class View {
  e: HTMLElement;

  constructor(node: HTMLElement) {
    this.e = node;
  }

  set(e: HTMLElement): View {
    this.e = e;
    return this;
  }

  select(sel: string): View | null {
    const e = this.e.querySelector(sel);
    return e ? new View(e as HTMLElement) : null;
  }

  focus(): View {
    this.e.focus();
    return this;
  }

  blur(): View {
    this.e.blur();
    return this;
  }

  click(): View {
    this.e.click();
    return this;
  }

  hasFocus(): boolean {
    let doc = this.e.ownerDocument || document;
    return doc.activeElement == this.e;
  }

  contains(q: Node | View): boolean {
    return contains(this.e, q instanceof View ? q.e : q);
  }

  text(): string | null {
    return text(this.e);
  }

  innerText(): string {
    return innerText(this.e);
  }

  html(): string {
    return html(this.e);
  }

  setHtml(v: string): View {
    setHtml(this.e, v);
    return this;
  }

  setText(v: string): View {
    setText(this.e, v);
    return this;
  }

  hasAttr(k: string): boolean {
    return hasAttr(this.e, k);
  }

  attr(k: string): string {
    return attr(this.e, k);
  }

  setAttr(k: string, v: string): View {
    setAttr(this.e, k, v);
    return this;
  }

  prop(k: string): any {
    return prop(this.e, k);
  }

  setProp(k: string, v: any): View {
    setProp(this.e, k, v);
    return this;
  }

  val(): string {
    return val(this.e);
  }

  setVal(v: string): View {
    setVal(this.e, v);
    return this;
  }

  css(k: string): string {
    return css(this.e, k);
  }

  setCss(k: string, v: any, p?: string): View {
    setCss(this.e, k, v, p);
    return this;
  }

  setCssTransform(xform: string): View {
    setCssTransform(this.e, xform);
    return this;
  }

  setCssAnimationFillmode(fillmode: string): View {
    setCssAnimationFillmode(this.e, fillmode);
    return this;
  }

  on(name: string, f: (e: Event) => void, capture?: boolean): View {
    on(this.e, name, f, capture);
    return this;
  }

  off(name: string, f: (e: Event) => void, capture?: boolean): View {
    off(this.e, name, f, capture);
    return this;
  }

  child(): View | null {
    const p = this.e.firstElementChild;
    return p ? new View(p as HTMLElement) : null;
  }

  parent(): View | null {
    const p = this.e.parentElement;
    return p ? new View(p) : null;
  }

  remove(): View {
    remove(this.e);
    return this;
  }

  hasClass(c: string): boolean {
    return hasClass(this.e, c);
  }

  setClass(c: string): View {
    setClass(this.e, c);
    return this;
  }

  addClass(...c: string[]): View {
    addClass(this.e, ...c);
    return this;
  }

  removeClass(...c: string[]): View {
    removeClass(this.e, ...c);
    return this;
  }

  toggleClass(c: string): View {
    toggleClass(this.e, c);
    return this;
  }

  switchClass(c: string, on: boolean): View {
    switchClass(this.e, c, on);
    return this;
  }

  append(o: Node | View): View {
    append(this.e, o);
    return this;
  }

  insert(o: Node | View, before: Node | View) {
    insert(this.e, o, before);
    return this;
  }

  appendText(text: string): View {
    let doc = this.e.ownerDocument || document;
    append(this.e, doc.createTextNode(text));
    return this
  }

  appendTo(o: Node | View): View {
    append(o, this.e);
    return this;
  }

  prepend(o: Node | View): View {
    prepend(this.e, o);
    return this;
  }

  prependTo(o: Node | View): View {
    prepend(o, this.e);
    return this;
  }

  bounds(): ClientRect {
    return this.e.getBoundingClientRect();
  }

  elem(): HTMLElement {
    return this.e;
  }

  offsetWidth(): number {
    return this.e.offsetWidth
  }

  offsetHeight(): number {
    return this.e.offsetHeight
  }

  offsetTop(): number {
    return this.e.offsetTop
  }

  offsetLeft(): number {
    return this.e.offsetLeft
  }
}

export function css(e: Element & ElementCSSInlineStyle, k: string): string {
  const lv = e.style.getPropertyValue(k);
  return lv ? lv : getComputedStyle(e).getPropertyValue(k);
}

export function setCss(e: HTMLElement, k: string, v: string | number | null, priority?: string) {
  if (typeof v == 'number') {
    v = v.toString();
    if (k != 'opacity' && k != 'z-index') {
      v += 'px';
    }
  }
  e.style.setProperty(k, v, priority || '');
}

export function setCssTransform(e: ElementCSSInlineStyle, xform: string) {
  e.style.setProperty('-webkit-transform', xform);
  e.style.setProperty('-moz-transform', xform);
  e.style.setProperty('-ms-transform', xform);
  e.style.setProperty('transform', xform);
}

export function setCssAnimationFillmode(e: ElementCSSInlineStyle, fillmode: string) {
  e.style.setProperty('-webkit-animation-fill-mode', fillmode);
  e.style.setProperty('-moz-animation-fill-mode', fillmode);
  e.style.setProperty('-ms-animation-fill-mode', fillmode);
  e.style.setProperty('animation-fill-mode', fillmode);
}

export function html(e: Element): string {
  return e.innerHTML;
}

export function setHtml(e: Element, v: string) {
  e.innerHTML = v;
}

export function text(e: Node): string | null {
  return e.textContent;
}

export function innerText(e: HTMLElement): string {
  return e.innerText;
}

export function setText(e: Node, v: string) {
  e.textContent = v;
}

/**
 * For setting arbitrary expandos on an HTMLElement.
 */
interface HTMLElementWithProperties extends HTMLElement {
  [property: string]: any;
}

export function prop(e: HTMLElement, k: string): any {
  const eWithProperties = e as HTMLElementWithProperties;
  return eWithProperties[k];
}

export function setProp(e: HTMLElement, k: string, v: any) {
  const eWithProperties = e as HTMLElementWithProperties;
  if (v == null) {
    delete eWithProperties[k];
  } else {
    eWithProperties[k] = v;
  }
}

export function hasAttr(e: Element, k: string): boolean {
  return e.hasAttribute(k);
}

export function attr(e: Element, k: string): string {
  const value = e.getAttribute(k);
  return value !== null ? value : '';
}

export function setAttr(e: Element, k: string, v: string) {
  if (v == null) {
    e.removeAttribute(k);
  } else {
    e.setAttribute(k, v);
  }
}

export function contains(e: Node | View, child: Node | View): boolean {
  const en: Node = (e instanceof View) ? e.e : e,
      cn: Node = (child instanceof View) ? child.e : child;
  return en.contains(cn);
}

export function val(e: HTMLElement): string {
  return prop(e, 'value');
}

export function setVal(e: HTMLElement, v: string) {
  setProp(e, 'value', v);
}

export function on(e: EventTarget, n: string, f: (e: Event) => void, capture?: boolean) {
  f && e.addEventListener(n, f as (e: Event) => void, !!capture);
}

export function off(e: EventTarget, n: string, f: (e: Event) => void, capture?: boolean) {
  e.removeEventListener(n, f as (e: Event) => void, !!capture);
}

export function hasClass(e: Element, c: string): boolean {
  if (e.classList) {
    return e.classList.contains(c);
  }

  if (!e.className) {
    return false;
  }
  return e.className.split(' ').indexOf(c) != -1;
}

export function setClass(e: Element, c: string) {
  e.className = c;
}

export function addClass(e: Element, ...c: string[]) {
  if (e.classList) {
    e.classList.add(...c);
    return;
  }

  if (!e.className) {
    // There are no current classes. Add the ones that were passed in.
    e.className = c.join(' ');
  } else {
    const classes = e.className.split(' ');
    for (const cn of c) {
      // Add classes that don't exist to the end.
      if (classes.indexOf(cn) === -1) {
        e.className += ' ' + c;
      }
    }
  }
}

export function removeClass(e: Element, ...c: string[]) {
  if (e.classList) {
    e.classList.remove(...c);
    return;
  }

  if (!e.className) {
    return; // No classes present.
  }

  const list = e.className.split(' ');
  for (const cn of c) {
    const idx = list.indexOf(cn);
    if (idx == -1) {
      continue; // c does not exist.
    }

    list.splice(idx, 1);
  }
  e.className = list.join(' ');
}

export function toggleClass(e: Element, c: string) {
  if (e.classList) {
    e.classList.toggle(c);
    return;
  }

  if (hasClass(e, c)) {
    removeClass(e, c);
  } else {
    addClass(e, c);
  }
}

export function switchClass(e: Element, c: string, on: boolean) {
  if (on) {
    addClass(e, c);
  } else {
    removeClass(e, c);
  }
}

export function remove(e: Node) {
  const p = e.parentElement;
  if (p) {
    p.removeChild(e);
  }
}

export function insert(e: Node | View, o: Node | View, b: Node | View) {
  const en: Node = (e instanceof View) ? e.e : e,
      on: Node = (o instanceof View) ? o.e : o,
      bn: Node = (b instanceof View) ? b.e : b;
  en.insertBefore(on, bn);
}

export function append(e: Node | View, o: Node | View) {
  const en: Node = (e instanceof View) ? e.e : e,
      on: Node = (o instanceof View) ? o.e : o;
  en.appendChild(on);
}

export function prepend(e: Node | View, o: Node | View) {
  const en: Node = (e instanceof View) ? e.e : e,
      on: Node = (o instanceof View) ? o.e : o;
  en.insertBefore(on, en.firstChild);
}
