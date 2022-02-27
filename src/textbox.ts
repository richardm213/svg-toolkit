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
import { SVG, Svg, G, Rect, Container, Text, Box, Line } from "./core";

class TextBox extends Widget {
  private _rect: Rect;
  private _group: G;
  private _line: Line;
  private _text: Text;
  private _input: string;
  private _fontSize: number;
  private _text_y: number;
  private _text_x: number;
  private defaultText: string = "Textbox";
  private defaultFontSize: number = 18;
  private defaultWidth: number = 450;
  private defaultHeight: number = 30;
  private defaultColor: string = "#0884fc";
  private typing: boolean = false;
  private _currentText: string;

  constructor(parent: Window) {
    super(parent);
    this.height = this.defaultHeight;
    this.width = this.defaultWidth;
    this._input = this.defaultText;
    this._fontSize = this.defaultFontSize;
    this._currentText = this.defaultText;
    this.render();
    this.idleupstate();
  }

  set text(text: string) {
    this._currentText = text;
    this.update();
  }

  get text(): string {
    return this._currentText;
  }

  get currentText(): string {
    return this._currentText;
  }

  set fontSize(size: number) {
    this._fontSize = size;
    this.update();
  }

  private positionText() {
    let box: Box = this._text.bbox();
    this._text_y = +this._rect.y() + +this._rect.height() / 2 - box.height / 2;
    this._text.x(+this._rect.x() + 4);
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
    this._line = this._group
      .line(this._text.length() + 5, 5, this._text.length() + 5, 25)
      .stroke({ color: "white", width: 2 });
    this._group
      .rect(this.width, this.height)
      .stroke({ color: "black", width: 2 })
      .opacity(0);
    this.registerEvent(this._group);
    // this.registerEvent(this._rect);
  }

  update(): void {
    if (this._text != null) this._text.font("size", this._fontSize);
    this._text.text(this._currentText);
    this._line.x(+this._rect.x() + this._text.length() + 5);
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
    } else if (inputType == InputType.KeyPress) {
      if (this.handletyping(event)) {
        this.raise(inputType, event);
      }
    }
    if (inputType != InputType.KeyPress && previous != this.currentState()) {
      this.raise(inputType, event);
    }
  }

  private hoverstate() {
    this._line.opacity(100);
    this.typing = true;
  }
  private pressrelease() {}
  private idleupstate() {
    this._line.opacity(0);
    this.typing = false;
    this.backcolor = this.defaultColor;
    this.text = this._currentText;
  }
  private pressedstate() {}
  private handletyping(event: any) {
    var changedtext = false;
    if (this.typing) {
      if (event.key == "Backspace") {
        if (this._currentText.length >= 1) {
          this._currentText = this._currentText.slice(0, -1);
          changedtext = true;
        }
      } else if (event.key != "Shift" && event.key != "CapsLock") {
        if (+this._line.x() + 10 < +this._rect.x() + this.width) {
          this._currentText = this._currentText + event.key;
          changedtext = true;
        }
      }
      this.text = this._currentText;
    }
    return changedtext;
  }
}
export { TextBox };
