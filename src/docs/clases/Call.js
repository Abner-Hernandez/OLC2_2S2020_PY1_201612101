import Type from'./Type';
import Symbol from'./Symbol';
import { add_error_E } from './Reports';

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
            //olc2_p1.IDE.txtExec += "Error Semantico, Funcion: " + id + ", No Declarada. Linea: " + row + " Columna: " + column + "\n";
            //count.putError(Type.SEMANTICO, "Funcion: " + this.id + ", No Declarada.", this.row, this.column);
            return null;
        }

        if (f.param !== null) {
            if (f.param.length !== this.param.length) {
                //error la cantidad de parametros no coincide
                try{ add_error_E( {error: "La cantidad de parametros no coinside", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
            }
            //f.addParamet(this.param);
            for (let i = 0; i < f.param.length; i++) {
                let tmpV = this.param.get(i).operate(tab);
                if (tmpV === null) {
                    try{ add_error_E( {error: "Parametro en la posicion "+(i+1)+" NO VALIDO.", line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    //olc2_p1.IDE.txtExec += "Error Semantico, Parametro en la posicion "+(i+1)+" NO VALIDO. Linea: " + row + " Columna: " + column + "\n";
                    //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "Parametro en la posicion "+(i+1)+" NO VALIDO.", row, column));
                    return null;
                }else if (tmpV.type === f.param[i].type)
                {
                    f.symbolTab.addSymbolDirect(new Symbol(this.param.get(i).id, tmpV.value, tmpV.type, tmpV.type_exp, Type.LOCAL, Type.VAR, tmpV.row, tmpV.column));
                }//new Declaration([$1],null,$3.id,$3.access,Type.LOCAL,Type.VAR,Type.PRIMITIVO,0,this._$.first_line,this._$.first_column) (_id, _value, _type, _type_exp, _type_var, _type_c, _type_o, _ambit, _row, _column)

            }
        }
        for (let i = 0; i < f.body.length; i++) {
            if (f.body.get(i).type_exp === Type.RETURN) {

                let reE = f.body.get(i).operate(tab);
                if(reE.type === f.type)
                    return reE;
                else
                {
                    try{ add_error_E( {error: "Error de tipo de retorno.", line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    //error de tipo de retorno
                }
                    
            } else {
                f.body.get(i).operate(tab);
            }

        }
    }

}

export default Call;