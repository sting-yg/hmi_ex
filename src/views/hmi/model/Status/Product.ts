export class Product {
    isLoaded = null as null | boolean;
    code = null as null | string;

    from(param : any) : this{
        if('isLoaded' in param) this.isLoaded = param.isLoaded;
        if('code' in param) this.code = param.code
        return this;
    }
}