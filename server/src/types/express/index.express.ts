declare global{
    namespace Express{
        interface Request{
            _id:String
            role:String,
        }
    }
}

export {};