export class Contact {
    constructor(
        public firstName:string,
        public lastName:string,
        public phoneNumber:number,
        public email?:string,
        public birthday?:string,
        public relationship?:string,
        public jobTitle?:string,
        public address?:string,
        public website?:string,
        public eventTitle?:string,
        public eventDate?:string,
        public notes?:string,
        public pictureUrl?:any,
        public contactId?:string,
        public userId?:string
    ) {}
}