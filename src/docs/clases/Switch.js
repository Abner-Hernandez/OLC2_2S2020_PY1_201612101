import Type from './Type';
import SymbolTable from './SymbolTable';
import Value from './Value';
import { add_error_E } from './Reports';

class Switch {
    //used = false
    constructor(_exp, _body, _default, _row, _column) {
        this.exp = _exp;
        this.cases = _body;
        this.rdefault = _default;
        this.row = _row;
        this.column = _column;
        //this.elsebody = new LinkedList<>();
        this.type_exp = Type.SENTENCIA;
    }

    operate(tab) {
        //let count = new Count();
        
        if (this.exp === null) {
            try{ add_error_E( {error: "Se necesita una EXPRESION para comparar en el Switch.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            //count.putError(Type.SINTACTICO, "Se necesita una EXPRESION pra comparar en el Switch.", this.row, this.column);
            return null;
        }
        let tmpExp = this.exp.operate(tab);
        if (tmpExp === null || tmpExp.type_exp !== Type.VALOR) {
            try{ add_error_E( {error: "Error al Evaluar la EXPRESION en el Switch.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            //count.putError(Type.SEMANTICO, "Error al Evaluar la EXPRESION en el Switch.", this.row, this.column);
            return null;
        }
        for (let i = 0; i < this.cases.length; i++) {
            let tmpV = this.cases[i].exp.operate(tab);
            if (tmpV === null || tmpV.type_exp !== Type.VALOR) {
                //error
                try{ add_error_E( {error: "Error al Evaluar la EXPRESSION en el Switch, se esperaba VALOR.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                //count.putError(Type.SEMANTICO, "Error al Evaluar la EXPRESSION en el Switch, se esperaba VALOR.", this.row, this.column);
                return null;
            }
            let bool = false
            if (tmpExp.type === Type.ENTERO && tmpV.type === Type.ENTERO) {
                if (tmpExp.value === tmpV.value) {
                    bool = true;
                }
            } else if (tmpExp.type === Type.DECIMAL && tmpV.type === Type.DECIMAL) {
                if (tmpExp.value === tmpV.value) {
                    bool = true;
                }
            } else if (tmpExp.type === Type.CADENA && tmpV.type === Type.CADENA) {
                if (tmpExp.value === tmpV.value) {
                    bool = true;
                }
            } else if (tmpExp.type === Type.BOOL && tmpV.type === Type.BOOL) {
                if (tmpExp.value === tmpV.value) {
                    bool = true;
                }
            } else {
                try{ add_error_E( {error: "EL Valor de la EXPRESION de Switch y la EXPRESION de Case deben ser del mismo TIPO.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "EL Valor de la EXPRESION de Switch y la EXPRESION de Case deben ser del mismo TIPO.", row, column));
                return null;
            }
            if (bool) {
                let s = new SymbolTable(tab);
                for (let nn = 0; nn< this.cases[i].body.length; nn++) {
                    if (this.cases[i].body[nn].type_exp === Type.RETURN) {
                        let reE = this.cases[i].body[nn].operate(s);
                        if (reE !== null) {
                            let r = new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                            r.used = false;
                            return r;
                        } else {
                            let ret = [];
                            ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                            let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                            r.used = false;
                            return r;
                        }

                    } else {
                        this.cases[i].body[nn].used = true;
                        let eT = this.cases[i].body[nn].operate(tab);
                        if (eT != null && eT.type_exp == Type.VALOR) {
                            if (!eT.used) {
                                eT.used = true;
                                return eT;
                            }
                        } else if (eT != null && (eT.type_exp == Type.BREAK || eT.type_exp == Type.CONTINUE)) {
                            return null;
                        }
                    }

                }
            }
            

        }
        let s = new SymbolTable(tab);
        if (this.rdefault !== null) {
            for (let i = 0; i<this.rdefault.length; i++) {
                if (this.rdefault[i].type_exp === Type.RETURN) {
                    let reE =  this.rdefault[i].operate(s);
                    if (reE !== null) {
                        let r = new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                        r.used = false;
                        return r;
                    } else {
                        let ret = [];
                        ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                        let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                        r.used = false;
                        return r;
                    }

                } else {
                    this.rdefault[i].used = this.used;
                    let eT = this.rdefault[i].operate(tab);
                    if (eT !== null && eT.type_exp === Type.VALOR) {
                        if (!eT.used) {
                            eT.used = true;
                            return eT;
                        }

                    } else if (eT !== null && (eT.type_exp === Type.BREAK || eT.type_exp === Type.CONTINUE)) {
                        return eT;
                    }
                }
            }
        
        }
        return null;
    }

}

export default Switch;