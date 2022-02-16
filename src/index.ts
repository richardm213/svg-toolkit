import {Window} from "./core"
import {Button} from "./button"

let w = new Window('500','500');
// This just monitors events
w.attach(function(input, event){
    console.log(input);
})

// For testing, we'll create a text box and add it to the window
// to use for displaying button click messages

let test_text = w.window.group().text("Click the Button!").move(10,20);
test_text.font('size', 40);


let btn = new Button(w);
btn.text = "Button 1"
btn.fontSize = 20
btn.move(50, 150)

// Attach anonymous function to state change event handler.
// button click event is raised by transition table of widget.
// You can attach as many functions as you want to each widget.
// this functionality is handled by Widget base class
btn.stateEvent().attach(function(input, event){
    test_text.text("Button was clicked");
});
