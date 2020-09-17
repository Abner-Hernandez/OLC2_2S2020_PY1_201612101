class Function {

    constructor(/*_ambit,*/ _type, _type_exp,/* _type_o,*/ _id, _param, _body/*, /*_size/*, _idd*/, _row, _col) {
        //this.ambit = _ambit;
        this.type = _type;
        this.type_exp = _type_exp;
        //this.type_o = _type_o;
        this.id = _id;
        if (_param == null) {
            this.param = []
        } else {
            this.param = _param;
        }
        this.body = _body;
        //this.size = _size;
        this.row = _row;
        this.column = _col;
        //this.idd = _idd;
        this.symbolTab = null;
    }

    operate(tab) {
    }

}

export default Function;