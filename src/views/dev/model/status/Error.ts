export class Error {
    message = '';
    codeName = '';
    codeNo = 0;
    occurenceTime = '';
    codeAndMessage = '';

    fromPacket(param: any) : this {
        if('Message' in param) this.message = param.Message;
        if('CodeName' in param) this.codeName = param.CodeName;
        if('CodeNo' in param) this.codeNo = param.CodeNo;
        if('OccurenceTime' in param) this.occurenceTime = param.OccurenceTime;
        if('CodeAndMessage' in param) this.codeAndMessage = param.CodeAndMessage;
        return this;
    }
}