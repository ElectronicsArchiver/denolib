import { connect } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

var redis = async (options)=>{
    var c = await connect(options);
    return {
        exec: async (...args) => {
            return await c.executor.exec(...args);
        },
        pipeline: async (f)=>{
            var p = c.pipeline();
            await f({exec: p.executor.exec});
            await p.flush();
        },
        transaction: async (f)=>{
            var tx = c.tx();
            await f({exec: tx.executor.exec});
            await tx.flush();
        },
        subscribe: (...args)=>{
            return c.subscribe(...args);
        },
    };
};

export {redis};
