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
                    return new Value(undefined, undefined, Type.VALOR, this.row, this.column);
                case Type.CARACTER:
                    let ret = this.value.replace(/'/g,'');
                    
                    if(String(ret) === "\\n"){
                        return new Value(10, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if(ret === "\\r"){
                        return new Value(8, Type.CARACTER, Type.VALOR, this.row, this.column);
                    } else if(ret === "\\t"){
                        return new Value(9, Type.CARACTER, Type.VALOR, this.row, this.column);
                    }
                    return new Value(ret.charCodeAt(0), Type.CARACTER, Type.VALOR, this.row, this.column);
                case Type.CADENA:
                    this.valuevalue = this.value.toString().replace("\\n", "\n");
                    this.value = this.value.toString().replace("\\t", "\t");
                    this.value = this.value.toString().replace("\\r", "\r");
                    if (this.value.toString().startsWith("\"")) {
                        this.value = this.value.toString().substring(1, this.value.toString().length() - 1);
                    }
                    this.value = this.value.toString().replace("\\\"", "\"");
                    return new Value(this.value.toString(), Type.CADENA, this.type_exp, this.row, this.column);
                case Type.ID:
                    let a = tab.exists(this.value+"");
                    if (a) {
                        let r = tab.getSymbol(this.value+"");
                        return new Value(r.value, r.type, r.type_exp, this.row, this.column);
                    } else {
                        try{ add_error_E( {error: "La variable: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "Variable " + value.toString() + " no encontrada.", row, column));
                        return null;
                    }
                case Type.ARREGLO:
                    let i = 0;
                    let aux_return = null;
                    while(i < this.value.length)
                    {
                        if (i === 0)
                        {
                            let a = tab.exists(this.value[i].value+"");
                            if (a) {
                                let r = tab.getSymbol(this.value[i].value+"");
                                if(r.type === Type.ARREGLO)
                                {
                                    let j = 0;
                                    try
                                    {
                                        aux_return = r.value[this.value[i].positions[j].value];
                                    }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                                    j++;
                                    while(j < this.value[i].positions.length)
                                    {
                                        try
                                        {
                                            aux_return = aux_return.value[this.value[i].positions[j].value];
                                        }catch(e){ console.log(e); }
                                        j++;
                                    }
                                }else if(r.type === Type.ID)
                                    aux_return = r;
                            } else {
                                try{ add_error_E( {error: "La variable: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                return null;
                            }
                        }else
                        {
                            try
                            {
                                let find = false;
                                for(let dat of aux_return)
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
                                    try{ add_error_E( {error: "El atributo no existe", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                    return null;
                                }

                                if(this.value[i].type === Type.ARREGLO)
                                {
                                    aux_return = aux_return.value
                                    let j = 0;
                                    try
                                    {
                                        aux_return = aux_return.value[this.value[i].positions[j].value];
                                    }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                                    j++;
                                    while(j < this.value[i].positions.length)
                                    {
                                        try
                                        {
                                            aux_return = aux_return[this.value[i].positions[j].value];
                                        }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}
                                        j++;
                                    }
                                }
                            }catch(e){ console.log(e); try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); } return null;}

                        }
                        if(i < this.value.length - 1 && this.value[i+1].value === ".pop()")
                        {
                            if(aux_return.type === Type.ARREGLO && aux_return.value.length > 0)
                            {
                                let aux =  aux_return.value.pop();
                                if(aux instanceof Value)
                                {
                                    return aux;
                                }
                            }else
                            {
                                try{ add_error_E( {error: "La variable no es un arreglo o no tiene elementos", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                return null;
                            }
                        }else if(i < this.value.length - 1 && this.value[i+1].value === "length")
                        {
                            if(aux_return.type === Type.ARREGLO)
                            {
                                return new Value(aux_return.value.length, Type.ENTERO, Type.VALOR, this.row, this.column);
                            }else
                            {
                                try{ add_error_E( {error: "La variable no es un arreglo no se puede devolver el tamaño", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                return null;
                            }
                        }
                        i = i + 1;
                    }
                    return new Value(aux_return.value, aux_return.type, aux_return.type_exp, this.row, this.column);
                default:
                    return this.assign_recursive_type(this.type, this.value, tab);
            }
        } else {

        }
    }

    assign_recursive_type(types, value, tab)
    {
        let value_return = [];
        let type = tab.find_type(types);
        if(type !== null)
        {
            if(value === null)
            {
                return new Value(undefined, undefined, Type.VALOR, this.row, this.column);;
            }
            if(type.atributes.length === value.length)
            {
                for(let at of value)
                {
                    let bol = false;
                    for(let at2 of type.atributes)
                    {
                        if(at[0] === at2.name)
                        {
                            bol = true;
                            if(tab.find_type(at2.type) === null)
                            {
                                let temp = at[1].operate(tab);
                                if(temp === null)
                                    return null;
                                if(temp.type !== at2.type)
                                {
                                    try{ add_error_E( {error: "El atributo no es del tipo correcto: " + temp.type + "con el del type: " + at2.type, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                    return null;
                                }
                                value_return.push([at2.name, temp]);
                                break;
                            }else
                            {
                                if(at[1].value === null)
                                {
                                    value_return.push([at2.name, new Value(undefined, undefined, Type.VALOR, this.row, this.column)]);
                                    break;
                                }else if(at[1].value instanceof Array)
                                    return this.assign_recursive_type(at2.type, at[1], tab)
                                else
                                {
                                    let a = tab.exists(at[1].value+"");
                                    if (a) {
                                        let r = tab.getSymbol(at[1].value+"");
                                        if(r.type === at2.type)
                                        {
                                            value_return.push([at2.name, r]);
                                            break;
                                        }else 
                                        {
                                            try{ add_error_E( {error: "El tipo de la variable a asignar no es el correcto", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                            return null;
                                        }
                                    } else {
                                        try{ add_error_E( {error: "La variable: " + this.value.toString() + "no a sido encontrada", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                        return null;
                                    }                                    
                                }
                            }
                        }
                    }
                    if(!bol)
                    {
                        try{ add_error_E( {error: "El atributo no existe: " + at[0] , type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null;
                    }
                }
                return new Value(value_return, type.name, Type.VALOR, this.row, this.column);
            }else
                try{ add_error_E( {error: "Faltan atributos", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                return null;
        }else
        {
            try{ add_error_E( {error: "Tipo " + this.type + " no Valido.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
    }

}

export default Value;
