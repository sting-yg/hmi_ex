export class SubState {
    name = '';
    state = '';

    fromPacket(param: any) : this {
        if('name' in param) this.name = param.name;
        if('state' in param) this.state = param.state;
        return this;
    }
}
