import Type from './Type'
import { add_error_E } from './Reports';

class Value {
    type_var = '';
    used = false
    constructor(val, t, te, _row, _column) {
        this.value = val;
        this.type = t;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
        this.positions = [];
    }

    add_positions(positions)
    {
        this.positions = positions;
    }

    operate(tab) {
        //const cont = new count();
        if (this.type_exp === Type.VALOR+"") {
            switch (this.type) {
                case Type.ENTERO:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);

                case Type.DECIMAL:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);

                case Type.DEFAULT:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);

                case Type.CADENA:
                    this.value = this.value.replace(/\\n/g, '\n');
                    this.value = this.value.replace(/\\t/g, '\t');
                    this.value = this.value.replace(/\\r/g, '\r');
                    if (this.value.toString().startsWith("\"")) {
                        this.value = this.value.toString().substring(1, this.value.toString().length - 1);
                    }
                    this.value = this.value.toString().replace(/\\\"/g, "\"");
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);

                case Type.BOOL:
                    return new Value(this.value, this.type, this.type_exp, this.row, this.column);
                case Type.NULL:
                    return new Value('null', Type.NULL, Type.VALOR, this.row, this.column);
                case Type.CARACTER:
                    var ret = this.value.replace(/'/g,'');
                    
                    if(String(ret) === "\\n"){
                        return new Value(10, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if(ret === "\\r"){
                        return new Value(8, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if(ret === "\\t"){
                        return new Value(9, Type.CARACTER, Type.VALOR, this.row, this.column);
                    }
                    return new Value(ret.charCodeAt(0), Type.CARACTER, Type.VALOR, this.row, this.column);
                case Type.ID:
                    var a = tab.exists(this.value+"");
                    if (a) {
                        var r = tab.getSymbol(this.value+"");
                        return new Value(r.value, r.type, r.type_exp, this.row, this.column);
                    } else {
                        try{ add_error_E( {error: "La variable: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
                        //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "Variable " + value.toString() + " no encontrada.", row, column));
                        return null;
                    }
                case Type.ARREGLO:
                    var i = 0;
                    var aux_return = null;
                    while(i < this.value.length)
                    {
                        if (i === 0)
                        {
                            var a = tab.exists(this.value[i].value+"");
                            if (a) {
                                var r = tab.getSymbol(this.value[i].value+"");
                                if(r.type === Type.ARREGLO)
                                {
                                    var j = 0;
                                    try
                                    {
                                        aux_return = r.value[this.value[i].positions[j].value];
                                    }catch(error){try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){} return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);}
                                    j++;
                                    while(j < this.value[i].positions.length)
                                    {
                                        try
                                        {
                                            aux_return = aux_return[this.value[i].positions[j].value];
                                        }catch(error){}
                                        j++;
                                    }
                                }else if(r.type === Type.ID)
                                    aux_return = r;
                            } else {
                                try{ add_error_E( {error: "La variable: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
                                return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);
                            }
                        }else
                        {
                            try
                            {
                                var find = false;
                                for(var dat of aux_return)
                                {
                                    if(this.value[i].value === dat[0])
                                    {
                                        aux_return = dat[1];
                                        find = true;
                                        break;
                                    }
                                }
                                if(!find)
                                {
                                    try{ add_error_E( {error: "El atributo no existe", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
                                    return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);
                                }

                                if(this.value[i].type == Type.ARREGLO)
                                {
                                    aux_return = aux_return.value
                                    var j = 0;
                                    try
                                    {
                                        aux_return = r.value[this.value[i].positions[j].value];
                                    }catch(error){try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){} return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);}
                                    j++;
                                    while(j < this.value[i].positions.length)
                                    {
                                        try
                                        {
                                            aux_return = aux_return[this.value[i].positions[j].value];
                                        }catch(error){}
                                        j++;
                                    }
                                }
                            }catch(error){try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){} return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);}

                        }
                        i = i + 1;
                    }
                    return new Value(aux_return.value, aux_return.type, aux_return.type_exp, this.row, this.column);
                default:
                    try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
                        //this.count.putError(Type.SEMANTICO, "Tipo " + this.type + " no Valido.", this.row, this.column);
                    return new Value(null, Type.ERROR, Type.ERROR, this.row, this.column);
                    
            }
        } else {

        }
    }

}

export default Value;