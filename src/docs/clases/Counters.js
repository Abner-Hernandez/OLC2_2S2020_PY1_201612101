const Type = require('./Type');

function Counter() {

    this.clearAll = function () {
        Counter.temporals = 0;
        Counter.labels = 0;
        Counter.output = '';
        Counter.errors = '';
        Counter.exitret = [];
        Counter.id = 0;
        Counter.p = 0;
        Counter.h = 0;
        Counter.relative = [];
        Counter.inits = [];
        Counter.finals = [];
        Counter.Rsymbol = [];
        Counter.Rerror = [];
        Counter.Rfunction = [];
        Counter.tagsvf = [];
    }

    this.setExitRet = function (tag) {
        Counter.exitret.push(tag);
    }

    this.clearExitRet = function () {
        Counter.exitret.pop();
    }

    this.getExitRet = function () {
        return Counter.exitret[Counter.exitret.length - 1];
    }

    this.getLastFinal = function () {
        return Counter.finals[Counter.finals.length - 1];
    }

    this.getLengthFinal = function () {
        return Counter.finals.length;
    }

    this.pushFinal = function (tag) {
        Counter.finals.push(tag);
    }

    this.popFinal = function (tag) {
        Counter.finals.pop();
    }

    this.pushTagsvf = function (tag) {
        Counter.tagsvf.push(tag);
    }

    this.popTagsvf = function () {
        Counter.tagsvf.pop();
    }

    this.getTagsvf = function () {
        return Counter.tagsvf[Counter.tagsvf.length-1];
    }

    this.getTagsSize = function () {
        return Counter.tagsvf.length;
    }

    this.getLastInit = function () {
        return Counter.inits[Counter.inits.length - 1];
    }

    this.getLengthInit = function () {
        return Counter.inits.length;
    }

    this.pushInit = function (tag) {
        Counter.inits.push(tag);
    }

    this.popInit = function (tag) {
        Counter.inits.pop();
    }

    this.getPPlus = function () {
        const r = Counter.p;
        Counter.p++
        return r;
    }

    this.getHPlus = function () {
        const r = Counter.h;
        Counter.h++;
        return r;
    }

    this.getP = function () {
        return Counter.p;
    }

    this.getH = function () {
        return Counter.h;
    }

    this.getRelativePlus = function () {
        const r = Counter.relative[Counter.relative.length - 1];
        Counter.relative[Counter.relative.length - 1]++;
        return r;
    }

    this.getRelative = function () {
        return Counter.relative[Counter.relative.length - 1];
    }

    this.newRelative = function () {
        Counter.relative.push(0);
    }

    this.resetRelative = function () {
        Counter.relative.pop();
    }

    this.generateInstruction = function (left, op, right) {
        var t = this.getNextTemporal();
        this.putInstruction(t + ' = ' + left + ' ' + op + ' ' + right + ';');
        return t;
    }

    this.generateIf = function (left, op, right) {
        var t = this.getNextLabel();
        this.putInstruction('if(' + right + ' ' + op + ' ' + left + ') goto ' + t + ';');
        return t;
    }

    this.generateIf2 = function (left, op, right, t) {
        //var t = this.getNextLabel();
        this.putInstruction('if(' + right + ' ' + op + ' ' + left + ') goto ' + t + ';');

    }

    this.operateRelational = function (left, op, right) {
        var tv = this.getNextLabel();
        var to = this.getNextLabel();
        var t1 = this.getNextTemporal();
        this.putInstruction('if(' + left + ' ' + op + ' ' + right + ') goto ' + tv + ';');
        this.putInstruction(t1 + ' = 0;');
        this.putInstruction('goto ' + to + ';');
        this.putInstruction(tv + ':');
        this.putInstruction(t1 + ' = 1;');
        this.putInstruction(to + ':');
        return t1;
    }

    this.generateDeclaration = function (tipo, value, relative) {
        var t = this.getNextTemporal();
        if (Type.GLOBAL == tipo) {
            this.putInstruction(t + ' = H;');
            this.putInstruction('H = H + 1;');
            //Counter.tempor++;
            this.putInstruction('heap[' + t + '] = ' + value + ';')
        } else {

            this.putInstruction(t + ' = P + ' + relative + ';');
            this.putInstruction('stack[' + t + '] = ' + value + ';')
        }
        return t;
    }

    this.paramFunc = function (tipo, relative) {
        var t = this.getNextTemporal();
        if (Type.GLOBAL == tipo) {
            this.putInstruction(t + ' = H;');
            this.putInstruction('H = H + 1;');
        } else {

            this.putInstruction(t + ' = P + ' + relative + ';');
        }
        return t;
    }

    this.paramCall = function (tipo, ambit, value, relative) {
        var t = this.getNextTemporal();
        if (Type.GLOBAL == tipo) {
            this.putInstruction(t + ' = H;');
            this.putInstruction('H = H + 1;');
            //Counter.tempor++;
            this.putInstruction('heap[' + t + '] = ' + value + ';')
        } else {

            this.putInstruction(t + ' = ' + ambit + ' + ' + relative + ';');
            this.putInstruction('stack[' + t + '] = ' + value + ';')
        }
        return t;
    }

    this.getNextTemporal = function () {
        var n = Counter.temporals;
        Counter.temporals++
        return 't' + n;
    }

    this.getNextLabel = function () {
        var r = Counter.labels;
        Counter.labels++;
        return 'l' + r;
    }

    this.getActualTemporal = function () {
        return 't' + Counter.temporals;
    }

    this.getActualLabel = function () {
        return 'l' + Counter.labels;
    }

    this.getOutput = function () {
        var temp = 'var t0';
        for (var i = 1; i <= Counter.temporals; i++) {
            temp += ',t' + i
        }
        temp += ';\nvar Stack[];\nvar Heap[];\nvar P=0;\nvar H=0;\n\n';
        Counter.output = temp + Counter.output;
        return Counter.output;
    }

    this.getGlobals = function () {
        var r = Counter.output;
        Counter.output = '';
        return r;
    }

    this.joinString = function (s1) {
        Counter.output = s1 + '\n' + Counter.output;
    }

    this.putPrincipal = function (idd, L) {
        Counter.output = 'call ' + idd + ';\n\ngoto ' + L + ';\n\n' + Counter.output;
    }

    this.putInstruction = function (instruction) {
        Counter.output += instruction + '\n';
    }

    this.getError = function () {
        //return Counter.errors;
        return Counter.Rerror;
    }

    this.putError = function (type, instruction, row, column) {
        //Counter.errors += 'ERROR ' + type + ', ' + instruction + ', Fila: ' + row + ', Columna: ' + column + '\n';
        Counter.Rerror.push({type: type, message: instruction, row: row, column: column});
    }

    this.getSymbol = function () {
        //return Counter.errors;
        return Counter.Rsymbol;
    }

    this.putSymbol = function (_ambit, _type, _type_exp, _type_var,  _type_c, _type_o, _id, _pointer,_tag) {
        //Counter.errors += 'ERROR ' + type + ', ' + instruction + ', Fila: ' + row + ', Columna: ' + column + '\n';
        Counter.Rsymbol.push({ambit: _ambit, type: _type, type_exp: _type_exp, type_var: _type_var, type_c:  _type_c, type_o: _type_o, id: _id, pointer: _pointer});
    }

    this.getFunction = function () {
        //return Counter.errors;
        return Counter.Rfunction;
    }

    this.putFunction = function (_ambit, _type, _type_exp, _type_o, _id, _param, _size, _row, _col) {
        //Counter.errors += 'ERROR ' + type + ', ' + instruction + ', Fila: ' + row + ', Columna: ' + column + '\n';
        Counter.Rfunction.push({ambit: _ambit, type: _type, type_exp: _type_exp, type_o: _type_o, id: _id, param: _param, size: _size, row: _row, column: _col});
    }

    this.newId = function () {
        return Counter.id++;
    }

    this.getId = function () {
        return Counter.id;
    }

}

Counter.temporals = 0;
Counter.labels = 0;
Counter.output = '';
Counter.errors = '';
Counter.exitret = [];
Counter.id = 0;
Counter.p = 0;
Counter.h = 0;
Counter.relative = [];
Counter.inits = [];
Counter.finals = [];
Counter.Rsymbol = [];
Counter.Rerror = [];
Counter.Rfunction = [];
Counter.tagsvf = [];

export default Counter;