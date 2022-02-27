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
import { SVG, Svg, G, Rect, Container, Circle, Box } from "./core";

class ToggleButton extends Widget {
  private _circle: Circle;
  private _rect: Rect;
  private _group: G;
  private defaultText: string = "Button";
  private defaultFontSize: number = 18;
  private defaultWidth: number = 60;
  private defaultHeight: number = 30;
  private onColor: string = "#0884fc";
  private offColor: string = "lightgray";
  private insideColor: string = "white";
  private _onOff = false;

  constructor(parent: Window) {
    super(parent);
    this.height = this.defaultHeight;
    this.width = this.defaultWidth;
    this.render();
    this.idleupstate();
  }

  get onOff() {
    return this._onOff;
  }

  set onOff(onOff: boolean) {
    this._onOff = onOff;
  }

  move(x: number, y: number): void {
    if (this._group != null) this._group.move(x, y);
    this.update();
  }

  render(): void {
    this._group = this.parent.window.group();

    this._rect = this._group
      .rect(this.width, this.height)
      .radius(15)
      .stroke({ color: "black", width: 2 });
    this._circle = this._group
      .circle(this.height - 3, this.height - 3)
      .move(2, 1.5)
      .stroke({ color: "gray", width: 2 })
      .attr("id", 1);
    this.registerEvent(this._group);
    this.registerEvent(this._circle);
  }

  update(): void {
    if (this._rect != null) this._rect.fill(this.backcolor);
    if (this._circle != null) this._circle.fill(this.insideColor);
  }

  transition(inputType: InputType, event: any): void {
    if (
      inputType != InputType.KeyPress &&
      event.srcElement.instance.node.id == 1
    ) {
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
  }

  private hoverstate() {
    this.insideColor = "lightgray";
    this.update();
  }
  private pressrelease() {}
  private idleupstate() {
    this.insideColor = "white";
    if (this.onOff == false) {
      this.backcolor = this.offColor;
    } else {
      this.backcolor = this.onColor;
    }
    this.update();
  }
  private pressedstate() {
    this.insideColor = "white";
    this.backcolor = this.offColor;
    if (this.onOff == false) {
      this.onOff = true;
      this._circle.x(+this._circle.x() + this.width - this.height);
      this.backcolor = this.onColor;
    } else {
      this.onOff = false;
      this._circle.x(+this._circle.x() - this.width + this.height);
      this.backcolor = this.offColor;
    }
    this.update();
  }
}

export { ToggleButton };
