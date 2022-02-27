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

class ScrollBar extends Widget {
  private _rect: Rect;
  private _rect2: Rect;
  private _group: G;
  private _input: string;
  private _fontSize: number;
  private defaultFontSize: number = 18;
  private defaultWidth: number = 30;
  private defaultHeight: number = 160;
  private defaultColor: string = "#0884fc";
  private lightColor: string = "#51a8fd";
  private backcolor2: string;
  private firstY: number;
  private topY: number;
  private bottomY: number;
  private _direction: number = 0;
  private val1: number;

  constructor(parent: Window) {
    super(parent);
    this.height = this.defaultHeight;
    this.width = this.defaultWidth;
    this._fontSize = this.defaultFontSize;
    this.render();
    this.idleupstate();
  }

  setHeight(height: number) {
    this.height = height;
    this.update();
  }

  get thumbX(): number {
    return +this._rect2.x();
  }

  get thumbY(): number {
    return +this._rect2.y();
  }

  get direction(): number {
    return this._direction;
  }

  move(x: number, y: number): void {
    if (this._group != null) this._group.move(x, y);
    this.update();
  }

  render(): void {
    this._group = this.parent.window.group();
    this._rect = this._group
      .rect(this.width, this.height)
      .fill("white")
      .stroke({ width: 2, color: "black" });
    this._rect2 = this._group
      .rect(this.width, this.height * 0.3)
      .stroke({ width: 2, color: "black" })
      .y(0);

    this._rect2.attr("id", 1);
    this.registerEvent(this._group);
    this.registerEvent(this._rect2);
  }

  update(): void {
    if (this._rect != null) {
      this._rect.fill(this.backcolor);
      this._rect.height(this.height);
    }
    if (this._rect2 != null) {
      this._rect2.fill(this.backcolor2);
      this._rect2.height(this.height * 0.3);
    }
  }

  transition(inputType: InputType, event: any): void {
    if (
      inputType != InputType.KeyPress &&
      event.srcElement.instance.node.id == this._rect2.node.id
    ) {
      var previous = this.currentState();
      if (inputType == InputType.MouseMove) {
        if (this.currentState() == States.Pressed) {
          this.handlescrolling(event);
        }
      } else if (inputType == InputType.MouseDown) {
        if (this.currentState() == States.Hover) {
          this.current = States.Pressed;
          this.pressedstate();
          this.firstY = +event.clientY;
        }
      } else if (inputType == InputType.MouseUp) {
        if (this.currentState() == States.HoverPressed) {
          this.current = States.Hover;
          this.hoverstate();
        } else if (this.currentState() == States.IdleDn) {
          this.current = States.IdleUp;
        } else if (this.currentState() == States.Pressed) {
          this.current = States.IdleUp;
          console.log(this.val1, this.thumbY);
          if (this.thumbY > this.val1) {
            this._direction = -1;
          } else if (this.thumbY < this.val1) {
            this._direction = 1;
          } else {
            this._direction = 0;
          }
          this.val1 = this.thumbY;
          this.current = States.Hover;
          this.hoverstate();
          this.pressrelease();
        }
      } else if (inputType == InputType.MouseOver) {
        if (this.currentState() == States.IdleDn) {
          this.current = States.HoverPressed;
        } else if (this.currentState() == States.IdleUp) {
          this.current = States.Hover;
          this.hoverstate();
        }
      } else if (inputType == InputType.MouseOut) {
        if (this.currentState() == States.HoverPressed) {
          this.current = States.IdleDn;
        } else if (this.currentState() == States.Hover) {
          this.current = States.IdleUp;
          this.idleupstate();
        } else if (this.currentState() == States.Pressed) {
          this.current = States.IdleUp;
          this.idleupstate();
        }
      }
      if (previous != this.currentState()) {
        this.raise(inputType, event);
      }
    }
  }

  private hoverstate() {
    this.topY = +this._group.y();
    this.bottomY = +this._group.y() + this.height;
  }
  private pressrelease() {
    this._rect2.fill(this.defaultColor);
  }
  private idleupstate() {
    this.val1 = this.thumbY;
    this._rect2.fill(this.defaultColor);
  }
  private pressedstate() {
    this._rect2.fill(this.lightColor);
  }
  private handlescrolling(event: any) {
    var currentTopY = +this._rect2.y();
    var currentBottomY = currentTopY + this.height * 0.3;

    if (this.topY < currentTopY && this.bottomY > currentBottomY) {
      this._rect2.y(currentTopY + (event.clientY - this.firstY));
    }
    if (currentTopY <= this.topY) {
      if (event.clientY - this.firstY > 0) {
        this._rect2.y(currentTopY + (event.clientY - this.firstY));
      }
    }
    if (currentBottomY >= this.bottomY) {
      if (event.clientY - this.firstY < 0) {
        this._rect2.y(currentTopY + (event.clientY - this.firstY));
      }
    }
    this.firstY = event.clientY;
  }
}

export { ScrollBar };
