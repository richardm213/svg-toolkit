import { InputType, States, Window } from "./core";
import { Button } from "./button";
import { CheckBox } from "./checkbox";
import { RadioButton } from "./radiobutton";
import { TextBox } from "./textbox";
import { ScrollBar } from "./scrollbar";
import { ProgressBar } from "./progressbar";
import { ToggleButton } from "./custom";
import { RadioButtonGroup } from "./radiobuttongroup";
import { CheckBoxGroup } from "./checkboxgroup";

let w = new Window("700", "700");
// This just monitors events
w.attach(function (input, event) {
  // console.log(input);
});
w.window.group().text("Survey").move(300, 40).font("size", 40);
w.window
  .group()
  .text("Email me a copy of my responses:")
  .move(25, 25)
  .font("size", 15);
w.window
  .group()
  .text("1. Which of these if your favorite:")
  .move(200, 100)
  .font("size", 24);
w.window
  .group()
  .text("2. What is your favorite TV show:")
  .move(200, 300)
  .font("size", 24);
w.window
  .group()
  .text("3. Which of the following music artists do you like:")
  .move(125, 400)
  .font("size", 24);

var t = w.window.group().text("").move(470, 590).font("size", 15);
var b = false;
let radioButtonGroup = new RadioButtonGroup(w, 3);
radioButtonGroup.move(300, 145);
radioButtonGroup.list1[0].text = "Potatoes";
radioButtonGroup.list1[1].text = "Meat";
radioButtonGroup.list1[2].text = "Veggies";
let checkBoxGroup = new CheckBoxGroup(w);
checkBoxGroup.move(300, 445);
checkBoxGroup.list1[0].text = "Kanye";
checkBoxGroup.list1[1].text = "Drake";
checkBoxGroup.list1[2].text = "Jay-Z";
let button = new Button(w);
button.move(300, 630);
button.text = "Submit";
let textBox = new TextBox(w);
textBox.move(150, 335);
textBox.text = "The Office";
let scrollBar = new ScrollBar(w);
scrollBar.move(650, 50);
scrollBar.setHeight(190);
let progressBar = new ProgressBar(w);
progressBar.move(470, 600);
progressBar.increment = 13;
progressBar.barwidth = 21;
progressBar.setWidth(150);
let toggleButton = new ToggleButton(w);
toggleButton.move(75, 60);

button.stateEvent().attach(function (input, event) {
  if (button.currentState() == States.Pressed) {
    console.log("Button has been pressed");
    if (!b) {
      setInterval(() => progressBar.incrementBar(), 200);
      t.text("Submitting your responses...");
      b = true;
    }
  }
  console.log("Button state has changed", button.currentState());
});

radioButtonGroup.stateEvent().attach(function (input, event) {
  if (radioButtonGroup.currentState() == States.Pressed) {
    console.log(
      "Radio button",
      +event.srcElement.instance.node.id,
      "has been checked"
    );
  }
  console.log(
    "Radio button",
    +event.srcElement.instance.node.id,
    "'s state has changed",
    radioButtonGroup.currentState()
  );
});

checkBoxGroup.stateEvent().attach(function (input, event) {
  if (checkBoxGroup.currentState() == States.Pressed) {
    console.log(
      "Check box",
      +event.srcElement.instance.node.id,
      "'s checked state has changed."
    );
  }
  console.log(
    "CheckBox",
    +event.srcElement.instance.node.id,
    "'s state has changed",
    checkBoxGroup.currentState()
  );
});

textBox.stateEvent().attach(function (input, event) {
  if (input == InputType.KeyPress) {
    console.log("Text has been changed. Current text is:", textBox.currentText);
  } else {
    console.log("Text box state has changed", textBox.currentState());
  }
});

scrollBar.stateEvent().attach(function (input, event) {
  if (scrollBar.currentState() == States.Pressed) {
    console.log(
      "Current thumb x is",
      scrollBar.thumbX,
      "and current thumb y is",
      scrollBar.thumbY
    );
  }
  if (input == InputType.MouseUp) {
    if (scrollBar.direction == 1) {
      console.log("Scroll bar has been moved up");
    } else if (scrollBar.direction == -1) {
      console.log("Scroll bar has been moved down");
    } else {
      console.log("Scroll bar has not been moved.");
    }
  }
  console.log("Scroll bar state has changed", scrollBar.currentState());
});

progressBar.stateEvent().attach(function (input, event) {
  if (event == "bar has moved") {
    console.log("Progress Bar has been incremented by", progressBar.increment);
  } else {
    console.log("Progress Bar state has changed.", progressBar.currentState());
  }
});

toggleButton.stateEvent().attach(function (input, event) {
  if (toggleButton.currentState() == States.Pressed) {
    if (toggleButton.onOff) {
      console.log("Toggle Button is ON");
    } else {
      console.log("Toggle Button is OFF");
    }
  }
  console.log("Toggle Button state has changed.", toggleButton.currentState());
});
