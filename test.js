import http from 'k6/http';
import {check} from 'k6';
export default function (){
    const result = http.get("http://test-api.k6.io");

    check(result, {
        'Result code is 200': (r) => r.status === 200,
    });
}