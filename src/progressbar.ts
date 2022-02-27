// importing local code, code we have written
import {
  Window,
  Widget,
  WidgetState,
  IWidgetStateEvent,
  States,
  InputType,
} from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Box } from "./core";

class ProgressBar extends Widget {
  private _rect: Rect;
  private _rect2: Rect;
  private _group: G;
  private _input: string;
  private defaultWidth: number = 120;
  private defaultHeight: number = 30;
  private defaultIncrement: number = 1;
  private backcolor2: string = "#0884fc";
  private _increment: number = 1;
  private _barwidth: number;

  constructor(parent: Window) {
    super(parent);
    this.height = this.defaultHeight;
    this.width = this.defaultWidth;
    this._barwidth = 0;
    this._increment = this.defaultIncrement;
    this.render();
    this.idleupstate();
  }

  set text(text: string) {
    this._input = text;
    this.update();
  }

  get text(): string {
    return this._input;
  }

  set barwidth(width: number) {
    this._barwidth = width;
    this.update();
  }

  setWidth(width: number) {
    this.width = width;
    this.update();
  }

  get barwidth(): number {
    return this._barwidth;
  }

  set increment(increment: number) {
    this._increment = increment;
  }

  get increment(): number {
    return this._increment;
  }

  set fontSize(size: number) {
    this.update();
  }
  move(x: number, y: number): void {
    if (this._group != null) this._group.move(x, y);
    this.update();
  }

  render(): void {
    this._group = this.parent.window.group();
    this._rect = this._group
      .rect(this.width, this.height)
      .stroke({ color: "black", width: 2 })
      .fill("white");
    this._rect2 = this._group
      .rect(this.barwidth, this.height)
      .stroke({ color: "black", width: 2 });
    this._group
      .rect(this.width, this.height)
      .stroke({ color: "black", width: 2 })
      .opacity(0);
    this.registerEvent(this._group);
  }

  update(): void {
    if (this._rect != null) {
      this._rect.width(this.width).fill(this.backcolor);
    }
    if (this._rect2 != null) {
      this._rect2.width(this.barwidth).fill(this.backcolor2);
    }
  }

  transition(inputType: InputType, event: string): void {
    var previous = this.currentState();
    if (inputType == InputType.MouseOver) {
      this.current = States.Hover;
    } else if (inputType == InputType.MouseOut) {
      this.current = States.IdleUp;
    }
    if (previous != this.currentState()) {
      this.raise(inputType, event);
    }
  }
  incrementBar() {
    if (this.barwidth == this.width) {
      this.barwidth = 0;
    } else if (
      this.barwidth + (this.increment / 100) * this.width >
      this.width
    ) {
      this.barwidth = this.width;
    } else if (this.barwidth < this.width) {
      this.barwidth += (this.increment / 100) * this.width;
    }
    this.raise(InputType.KeyPress, "bar has moved");
  }
  private idleupstate() {}
}

export { ProgressBar };
