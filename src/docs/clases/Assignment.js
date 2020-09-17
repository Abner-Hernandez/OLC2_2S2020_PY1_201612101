import Type from './Type';
import { add_error_E } from './Reports';

class Assignment {
    constructor(_id, val, _row, _column) {
        this.value = val;
        this.id = _id;
        this.row = _row;
        this.column = _column;
        this.type = null;
    }

    change_tipe(tipo)
    {
        this.type = tipo;
    }

    operate(tab) {

        var a = tab.getSymbol(this.id);
        var tmpExp = this.value.operate(tab);

        if (tmpExp != null) {
            if (a == null) {
                try{ add_error_E( {error: "La variable no existe: " + this.id, type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
            }else {
                if(a.type_c !== Type.CONST)
                {
                    if(this.id instanceof Array)
                    {
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
                                        }catch(error){try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){} return null;}
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
                                    return null;
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
                                        return null;
                                    }
    
                                    if(this.value[i].type == Type.ARREGLO)
                                    {
                                        aux_return = aux_return.value
                                        var j = 0;
                                        try
                                        {
                                            aux_return = r.value[this.value[i].positions[j].value];
                                        }catch(error){try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){} return null;}
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
                                }catch(error){try{ add_error_E( {error: "La variable no es un arreglo o no existe la posicion", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){} return null;}
    
                            }
                            i = i + 1;
                        }
                        if(aux_return.type === a.type)
                        {
                            aux_return.type_exp = tmpExp.type_exp;
                            aux_return.value = tmpExp.value;
                        }
                    }else
                    {
                        if(tmpExp.type === a.type)
                        {
                            a.type_exp = tmpExp.type_exp;
                            a.value = tmpExp.value;
                        }
                    }
                }
                else
                {
                    try{ add_error_E( {error: "El valor de una constante no puede cambiar", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
                    return null;
                }
                
                
            }
        } else {
            try{ add_error_E( {error: "Hubo un error al realizar la asignacion de la variable " + this.id + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
            return null;
        }
        return null;

    }

}

export default Assignment;