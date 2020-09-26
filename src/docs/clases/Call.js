import Type from'./Type';
import Symbol from'./Symbol';
import { add_error_E } from './Reports';
import SymbolTable from'./SymbolTable';

class Call {
    constructor(_id, _type, _type_exp, _param, _row, _column) {
        this.id = _id;
        this.type = _type;
        if (_param === null) {
            this.param = []
        } else {
            this.param = _param;
        }
        this.type_exp = _type_exp;
        this.column = _column;
        this.row = _row;

    }

    operate(tab) {
        this.type_exp = Type.LLAMADA;

        let f = tab.getFunction(this.id);
        if (f === null) {
            try{ add_error_E( {error: "Funcion: " + this.id + ", No Declarada.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }

        let s = new SymbolTable(tab);

        if (f.param !== null) {
            if (f.param.length !== this.param.length) {
                try{ add_error_E( {error: "La cantidad de parametros no coinside", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            for (let i = 0; i < f.param.length; i++) {
                let tmpV = this.param[i].operate(s);
                if (tmpV === null) {
                    try{ add_error_E( {error: "Parametro en la posicion "+(i+1)+" NO VALIDO.", line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                }else if (tmpV.type === f.param[i].type)
                {
                    s.addSymbolDirect(new Symbol(f.param[i].id, tmpV.value, tmpV.type, tmpV.type_exp, Type.LOCAL, Type.VAR, tmpV.row, tmpV.column));
                }
                else
                {
                    try{ add_error_E( {error: "Parametro en la posicion "+(i+1)+" no es del mismo tipo al esperado", line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    return null;
                }

            }
        }
        for (let i = 0; i < f.body.length; i++) {
            if (f.body[i].type_exp === Type.RETURN) {

                let reE = f.body[i].operate(s);
                if(reE.type === f.type)
                    return reE;
                else
                {
                    try{ add_error_E( {error: "Error de tipo de retorno.", line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
                    
            } else {
                let eT = f.body[i].operate(s);
                if (eT != null/* && eT.type_exp == VALOR*/) {
                    if (!eT.used) {
                        eT.used = true;
                        return eT;
                    }

                }                        
            }
        }
        return null
    }

}

export default Call;