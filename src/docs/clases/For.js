import Type from'./Type';
import SymbolTable from'./SymbolTable';
import Assignment from'./Assignment';
import Value from'./Value';
import { add_error_E } from './Reports';
import Declaration from './Declaration';

class For{
    constructor(_declaration, _exp, _assignment, _body, _row, _col) {
        this.declaration = _declaration;
        this.exp = _exp;
        this.assignment = _assignment;
        this.body = _body;
        this.row = _row;
        this.column = _col;
        this.type_exp = Type.SENTENCIA;
    }

    operate(tab) {
        let s = new SymbolTable(tab);
        let a;
        let assing = false;

        if(this.declaration instanceof Declaration)
        {
            this.declaration.operate(s);
            a = s.getSymbol(this.declaration.id);
        }else if (this.declaration instanceof Assignment)
        {
            this.declaration.operate(s)
            a = s.getSymbol(this.declaration.id);
            assing = true;
        }else
        {
            try{ add_error_E( {error: "Declaracion del for vacia", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }

        if (a === null) 
        {
            try{ add_error_E( {error: "Problema al declarar la variable For", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }else
        {
            if(this.exp === "in" || this.exp === "of")
            {
                let e = this.assignment.operate(s);
                if (e != null) {
                    if (e.type_exp === Type.VALOR) {
                        let a = new Assignment(new Value(this.declaration.id,Type.ID,Type.VALOR,this.row,this.col) , this.exp, this.row, this.column);
                        a.operate(s);
                        if (a != null) {
                            for (let i = 0; i < this.body.length; i++) {
                                if (this.body[i].type_exp === Type.RETURN) {
                                    let reE =  this.body[i].operate(s);
                                    if (reE != null) {
                                        return new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                                    } else {
                                        let ret = [];
                                        ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                                        let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                                        r.used = false;
                                        return r;
                                    }
                                }
                                this.body[i].used = true;
                                let eT = this.body[i].operate(s);
                                if (eT != null && eT.type_exp === Type.VALOR) {
                                    return eT;
                                } else if (eT != null && eT.type_exp === Type.BREAK) {
                                    return null;
                                } else if (eT != null && eT.type_exp === Type.CONTINUE) {
                                    break;
                                }
                            }
                        } else {
                            try{ add_error_E( {error:  "ASIGNACION Invalida para " + this.id + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                            return null;
                        }
        
                    } else  {
                        let t = [];
                        if (e.type_exp === Type.ARREGLO) {
                            if (e.value.length > 0) {
                                t = e.value;
                            }else
                            {
                                try{ add_error_E( {error:  "El array no tiene elementos", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                return null;
                            }
                        }
                        if(this.exp === "in")
                        {
                            for (let tp in t) {
                                s = new SymbolTable(tab);
                                if(assing === false)
                                    s.symbols.push(a);
                                let as = new Assignment(new Value(this.declaration.id,Type.ID,Type.VALOR,this.row,this.col), new Value(Number(tp),Type.ENTERO,Type.VALOR,this.row,this.column), this.row, this.column);
                                as.operate(s);
                                if (as != null) {
                                    for (let i = 0; i < this.body.length; i++) {
                                        if (this.body[i].type_exp === Type.RETURN) {
                                            let reE = this.body[i].operate(s);
                                            if (reE != null) {
                                                return new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                                            } else {
                                                let ret = [];
                                                ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                                                let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                                                r.used = false;
                                                return r;
                                            }
            
                                        }
                                        this.body[i].used = true;
                                        let eT = this.body[i].operate(s);
                                        if (eT != null && eT.type_exp === Type.VALOR) {
                                            return eT;
                                        } else if (eT != null && eT.type_exp === Type.BREAK) {
                                            return null;
                                        } else if (eT != null && eT.type_exp === Type.CONTINUE) {
                                            break;
                                        }
                                    }
                                } else {
                                    try{ add_error_E( {error:  "Hubo un error al realizar la asignacion de la variable " + this.id + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                }
                            }
                        }
                        else if(this.exp === "of")
                        {
                            for (let tp of t) {
                                s = new SymbolTable(tab);
                                if(assing === false)
                                    s.symbols.push(a);
                                let as = new Assignment(new Value(this.declaration.id,Type.ID,Type.VALOR,this.row,this.col), tp, this.row, this.column);
                                as.operate(s);
                                if (as != null) {
                                    for (let i = 0; i < this.body.length; i++) {
                                        if (this.body[i].type_exp === Type.RETURN) {
                                            let reE = this.body[i].operate(s);
                                            if (reE != null) {
                                                return new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                                            } else {
                                                let ret = [];
                                                ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                                                let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                                                r.used = false;
                                                return r;
                                            }
            
                                        }
                                        this.body[i].used = true;
                                        let eT = this.body[i].operate(s);
                                        if (eT != null && eT.type_exp === Type.VALOR) {
                                            return eT;
                                        } else if (eT != null && eT.type_exp === Type.BREAK) {
                                            return null;
                                        } else if (eT != null && eT.type_exp === Type.CONTINUE) {
                                            break;
                                        }
                                    }
                                } else {
                                    try{ add_error_E( {error:  "Hubo un error al realizar la asignacion de la variable " + this.id + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                }
                            }
                        }

                    }
                } else {
                    try{ add_error_E( {error: "Expresion No Valida para utilizar, se esperaba ID, VECTOR, MATRIZ, LISTA o VECTOR.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }
            else
            {
                while(true)
                {
                    let s = new SymbolTable(tab);
                    if(assing === false)
                        s.symbols.push(a);
                    let rr = this.exp.operate(s);
                    if (rr === null) {
                        try{ add_error_E( {error: "No se puede ejecutar la instruccion for, se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }
                    if (rr.type !== Type.BOOL) {
                        try{ add_error_E( {error: "No se puede ejecutar la operacion " + rr.type + ", se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null
                    }
                    if (rr.value === true) {
                        for (let i = 0; i < this.body.length; i++) {
                            if (this.body[i].type_exp === Type.RETURN) {
                                let reE = this.body[i].operate(s);
                                if (reE != null) {
                                    return new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                                } else {
                                    let ret = [];
                                    ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                                    let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                                    r.used = false;
                                    return r;
                                }

                            }
                            this.body[i].used = true;
                            let eT = this.body[i].operate(s);
                            if (eT != null && eT.type_exp === Type.VALOR) {
                                return eT;
                            } else if (eT != null && eT.type_exp === Type.BREAK) {
                                return null;
                            } else if (eT != null && eT.type_exp === Type.CONTINUE) {
                                break;
                            }
                        }
                        this.assignment.operate(s);
                        a = s.getSymbol(this.declaration.id);
                    }
                    else 
                        break;
                }

            }
        }
        return null;
    }
}

export default For;