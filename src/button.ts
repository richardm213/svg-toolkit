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
import { SVG, Svg, G, Rect, Container, Text, Box } from "./core";

class Button extends Widget {
  private _rect: Rect;
  private _group: G;
  private _text: Text;
  private _input: string;
  private _fontSize: number;
  private _text_y: number;
  private _text_x: number;
  private defaultText: string = "Button";
  private defaultFontSize: number = 18;
  private defaultWidth: number = 80;
  private defaultHeight: number = 30;
  private defaultColor: string = "#0884fc";
  private lightColor: string = "#51a8fd";

  constructor(parent: Window) {
    super(parent);
    this.height = this.defaultHeight;
    this.width = this.defaultWidth;
    this._input = this.defaultText;
    this._fontSize = this.defaultFontSize;
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

  set fontSize(size: number) {
    this._fontSize = size;
    this.update();
  }

  private positionText() {
    let box: Box = this._text.bbox();
    this._text_y = +this._rect.y() + +this._rect.height() / 2 - box.height / 2;
    this._text.x(+this._rect.x() + 13);
    if (this._text_y > 0) {
      this._text.y(this._text_y);
    }
  }

  move(x: number, y: number): void {
    if (this._group != null) this._group.move(x, y);
    this.update();
  }

  render(): void {
    this._group = this.parent.window.group();
    this._rect = this._group
      .rect(this.width, this.height)
      .stroke({ color: "black", width: 2 });
    this._text = this._group
      .text(this._input)
      .fill("white")
      .font({ family: "Helvetica" });
    this._group
      .rect(this.width, this.height)
      .opacity(0)
      .stroke({ color: "black", width: 3 });
    this.registerEvent(this._group);
    this.registerEvent(this._rect);
  }

  update(): void {
    if (this._text != null) this._text.font("size", this._fontSize);
    this._text.text(this._input);
    this.positionText();
    if (this._rect != null) this._rect.fill(this.backcolor);
  }

  transition(inputType: InputType, event: any): void {
    var previous = this.currentState();
    if (inputType == InputType.MouseDown) {
      if (this.currentState() == States.Hover) {
        this.current = States.Pressed;
        this.pressedstate();
      }
    } else if (inputType == InputType.MouseUp) {
      if (this.currentState() == States.HoverPressed) {
        this.current = States.Hover;
        this.hoverstate();
      } else if (this.currentState() == States.IdleDn) {
        this.current = States.IdleUp;
      } else if (this.currentState() == States.Pressed) {
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
      } else if (this.currentState() == States.PressedOut) {
        this.current = States.Pressed;
      }
    } else if (inputType == InputType.MouseOut) {
      if (this.currentState() == States.HoverPressed) {
        this.current = States.IdleDn;
      } else if (this.currentState() == States.Hover) {
        this.current = States.IdleUp;
        this.idleupstate();
      } else if (this.currentState() == States.Pressed) {
        this.current = States.PressedOut;
      }
    }
    if (previous != this.currentState()) {
      this.raise(inputType, event);
    }
  }

  private hoverstate() {
    this._rect.stroke({ width: 3 });
    this.backcolor = this.lightColor;
  }
  private pressrelease() {
    this._rect.stroke("black");
    this._text.dx(-0.5);
  }
  private idleupstate() {
    this._rect.stroke({ width: 2 });
    this.backcolor = this.defaultColor;
  }
  private pressedstate() {
    this.backcolor = this.defaultColor;
    this._rect.stroke("lightgray");
    this._text.dx(0.5);
  }
}

export { Button };
