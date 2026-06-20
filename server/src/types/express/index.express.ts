declare global{
    namespace Express{
        interface Request{
            _id:string
            role:string,
        }
    }
}

export {};