exports.ArgumentParser = function(args){
    this.GetParamValue = (param, def) => {
        var value;
        if(this.HasParam(param))
            value = args[args.indexOf(param) + 1];
        else
            value = def;
        if(typeof value == 'undefined' )
            value = def;

        if(value == "#error"){
            throw "Error: Required param: " + param;
        }
        
        return value;
    }

    this.HasParam = (param) => {
        return args.indexOf(param) > -1;
    }

}