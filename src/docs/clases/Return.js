import Type from'./Type';
import Value from'./Value';

class Return {

    constructor( _value, _type, _type_exp, _row, _column) {
        this.value = _value;
        this.type = _type;
        this.type_exp = _type_exp
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        if (this.value !== null) {
            let ret = this.value.operate(tab);
            if (ret !== null) {
                ret.used = false;
                return ret;
            }
        }else {
            return new Value("null",Type.CADENA,Type.NULL,this.row,this.column);
        }
        return null;
    }

}

export default Return;