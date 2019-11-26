class Jeff  {
    constructor() {
        this.name = `Jeff`;
        this.printName = () => console.log(this.name);
    }
}

class John {
    constructor() {
        this.name = `John`;
    }
}

jeff = new Jeff();
john = new John();
jeff.printName();
john.printName = jeff.printName;
john.printName();

class Test {
    constructor() {
        this.customProperty = 0;
    }
    getFunctionThatCanChangeCustomProperty() {
        return () => this.customProperty++
    }
    printCustomProperty() {
        console.log(this.customProperty);
    }
}
test = new Test();
let fun = test.getFunctionThatCanChangeCustomProperty();
test.printCustomProperty();
fun();
test.printCustomProperty();
