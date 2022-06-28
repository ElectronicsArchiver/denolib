
import { AES , hexdecode , hexencode , randomBytes } from './deps.ts'

var crypto = (key) => {
    if(key.length != 32){
        throw new Error("crypto key must be 32 length");
        return;
    }
    return {
        encrypt: async (k, v) => {
            var text = JSON.stringify({
                k: k,
                v: v,
                t: parseInt(Date.now() / 1000),
            });
            var iv = randomBytes(16);
            var kv = new AES(key, { mode: "cfb", iv: iv });
            var b = await kv.encrypt(text);
            return new TextDecoder().decode(hexencode(new Uint8Array([...iv, ...b])));
        },
        decrypt: async (k, c, lifecycle) => {
            var b = hexdecode(new TextEncoder().encode(c));
            var kv = new AES(key, { mode: "cfb", iv: b.slice(0, 16) });
            var r = await kv.decrypt(b.slice(16));
            var o = JSON.parse(r.toString());
            if (lifecycle && o.t + lifecycle < parseInt(Date.now() / 1000)) {
                return null;
            }
            if (o.k !== k) {
                return null;
            }
            return o.v;
        },
    };
};

export default crypto;
